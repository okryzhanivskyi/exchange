import { IsNotEmpty } from 'class-validator';

export class AddChannelToUserDto {
  @IsNotEmpty()
  channelId: string;
}
