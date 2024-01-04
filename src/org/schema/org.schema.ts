import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ORGANISATION } from './org.enum';

export type OrgDocument = Org & Document;

@Schema()
export class Org {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    enum: ORGANISATION,
    required: true,
  })
  type: ORGANISATION;
}

export const OrgSchema = SchemaFactory.createForClass(Org);
