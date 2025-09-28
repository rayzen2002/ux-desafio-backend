import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { LoginSchema, type loginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiLoginOperation } from '../common/decorators/api-decorators';

@ApiTags("autenticação")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiLoginOperation('Login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() dto: loginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }
}
