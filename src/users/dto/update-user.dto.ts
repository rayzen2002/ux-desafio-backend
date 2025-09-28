// src/users/dto/update-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do usuário',
    required: false
  })
  name?: string;

  @ApiProperty({
    example: 'novoemail@exemplo.com',
    description: 'Email do usuário',
    required: false
  })
  email?: string;

  @ApiProperty({
    example: '11999999999',
    description: 'Telefone do usuário',
    required: false
  })
  phone?: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF do usuário',
    required: false
  })
  cpf?: string;
}