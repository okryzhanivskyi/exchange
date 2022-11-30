import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ChannelModule } from './channel/channel.module';
import { PictureModule } from './picture/picture.module';
import PermissionsMiddleware from './middleware/permission.middleware';
import { JwtService } from '@nestjs/jwt';
import { ExceptionManager } from './helpers/exception.helper';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}` +
      `:${process.env.DB_PASSWORD}` +
      `@cluster0.1hiznlt.mongodb.net/` +
      `${process.env.DB_NAME}?retryWrites=true&w=majority`
    ),
    AuthModule,
    UserModule,
    ChannelModule,
    PictureModule,
  ],
  providers: [JwtService, ExceptionManager]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PermissionsMiddleware)
      .forRoutes(
        { path: '/users/:id', method: RequestMethod.DELETE },
        { path: '/users/:id', method: RequestMethod.PUT },
      );
  }
}
