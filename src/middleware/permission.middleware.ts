import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/types';
import { ExceptionManager, ExceptionKey } from 'src/helpers/exception.helper';

@Injectable()
export default class PermissionsMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private exceptionManager: ExceptionManager
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    const token = (authHeaders as string)?.split(' ')[1];
    if (!token) {
      this.exceptionManager.throwUnauthorizedException();
    }
    try {
      const decodedToken: JwtPayload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      if (req.params.id !== decodedToken.id || !decodedToken.isAdmin) {
        throw new Error();
      }
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        this.exceptionManager.throwUnauthorizedException();
      }
      this.exceptionManager.throwException(ExceptionKey.ACTION_IS_NOT_ALLOWED);
    }
    next();
  }
}
