import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import  { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { LoginSchema, type loginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() dto: loginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password)
    return this.authService.login(user)
  }
}
