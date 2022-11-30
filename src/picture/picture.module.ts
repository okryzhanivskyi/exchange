import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from 'src/channel/schemas/channel.schema';
import { ExceptionManager } from 'src/helpers/exception.helper';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { PictureController } from './picture.controller';
import { PictureService } from './picture.service';
import { Picture, PictureSchema } from './schemas/picture.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Picture.name, schema: PictureSchema },
    { name: User.name, schema: UserSchema },
    { name: Channel.name, schema: ChannelSchema },
  ])],
  controllers: [PictureController],
  providers: [PictureService, ConfigService, ExceptionManager, UserService],
  exports: [PictureService, UserService],
})
export class PictureModule {}
