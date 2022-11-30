import { IsNotEmpty } from 'class-validator';

export class CreatePictureDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  channels: string;
}
