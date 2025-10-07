import { IsUUID, IsEnum } from 'class-validator';
import { RelationType } from '../relationship.entity';

export class CreateRelationshipDto {
    @IsUUID()
    fromUserId: string;

    @IsUUID()
    toUserId: string;

    @IsEnum(RelationType)
    relationType: RelationType;
}
