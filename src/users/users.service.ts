import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashService } from './hash.service';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async getUserEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  async create(dto: CreateUserDto) {
    try {
      const { username, email, mobile, password, confirmPassword, orgId } = dto;
      const model = new this.userModel();

      const emailExists = await this.userModel.findOne({
        email: email,
      });
      if (emailExists) {
        throw new NotAcceptableException('This email is taken');
      } else {
        model.email = email;
      }
      model.username = username;
      model.mobile = mobile;
      if (password === confirmPassword) {
        const pass = await bcrypt.hash(password, 12);
        model.password = pass;
      } else {
        throw new NotAcceptableException(
          'Password must be equal to confirm password',
        );
      }
      model.orgId = orgId;
      await model.save();
      return { message: 'Data saved', data: model };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async allUsers() {
    try {
      const users = await this.userModel
        .aggregate([
          {
            $lookup: {
              from: 'orgs',
              localField: 'orgId',
              foreignField: '_id',
              as: 'org_details',
            },
          },
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
              mobile: 1,
              orgId: 1,

              'org_details._id': 1,
              'org_details.name': 1,
              'org_details.type': 1,
            },
          },
        ])
        .sort({ _id: -1 });
      return { message: 'Users List', data: users };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
