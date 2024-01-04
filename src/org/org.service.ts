import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { Org, OrgDocument } from './schema/org.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrgDto } from './dto/create-org.dto';

@Injectable()
export class OrgService {
  constructor(@InjectModel(Org.name) private orgModel: Model<OrgDocument>) {}

  async create(dto: CreateOrgDto) {
    try {
      const { name, type } = dto;
      const isExist = await this.orgModel.find({ name: name });
      if (isExist?.length) {
        throw new NotAcceptableException('This organisation has added already');
      }
      const model = await new this.orgModel();

      model.name = name;
      model.type = type;

      await model.save();
      return { message: 'Organisation saved', data: model };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async orgList() {
    try {
      const org = await this.orgModel.find().sort({ _id: -1 });
      return org;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
