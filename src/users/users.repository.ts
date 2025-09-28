import { Injectable } from '@nestjs/common';
import { eq, type InferSelectModel } from 'drizzle-orm';
import { db } from '../../infra/db';
import { users } from '../../infra/db/schema';

export type User = InferSelectModel<typeof users>;

@Injectable()
export class UsersRepository {
  async findByEmail(email: string) {
    return db.select().from(users).where(eq(users.email, email)).limit(1);
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    cpf?: string;
    is_active?: boolean;
    confirm_token?: string;
    role?: 'user' | 'admin';
  }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone ?? null,
        cpf: data.cpf,
        is_active: false,
        confirm_token: data.confirm_token ?? null,
        role: data.role ?? 'user',
      })
      .returning();

    return user;
  }

  async activateUser(confirmToken: string) {
    const [user] = await db
      .update(users)
      .set({ is_active: true, confirm_token: null })
      .where(eq(users.confirm_token, confirmToken))
      .returning();

    if (!user) throw new Error('Token inválido ou expirado');
    return user;
  }
  async findById(userId : string){
    const user =  await db.select().from(users).where(eq(users.id, userId)).limit(1)
    return user[0]
  }
 async updateUser(id: string, updatedData: Partial<User>) { 
  const [updatedUser] = await db
    .update(users)
    .set({
      ...updatedData,
      updated_at: new Date()
    })
    .where(eq(users.id, id))
    .returning()

  return updatedUser
}
async updateUserWithRole(id: string, updatedData: Partial<User>, updatedBy: string) {
  const [updatedUser] = await db
    .update(users)
    .set({
      ...updatedData,
      updated_at: new Date(),
    })
    .where(eq(users.id, id))
    .returning()

  return updatedUser
}
}
