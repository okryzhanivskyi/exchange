import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ExceptionKey, ExceptionManager } from 'src/helpers/exception.helper';
import { Picture, PictureDocument } from 'src/picture/schemas/picture.schema';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel, ChannelDocument } from './schemas/channel.schema';

@Injectable()
export class ChannelService {
  constructor(
    private exceptionManager: ExceptionManager,
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
    @InjectModel(Picture.name) private pictureModel: Model<PictureDocument>,
  ) { }

  saveChannelInfo(file: Express.Multer.File, channel: CreateChannelDto) {
    const newChannel = new this.channelModel({
      ...channel,
      logo: file.filename,
    });
    return newChannel.save();
  }

  async getChannels(): Promise<Channel[]> {
    return this.channelModel.find().exec();
  }

  async getChannelPictures(channelId: string): Promise<Picture[]> {
    if (!isValidObjectId(channelId)) {
      this.exceptionManager.throwException(ExceptionKey.IS_INVALID_ID);
    }

    const channelsPictures = await this.pictureModel.find({
      channels: channelId
    });
    return channelsPictures;
  }
}
