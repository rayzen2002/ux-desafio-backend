import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import type { InferSelectModel } from 'drizzle-orm';
import type { users } from 'src/db/schema';

export type User = InferSelectModel<typeof users>;
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user : User = request.user;
    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }
    if(user.is_active !== true){
      throw new ForbiddenException('Conta não ativada. Verifique seu email para ativar a conta')
    }

    if (!this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Acesso negado');
    }

    return true;
  }
}
