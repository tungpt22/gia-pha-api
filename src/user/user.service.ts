import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender, Role, User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserActivityDto } from './dto/create-activity.dto';
import { Activity } from './activity.entity';
import { Relationship, RelationType } from './relationship.entity';
import { CreateRelationshipDto } from './dto/create-relationship.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,

    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,

    @InjectRepository(Relationship)
    private relationshipRepo: Repository<Relationship>,
  ) {}

  async create(data: Partial<User>) {
    data.salt = await this.createSalt();
    data.password = await bcrypt.hash(data.password + '', data.salt);
    const employee = this.repo.create(data);
    return this.repo.save(employee);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const query = this.repo.createQueryBuilder('user');

    if (search) {
      query.where('LOWER(user.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllListUser() {
    const query = this.repo.createQueryBuilder('user');
    const data = await query.getMany();
    return data;
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }

  async update(id: string, data: Partial<User>) {
    const employee = await this.findOne(id);
    Object.assign(employee, data);
    return this.repo.save(employee);
  }

  async remove(id: string) {
    const employee = await this.findOne(id);
    if (!employee) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    await this.repo.query(
      `UPDATE users SET phone_number = NULL WHERE id = $1`,
      [id],
    );
    return this.repo.softRemove(employee);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  // Update password method to use salt
  async updatePassword(id: string, password: string): Promise<void> {
    const salt = await this.createSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    await this.repo.update(id, { password: passwordHash, salt });
  }

  // You can also add a method to generate salt for a new employee
  async createSalt(): Promise<string> {
    return bcrypt.genSalt(10);
  }

  // Update profile information
  async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Only update the fields that are provided
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.address) user.address = updateUserDto.address;
    if (updateUserDto.birthday) user.birthday = updateUserDto.birthday;
    if (updateUserDto.death_day) user.death_day = updateUserDto.death_day;
    if (updateUserDto.gender) user.gender = updateUserDto.gender;
    if (updateUserDto.phone_number)
      user.phone_number = updateUserDto.phone_number;
    if (updateUserDto.profile_img) user.profile_img = updateUserDto.profile_img;
    return this.repo.save(user);
  }

  async findByPhoneNumber(phone_number: string) {
    return this.repo.findOne({ where: { phone_number } });
  }

  async save(user: User) {
    return await this.repo.save(user);
  }

  async updateRole(id: string, role_id: Role) {
    const user = await this.findOne(id);
    user.role = role_id;
    await this.repo.save(user);

    return user;
  }

  async addActivity(userId: string, dto: CreateUserActivityDto) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    const data = { ...dto, user };
    const activity = this.activityRepo.create(data);
    return this.activityRepo.save(activity);
  }

  async findActivities(userId: string) {
    const query = this.activityRepo.createQueryBuilder('activity');
    query.where('activity.user_id = :userId and activity.deleted_at IS NULL', {
      userId,
    });
    return query.getMany();
  }

  async removeActivity(id: string) {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException('Không tìm thấy hoạt động');
    }
    await this.activityRepo.query(
      `UPDATE activities SET deleted_at = NOW() WHERE id = $1`,
      [id],
    );
    return this.activityRepo.softRemove(activity);
  }

  async findUsersNotInFromChild(): Promise<User[]> {
    return this.repo
      .createQueryBuilder('u')
      .leftJoin(
        Relationship,
        'rel',
        'rel.from_user_id = u.id AND rel.relation_type = :rtype',
        { rtype: RelationType.CHILD },
      )
      .where('rel.id IS NULL')
      .andWhere('u.deleted_at IS NULL') // nếu muốn loại user đã soft-delete
      .getMany();
  }

  async findUsersNotInFromHusband(): Promise<User[]> {
    return this.repo
      .createQueryBuilder('u')
      .leftJoin(
        Relationship,
        'rel',
        'rel.from_user_id = u.id AND rel.relation_type = :rtype',
        { rtype: RelationType.HUSBAND },
      )
      .where('rel.id IS NULL')
      .andWhere('u.deleted_at IS NULL') // nếu muốn loại user đã soft-delete
      .getMany();
  }

  async findUsersNotInFromWife(): Promise<User[]> {
    return this.repo
      .createQueryBuilder('u')
      .leftJoin(
        Relationship,
        'rel',
        'rel.from_user_id = u.id AND rel.relation_type = :rtype',
        { rtype: RelationType.WIFE },
      )
      .where('rel.id IS NULL')
      .andWhere('u.deleted_at IS NULL') // nếu muốn loại user đã soft-delete
      .getMany();
  }

  async createRelationship(dto: CreateRelationshipDto) {
    const fromUser = await this.repo.findOne({ where: { id: dto.fromUserId } });
    const toUser = await this.repo.findOne({ where: { id: dto.toUserId } });

    if (!fromUser || !toUser) {
      throw new NotFoundException('Không tìm thấy người dùng để gán quan hệ');
    }

    const exists = await this.relationshipRepo.findOne({
      where: {
        from_user: { id: fromUser.id },
        to_user: { id: toUser.id },
        relation_type: dto.relationType,
      },
      relations: ['from_user', 'to_user'],
    });

    if (exists) {
      throw new BadRequestException('Mối quan hệ đã tồn tại');
    }

    // Quan hệ thuận
    const relationship = this.relationshipRepo.create({
      from_user: fromUser,
      to_user: toUser,
      relation_type: dto.relationType,
    });

    await this.relationshipRepo.save(relationship);

    // Quan hệ nghịch
    const inverseType = UserService.getInverseRelation(
      dto.relationType,
      fromUser['gender'],
    );
    const inverse = this.relationshipRepo.create({
      from_user: toUser,
      to_user: fromUser,
      relation_type: inverseType,
    });

    await this.relationshipRepo.save(inverse);

    return { relationship, inverse };
  }

  private static getInverseRelation(
    type: RelationType,
    gender?: string,
  ): RelationType {
    switch (type) {
      case RelationType.FATHER:
      case RelationType.MOTHER:
        return RelationType.CHILD;
      case RelationType.CHILD:
        // Dựa vào gender để xác định là bố hay mẹ
        return gender === Gender.NAM
          ? RelationType.FATHER
          : RelationType.MOTHER;
      case RelationType.HUSBAND:
        return RelationType.WIFE;
      case RelationType.WIFE:
        return RelationType.HUSBAND;
      default:
        throw new BadRequestException('Mối quan hệ không xác định');
    }
  }

  async removeRelationship(fromUserId: string, toUserId: string) {
    // Tìm và xóa quan hệ thuận
    const rel = await this.relationshipRepo.findOne({
      where: { from_user: { id: fromUserId }, to_user: { id: toUserId } },
      relations: ['from_user', 'to_user'],
    });
    if (rel) {
      await this.relationshipRepo.remove(rel);
    }

    // Tìm và xóa quan hệ nghịch
    const inverse = await this.relationshipRepo.findOne({
      where: { from_user: { id: toUserId }, to_user: { id: fromUserId } },
      relations: ['from_user', 'to_user'],
    });
    if (inverse) {
      await this.relationshipRepo.remove(inverse);
    }

    return 'OK';
  }

  async getRelationship(fromUserId: string) {
    const rel = await this.relationshipRepo.find({
      where: { from_user: { id: fromUserId } },
      relations: { from_user: true, to_user: true },
    });

    return rel;
  }

  async buildFamilyTree(userId: string) {
    const rootUser = await this.repo.findOne({ where: { id: userId } });
    if (!rootUser) return null;

    return this.buildNode(rootUser);
  }

  private async buildNode(user: User): Promise<any> {
    // lấy các quan hệ từ user
    const relations = await this.relationshipRepo.find({
      where: { from_user: { id: user.id } },
      relations: ['from_user', 'to_user'],
    });

    // lọc vợ/chồng
    // lọc vợ/chồng
    const spouses = relations
      .filter(
        (r) =>
          r.relation_type === RelationType.WIFE ||
          r.relation_type === RelationType.HUSBAND,
      )
      .map((r) => ({
        id: r.to_user.id,
        name: r.to_user.name,
        relation: r.relation_type,
      }));

    // lọc con
    const children = relations.filter(
      (r) => r.relation_type === RelationType.CHILD,
    );

    // build node con đệ quy
    const childrenNodes: any[] = [];
    for (const childRel of children) {
      const childNode = await this.buildNode(childRel.to_user);
      childrenNodes.push({
        id: childRel.to_user.id,
        name: childRel.to_user.name,
        relation: RelationType.CHILD,
        ...childNode,
      });
    }

    return {
      id: user.id,
      name: user.name,
      spouses,
      children: childrenNodes,
    };
  }

  async findRootUsers() {
    // lấy tất cả userId có relation_type = CHILD
    const childRelations = await this.relationshipRepo
      .createQueryBuilder('r')
      .select('r.to_user_id', 'id')
      .where('r.relation_type = :rel', { rel: RelationType.CHILD })
      .getRawMany();

    const childIds = childRelations.map((c) => c.id);

    // lấy user không nằm trong childIds (các candidate root)
    let candidates = await this.repo
      .createQueryBuilder('u')
      .where(childIds.length > 0 ? 'u.id NOT IN (:...childIds)' : '1=1', {
        childIds,
      })
      .getMany();

    // loại duplicate spouse: nếu một cặp vợ chồng đều có trong candidates,
    // chỉ giữ lại 1 người (ví dụ người đầu tiên)
    const spouseRelations = await this.relationshipRepo.find({
      where: [
        { relation_type: RelationType.HUSBAND },
        { relation_type: RelationType.WIFE },
      ],
      relations: ['from_user', 'to_user'],
    });

    const seenSpouses = new Set<string>();
    const roots: User[] = [];

    for (const candidate of candidates) {
      if (seenSpouses.has(candidate.id)) continue;

      // tìm spouse (nếu có)
      const spouseRel = spouseRelations.find(
        (r) => r.from_user.id === candidate.id || r.to_user.id === candidate.id,
      );

      if (spouseRel) {
        // đánh dấu cả 2 vợ chồng là đã xử lý
        seenSpouses.add(spouseRel.from_user.id);
        seenSpouses.add(spouseRel.to_user.id);
        // chỉ push 1 người làm root (spouse kia sẽ được add trong buildNode)
        roots.push(candidate);
      } else {
        // không có spouse => root độc lập
        roots.push(candidate);
      }
    }

    return roots;
  }
}
