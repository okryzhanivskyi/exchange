import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { ExceptionManager, ExceptionKey } from 'src/helpers/exception.helper';
import { FindUserFields } from './types';
import { UpdateUserDto } from './dto/update-user.dto';
import { Picture, PictureDocument } from 'src/picture/schemas/picture.schema';
import { Channel, ChannelDocument } from 'src/channel/schemas/channel.schema';

@Injectable()
export class UserService {
  constructor(
    private exceptionManager: ExceptionManager,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Picture.name) private pictureModel: Model<PictureDocument>,
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserPictures(userId: string): Promise<User[]> {
    return this.pictureModel.find({ uploadedBy: userId });
  }

  async getUserChannels(userId: string): Promise<Channel[]> {
    const user = await this.getUser(userId);
    const channelIds = user.channels.map(el => new Types.ObjectId(el));
    const channelsData = await this.channelModel.find({ _id : { $in : channelIds }});
    return channelsData;
  }

  async getUser(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async getUserByField(condition: FindUserFields): Promise<User> | null {
    const user = await this.userModel.findOne(condition);
    if (!user) return null;
    return user.toObject();
  }

  async deleteUserById(userId: string): Promise<any> {
    const user = await this.userModel.findByIdAndRemove(userId).select('-password');
    if (!user) {
      this.exceptionManager.throwException(ExceptionKey.USER_WAS_NOT_FOUND);
    }
    return user;
  }

  async updateUserById(userId: string, data: UpdateUserDto): Promise<any> {
    const user = await this.getUser(userId);
    if (!user) {
      this.exceptionManager.throwException(ExceptionKey.USER_WAS_NOT_FOUND);
    }

    if (data.newPassword) {
      if (!data.oldPassword) {
        this.exceptionManager.throwException(ExceptionKey.PROVIDE_CHANGE_PASSWORD_PARAMS);
      }
      const isPasswordValid = await bcrypt.compare(user.password, data.oldPassword);
      if (!isPasswordValid) {
        this.exceptionManager.throwException(ExceptionKey.OLD_PASSWORD_IS_NOT_CORRECT);
      }
    }

    if (data.username) {
      const isExistingUsername = await this.getUserByField({ username: data.username });
      if (isExistingUsername) {
        this.exceptionManager.throwException(ExceptionKey.IS_EXISTING_USERNAME);
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(userId, data, { new: true }).select('-password');
    return updatedUser;
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({$or: [
      { email: user.email },
      { username: user.username }
    ]});

    if (existingUser?.email === user.email) {
      this.exceptionManager.throwException(ExceptionKey.IS_EXISTING_EMAIL);
    }
    if (existingUser?.username === user.username) {
      this.exceptionManager.throwException(ExceptionKey.IS_EXISTING_USERNAME);
    }

    const newUser = new this.userModel({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    });
    const createdUser = await newUser.save();
    createdUser.password = undefined;
    return createdUser;
  }

  async addChannelToUser(userId: string, channelId: string): Promise<User> {
    const userWithChannel = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: {"channels": channelId }},
      {safe: true, upsert: true, new : true},
    );
    return userWithChannel;
  }

  async removeChannelFromUser(userId: string, channelId: string): Promise<User> {
    const updateResult = await this.userModel.updateOne({ _id: new Types.ObjectId(userId) }, {
      $pullAll: {
        channels: [channelId],
      },
    });

    if (!updateResult.modifiedCount) {
      this.exceptionManager.throwException(ExceptionKey.ENTITY_HAS_NOT_BEEN_UPDATED);
    }
    return this.pictureModel.findById(userId);
  }
}
