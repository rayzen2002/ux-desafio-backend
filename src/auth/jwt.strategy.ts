import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Pega token do header
      ignoreExpiration: false, // Expiração deve ser respeitada
      secretOrKey: process.env.JWT_SECRET || 'defaultSecret', // Mesmo secret do JwtModule
    });
  }

  async validate(payload: any) {
    // Esse retorno vai direto para o req.user
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
