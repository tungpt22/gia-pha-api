import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UploadModule } from '../upload/upload.module';
import {Activity} from "./activity.entity";
import {Relationship} from "./relationship.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Activity, Relationship]), UploadModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
