import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UpdateUserDto, UpdateUserRoleDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  private sanitize(user: User) {
    const { password, ...safe } = user;
    return safe;
  }

  async findAll() {
    const users = await this.usersRepository.find({ order: { createdAt: 'DESC' } });
    return users.map((u) => this.sanitize(u));
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return this.sanitize(user);
  }

  private async findEntity(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return user;
  }

  async updateProfile(id: string, dto: UpdateUserDto) {
    const user = await this.findEntity(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
      user.email = dto.email;
    }

    if (dto.fullName) user.fullName = dto.fullName;
    if (dto.password) user.password = await bcrypt.hash(dto.password, 10);

    const saved = await this.usersRepository.save(user);
    return this.sanitize(saved);
  }

  async updateRole(id: string, dto: UpdateUserRoleDto) {
    const user = await this.findEntity(id);
    user.role = dto.role;
    const saved = await this.usersRepository.save(user);
    return this.sanitize(saved);
  }

  async updateStatus(id: string, dto: UpdateUserStatusDto) {
    const user = await this.findEntity(id);
    user.isActive = dto.isActive;
    const saved = await this.usersRepository.save(user);
    return this.sanitize(saved);
  }

  async remove(id: string) {
    const user = await this.findEntity(id);
    await this.usersRepository.remove(user);
    return { message: 'Utilisateur supprimé' };
  }

  async countByRole(role: Role) {
    return this.usersRepository.count({ where: { role } });
  }

  async countAll() {
    return this.usersRepository.count();
  }
}
