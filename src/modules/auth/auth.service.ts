import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../user/dto/user.dto';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    console.log('createUserDto 2', createUserDto);
    const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);

    await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    return { message: 'User registered successfully' };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.userService.findUserByEmail(email);
    console.log('user', user);
    console.log('password', password);
    console.log(bcrypt.compareSync(password, user!.password));
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: Partial<User>) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  setAuthCookie(user: Partial<User>, response: Response): void {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });
  }

  async verifyToken(token: string): Promise<Partial<User>> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { password, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
