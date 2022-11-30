import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Request,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ExceptionManager, ExceptionKey } from 'src/helpers/exception.helper';
import { getFileName } from 'src/helpers/file.helper';
import { PictureService } from './picture.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import config from './config';

@Controller('pictures')
export class PictureController {
  constructor(
    private pictureService: PictureService,
    private userService: UserService,
    private exceptionManager: ExceptionManager,
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('picture', {
    storage: diskStorage({
      destination: config.UPLOADS_PATH,
      filename: function (req, file, cb) {
        cb(null, getFileName(file.fieldname, file.originalname));
      }
    }),
  }))
  uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: config.MAX_FILESIZE }),
        new FileTypeValidator({ fileType: config.FILE_TYPE }),
      ],
    }),
  ) picture: Express.Multer.File, @Request() req, @Body() pictureData: CreatePictureDto) {
    if (!picture) {
      this.exceptionManager.throwException(ExceptionKey.FILE_WAS_NOT_FOUND);
    }
    return this.pictureService.savePictureInfo(picture, pictureData, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPictures() {
    return this.pictureService.getPictures();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getUserPictures(@Request() req) {
    return this.userService.getUserPictures(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:pictureId/channel/:channelId')
  async removePictureChannel(
    @Param('pictureId') pictureId: string,
    @Param('channelId') channelId: string
  ) {
    return this.pictureService.removeChannelFromPicture(pictureId, channelId);
  }
}
