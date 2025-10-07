import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, Role } from './user.entity';
import { RolesGuard } from '../security/roles.guard';
import { Roles } from '../security/roles.decorator';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../security/public.decorator';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateUserActivityDto } from './dto/create-activity.dto';
import { CreateRelationshipDto } from './dto/create-relationship.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN) // Only users with 'admin' role can access
  @UseGuards(RolesGuard)
  create(@Body() data: Partial<User>) {
    return this.userService.create(data);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.userService.findAll(Number(page), Number(limit), search);
  }

  @Get('/find-all-list')
  async findAllListUser() {
    return this.userService.findAllListUser();
  }

  @Get('all-family-tree')
  async getFamilyTreeDefault() {
    const roots = await this.userService.findRootUsers();

    // build luôn cây cho tất cả roots
    const trees: any[] = [];
    for (const root of roots) {
      const tree = await this.userService.buildFamilyTree(root.id);
      trees.push(tree);
    }

    return trees;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN) // Only users with 'admin' role can access
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: User,
  })
  @Roles(Role.ADMIN) // Only users with 'admin' role can access
  @UseGuards(RolesGuard)
  updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(id, updateProfileDto);
  }

  @Post(':id/roles')
  async assignRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.userService.updateRole(id, updateRoleDto.role_id);
  }

  @Post(':id/activities')
  async addActivity(
    @Param('id') id: string,
    @Body() dto: CreateUserActivityDto,
  ) {
    return await this.userService.addActivity(id, dto);
  }

  @Get(':id/activities')
  async getActivities(@Param('id') userId: string) {
    return await this.userService.findActivities(userId);
  }

  @Delete(':id/activities')
  removeActivity(@Param('id') id: string) {
    return this.userService.removeActivity(id);
  }

  @Get('relationships/notChild')
  async getUsersNotInFromChild() {
    return await this.userService.findUsersNotInFromChild();
  }

  @Get('relationships/notHusband')
  async getUsersNotInFromHusband() {
    return await this.userService.findUsersNotInFromHusband();
  }

  @Get('relationships/notWife')
  async getUsersNotInFromWife() {
    return await this.userService.findUsersNotInFromWife();
  }

  @Get(':id/relationships')
  async getRelationship(@Param('id') fromUserId: string) {
    return await this.userService.getRelationship(fromUserId);
  }

  @Post(':id/relationships')
  async addRelationship(
    @Param('id') fromUserId: string,
    @Body() dto: Omit<CreateRelationshipDto, 'fromUserId'>,
  ) {
    return await this.userService.createRelationship({
      fromUserId,
      toUserId: dto.toUserId,
      relationType: dto.relationType,
    });
  }

  @Delete(':fromUserId/relationships/:toUserId')
  async removeRelationship(
    @Param('fromUserId') fromUserId: string,
    @Param('toUserId') toUserId: string,
  ) {
    return await this.userService.removeRelationship(fromUserId, toUserId);
  }

  @Get(':id/family-tree')
  async getFamilyTree(@Param('id') id: string) {
    const trees: any[] = [];
    const tree = await this.userService.buildFamilyTree(id);
    trees.push(tree);
    return trees;
  }
}
