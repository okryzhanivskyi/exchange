import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignInUserDto } from './dto/signin-user.dto';
import { ExceptionKey, ExceptionManager } from 'src/helpers/exception.helper';
import { UserDocument } from 'src/user/schemas/user.schema';
import { AccessTokenResponse } from './types';

@Injectable()
export class AuthService {
  constructor(
    private exceptionManager: ExceptionManager,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(user: SignInUserDto) {
    const userData = await this.userService.getUserByField({ email: user.email });
    if (!userData) this.exceptionManager.throwException(ExceptionKey.EMAIL_WAS_NOT_FOUND);
    
    const isPasswordValid = await bcrypt.compare(user.password, userData.password);
    if (!isPasswordValid) this.exceptionManager.throwUnauthorizedException();

    const { password, ...result } = userData;
    return result;
  }

  async signIn(user: UserDocument): Promise<AccessTokenResponse> {
    const payload = {
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      id: user._id.toString(),
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
