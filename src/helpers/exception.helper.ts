import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";

export const enum ExceptionKey {
  IS_EXISTING_EMAIL = 'IS_EXISTING_EMAIL',
  IS_EXISTING_USERNAME = 'IS_EXISTING_USERNAME',
  EMAIL_WAS_NOT_FOUND = 'EMAIL_WAS_NOT_FOUND',
  FILE_WAS_NOT_FOUND = 'FILE_WAS_NOT_FOUND',
  USER_WAS_NOT_FOUND = 'USER_WAS_NOT_FOUND',
  ACTION_IS_NOT_ALLOWED = 'ACTION_IS_NOT_ALLOWED',
  PROVIDE_CHANGE_PASSWORD_PARAMS = 'PROVIDE_CHANGE_PASSWORD_PARAMS',
  OLD_PASSWORD_IS_NOT_CORRECT = 'OLD_PASSWORD_IS_NOT_CORRECT',
  ENTITY_HAS_NOT_BEEN_UPDATED = 'ENTITY_HAS_NOT_BEEN_UPDATED',
}

@Injectable()
export class ExceptionManager {
  private readonly exceptions = [
    {
      key: ExceptionKey.IS_EXISTING_EMAIL,
      message: 'The user with provided email already exists',
      status: HttpStatus.BAD_REQUEST,
    },
    {
      key: ExceptionKey.IS_EXISTING_USERNAME,
      message: 'The user with provided username already exists',
      status: HttpStatus.BAD_REQUEST,
    },
    {
      key: ExceptionKey.EMAIL_WAS_NOT_FOUND,
      message: 'Provided email was not found',
      status: HttpStatus.NOT_FOUND,
    },
    {
      key: ExceptionKey.FILE_WAS_NOT_FOUND,
      message: 'File was not found in request body',
      status: HttpStatus.BAD_REQUEST,
    },
    {
      key: ExceptionKey.USER_WAS_NOT_FOUND,
      message: 'User was not found in the database',
      status: HttpStatus.NOT_FOUND,
    },
    {
      key: ExceptionKey.ACTION_IS_NOT_ALLOWED,
      message: 'The action is not allowed for the user',
      status: HttpStatus.FORBIDDEN,
    },
    {
      key: ExceptionKey.PROVIDE_CHANGE_PASSWORD_PARAMS,
      message: 'An old and a new password should be provided',
      status: HttpStatus.BAD_REQUEST,
    },
    {
      key: ExceptionKey.OLD_PASSWORD_IS_NOT_CORRECT,
      message: 'The old password is not correct',
      status: HttpStatus.BAD_REQUEST,
    },
    {
      key: ExceptionKey.ENTITY_HAS_NOT_BEEN_UPDATED,
      message: 'The entity has not been updated',
      status: HttpStatus.NOT_FOUND,
    }
  ];

  throwException(exceptionKey: ExceptionKey) {
    const exceptionProps = this.exceptions.find(el => el.key === exceptionKey);
    if (exceptionProps) {
      throw new HttpException(exceptionProps.message, exceptionProps.status);
    }
  }

  throwUnauthorizedException() {
    throw new UnauthorizedException();
  }
}
