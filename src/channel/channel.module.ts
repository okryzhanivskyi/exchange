import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ExceptionManager } from 'src/helpers/exception.helper';
import { Picture, PictureSchema } from 'src/picture/schemas/picture.schema';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { Channel, ChannelSchema } from './schemas/channel.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Channel.name, schema: ChannelSchema },
    { name: Picture.name, schema: PictureSchema },
  ])],
  controllers: [ChannelController],
  providers: [ChannelService, ConfigService, ExceptionManager],
  exports: [ChannelService],
})
export class ChannelModule {}
