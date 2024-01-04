import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Org } from 'src/org/schema/org.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    required: true,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  mobile: number;

  @Prop({
    required: true,
  })
  password: string;

  @Prop()
  token: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: Org.name,
  })
  orgId: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
