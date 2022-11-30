import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Picture, PictureDocument } from 'src/picture/schemas/picture.schema';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel, ChannelDocument } from './schemas/channel.schema';

@Injectable()
export class ChannelService {
  constructor(
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
    const channelsPictures = await this.pictureModel.find({
      channels: channelId
    });
    return channelsPictures;
  }
}
