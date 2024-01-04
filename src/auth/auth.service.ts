import { UserService } from 'src/users/users.service';
import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/users/hash.service';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userService: UserService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUserEmail(email);
    if (user && (await this.hashService.comparePassword(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      email: user.email,
      userId: user.id,
    };
    const userToken = await this.userModel.findOne({ _id: user.id });

    const accessToken = this.jwtService.sign(payload);
    userToken.token = accessToken;
    await userToken.save();
    return {
      sucess: true,
      msg: 'Login succesfully',
      access_token: accessToken,
    };
  }

  async getProfile(user: any) {
    try {
      const profile = await this.userModel
        .findById(user.userId)
        .select({ _id: 1, email: 1, username: 1, mobile: 1 });

      if (!profile) {
        throw new NotAcceptableException("User doesn't exist");
      }
      return { message: 'User profile', data: profile };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async editProfile(user: any, dto: UpdateUserDto) {
    try {
      const { username, email, mobile } = dto;
      const userInfo = await this.userModel
        .findById(user.userId)
        .select({ _id: 1, email: 1, username: 1, mobile: 1 });
      if (!userInfo) {
        throw new NotAcceptableException('Invalid Id');
      }
      userInfo.username = username;
      userInfo.email = email;
      userInfo.mobile = mobile;

      await userInfo.save();
      return { message: 'Update sucessfully', data: userInfo };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async logout(token) {
    try {
      const payload = this.jwtService.verify(token);
      const userInfo = await this.userModel.findById(payload.userId);

      if (userInfo) {
        userInfo.token = '';
        await userInfo.save();
        return {
          message: 'Logged out Successfully!!',
          status: 'Successful',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
