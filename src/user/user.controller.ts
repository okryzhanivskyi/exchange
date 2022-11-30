import { Body, Controller, Get, Param, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddChannelToUserDto } from './dto/user-channel.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.userService.getUsers();
  }

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('channel')
  async addChannelToUser(@Request() req, @Body() channelData: AddChannelToUserDto) {
    return this.userService.addChannelToUser(req.user.id, channelData.channelId)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/pictures')
  async getUserPictures(@Param('id') userId: string) {
    return this.userService.getUserPictures(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/channels')
  async getUserChannels(@Param('id') userId: string) {
    return this.userService.getUserChannels(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    return this.userService.updateUserById(id, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:userId/channel/:channelId')
  async removePictureChannel(
    @Param('userId') userId: string,
    @Param('channelId') channelId: string
  ) {
    return this.userService.removeChannelFromUser(userId, channelId);
  }
}
