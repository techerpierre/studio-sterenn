import { Injectable } from '@nestjs/common';
import { CreateUserData, User } from './user.types';
import argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { User as PrismaUser } from '@/generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<User> {
    const { password, ...createData } = data;
    const passwordHash = await argon2.hash(password);

    const createdUser = await this.prisma.user.create({
      data: {
        ...createData,
        passwordHash,
      },
    });

    return this.toUser(createdUser);
  }

  async validate(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const isGreatPassword = await argon2.verify(user.passwordHash, password);

    return isGreatPassword ? this.toUser(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.toUser(user) : null;
  }

  private toUser(data: PrismaUser): User {
    return {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };
  }
}
