import { Module } from '@nestjs/common';
import { OrgService } from './org.service';
import { OrgController } from './org.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Org, OrgSchema } from './schema/org.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Org.name,
        schema: OrgSchema,
      },
    ]),
  ],
  controllers: [OrgController],
  providers: [OrgService],
})
export class OrgModule {}
