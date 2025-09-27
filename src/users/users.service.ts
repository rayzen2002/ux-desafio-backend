import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    return user?.[0] ?? null;
  }
  async CreateUser(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    cpf: string;
  }) {
    const existingUser = await this.usersRepository.findByEmail(data.email);
    if (existingUser?.length)
      throw new ConflictException('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const confirmToken = randomBytes(32).toString('hex');

    const user = await this.usersRepository.create({
      ...data,
      password: hashedPassword,
      is_active: false,
      confirm_token: confirmToken,
    });

    console.log(
      `Para ativar a conta, acesse: http://localhost:3000/users/confirm?token=${user.confirm_token}`,
    );
    return { id: user.id, email: user.email, confirm_token: confirmToken };
  }
  async activateUser(confirmToken: string) {
    const user = await this.usersRepository.activateUser(confirmToken);

    return user;
  }
}
