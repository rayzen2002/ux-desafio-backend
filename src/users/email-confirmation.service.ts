// email-confirmation.service.ts - VERSÃO SIMPLIFICADA
import { Injectable } from "@nestjs/common";
import { RedisHelper } from "../../infra/redis/utils/redis-helpers";

@Injectable()
export class EmailConfirmationService {ok

  private readonly CONFIRMATION_PREFIX = 'confirmation:token:';
  private readonly EXPIRATION_TIME = 24 * 60 * 60;

  constructor(private readonly redisHelper: RedisHelper) {}

  async generateConfirmationToken(userId: string, email: string, token: string): Promise<string> {
    await this.redisHelper.set(
      `${this.CONFIRMATION_PREFIX}${token}`,
      { userId, email },
      this.EXPIRATION_TIME
    );
    return token;
  }

  async verifyConfirmationToken(token: string): Promise<{userId: string; email: string} | null> {
    return await this.redisHelper.get<{userId: string; email: string}>(
      `${this.CONFIRMATION_PREFIX}${token}`
    );
  }

  async removeConfirmationToken(token: string): Promise<void> {
    await this.redisHelper.del(`${this.CONFIRMATION_PREFIX}${token}`);
  }
}