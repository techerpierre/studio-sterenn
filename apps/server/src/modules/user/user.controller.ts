import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import * as Contracts from '@sterenn/api-contracts';

import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async get(@Param('id') id: string): Promise<Contracts.User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
