import { IsEnum } from 'class-validator';
import { Role } from '../user.entity';

export class UpdateRoleDto {
    @IsEnum(Role)
    role_id: Role;   // role_id ở đây chính là giá trị enum
}