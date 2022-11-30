import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ExceptionManager, ExceptionKey } from 'src/helpers/exception.helper';
import { getFileName } from 'src/helpers/file.helper';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import config from './config';

@Controller('channels')
export class ChannelController {
  constructor(
    private chanellService: ChannelService,
    private exceptionManager: ExceptionManager,
  ) {}
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllChannels() {
    return this.chanellService.getChannels();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('logo', {
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
  ) logo: Express.Multer.File, @Body() channel: CreateChannelDto) {
    if (!logo) {
      this.exceptionManager.throwException(ExceptionKey.FILE_WAS_NOT_FOUND);
    }
    return this.chanellService.saveChannelInfo(logo, channel);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/pictures')
  async getChannelPictures(@Param('id') id: string) {
    return this.chanellService.getChannelPictures(id);
  }
}
