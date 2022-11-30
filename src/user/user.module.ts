import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { ExceptionManager } from 'src/helpers/exception.helper';
import { Picture, PictureSchema } from 'src/picture/schemas/picture.schema';
import { Channel, ChannelSchema } from 'src/channel/schemas/channel.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Picture.name, schema: PictureSchema },
    { name: Channel.name, schema: ChannelSchema },
  ])],
  providers: [UserService, ExceptionManager],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
