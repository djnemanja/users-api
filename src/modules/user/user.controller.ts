import {
  Controller,
  Get,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAllUsers();
    return users.map((user) => {
      const { password, ...result } = user;
      return result as UserResponseDto;
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.updateUser(id, updateUserDto);
    const { password, ...result } = user;
    return result as UserResponseDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.removeUser(id);
  }
}
