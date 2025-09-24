import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import  { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { RegisterSchema, type RegisterDto } from 'src/auth/dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService){}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(@Body() dto: RegisterDto) {
    return this.usersService.CreateUser(dto)
  }
}
