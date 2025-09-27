import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { RegisterSchema, type RegisterDto } from 'src/auth/dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(@Body() dto: RegisterDto) {
    return this.usersService.CreateUser(dto);
  }

  @Get('confirm')
  async confirm(@Query('token') token: string) {
    const user = await this.usersService.activateUser(token);
    return { message: `Usuário ${user.email} ativado com sucesso!` };
  }
}
