import { IsNotEmpty, IsString } from 'class-validator';
import { ORGANISATION } from '../schema/org.enum';

export class CreateOrgDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: ORGANISATION;
}
