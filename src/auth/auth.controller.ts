import { AuthService } from './auth.service';
import {
  Controller,
  Request,
  UseGuards,
  Post,
  Get,
  Headers,
  Put,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async userProfile(@Request() req) {
    const { user } = req;
    return this.authService.getProfile(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(@Request() req, @Body() dto: UpdateUserDto) {
    const { user } = req;
    return this.authService.editProfile(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async userLogout(@Request() req, @Headers() headers) {
    const { user } = req;

    const { authorization } = headers;
    const token = authorization.split(' ')[1];
    if (token) {
      return await this.authService.logout(token);
    }
  }
}
