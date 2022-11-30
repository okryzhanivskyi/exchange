import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
