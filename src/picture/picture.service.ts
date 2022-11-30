import { Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Model, Types } from 'mongoose';
import { diskStorage } from 'multer';
import { ExceptionManager, ExceptionKey } from 'src/helpers/exception.helper';
import { CreatePictureDto } from './dto/create-picture.dto';
import { Picture, PictureDocument } from './schemas/picture.schema';
import { UpdatedPictureResult } from './types';

@Injectable()
export class PictureService {
  constructor(
    private exceptionManager: ExceptionManager,
    @InjectModel(Picture.name) private pictureModel: Model<PictureDocument>
  ) { }

  savePictureInfo(file: Express.Multer.File, picture: CreatePictureDto, uploadedBy: string) {
    const channels = picture.channels.split(',');

    const newPicture = new this.pictureModel({
      ...picture,
      channels,
      uploadedBy,
      filename: file.filename,
    });
    return newPicture.save();
  }

  async getPictures(): Promise<Picture[]> {
    return this.pictureModel.find().exec();
  }

  async removeChannelFromPicture(pictureId: string, channelId: string): Promise<Picture> {
    const updateResult = await this.pictureModel.updateOne({ _id: new Types.ObjectId(pictureId) }, {
      $pullAll: {
        channels: [channelId],
      },
    });

    if (!updateResult.modifiedCount) {
      this.exceptionManager.throwException(ExceptionKey.ENTITY_HAS_NOT_BEEN_UPDATED);
    }
    return this.pictureModel.findById(pictureId);
  }
}
