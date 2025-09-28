import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository, type User } from './users.repository';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { EmailConfirmationService } from './email-confirmation.service';

@Injectable()
export class UsersService {
  constructor(
    readonly usersRepository: UsersRepository,
    readonly emailConfirmationService: EmailConfirmationService
  ) {}

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

   await this.emailConfirmationService.generateConfirmationToken(user.id, user.email, confirmToken)

    console.log(
    `Para ativar a conta, acesse: http://localhost:3000/users/confirm?token=${confirmToken}`,
  );
   return { id: user.id, email: user.email };
  }
 async activateUser(token: string): Promise<void> {
  const verificationResult = await this.emailConfirmationService.verifyConfirmationToken(token);

  if (!verificationResult) {
    throw new UnauthorizedException('Token inválido ou expirado');
  }
  const user = await this.usersRepository.findById(verificationResult.userId);
  if(!user){
    throw new NotFoundException("Usuário não encontrado")
  }
  if (user.is_active) {
    throw new ConflictException('Usuário já está ativo');
  }

  await this.usersRepository.updateUser(verificationResult.userId, {
    is_active: true,
    confirm_token: null
  });

  await this.emailConfirmationService.removeConfirmationToken(token);
}
 async updateUser(id: string, updateUserDto: UpdateUserDto, currentUserRole: string) {
    const existingUser = await this.usersRepository.findById(id);
    
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithEmail = await this.usersRepository.findByEmail(updateUserDto.email);
      if (userWithEmail?.length > 0) {
        throw new ConflictException('Email já está em uso por outro usuário');
      }
    }

    const updateData: any = { ...updateUserDto };


    delete updateData.role;
    delete updateData.is_active;
    delete updateData.password;

    const updatedUser = await this.usersRepository.updateUser(id, updateData);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      cpf: updatedUser.cpf,
      role: updatedUser.role,
      is_active: updatedUser.is_active,
      updated_at: updatedUser.updated_at
    };
  }
}