import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../user/dto/user.dto';
import { Request, Response } from 'express';
import { LoggerService } from '../../common/logger/logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      return { message: 'Invalid credentials' };
    }

    this.authService.setAuthCookie(user, response);

    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @Get('check')
  @HttpCode(HttpStatus.OK)
  async checkAuth(@Req() request: Request) {
    const token = request.cookies?.access_token;
    if (!token) {
      return { authenticated: false };
    }

    try {
      const user = await this.authService.verifyToken(token);

      return {
        authenticated: true,
        user,
      };
    } catch (error) {
      this.loggerService.logError(
        error instanceof Error
          ? error
          : new Error(error || 'User is not authenticated'),
      );
      return { authenticated: false };
    }
  }
}
