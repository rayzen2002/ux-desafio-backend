import { ApiProperty } from "@nestjs/swagger"

export class LoginSwaggerDto{
  @ApiProperty({
    example: 'exemplo@email.com',
    description: 'Email do usuário'
  })
  email: string
  @ApiProperty({
    example: 'secretpassword',
    description: 'Senha do usuário'
  })
  password: string
}
export class UserRegisterSwaggerDto {
  @ApiProperty({
    example: 'Fulano da Silva',
    description: 'Nome do usuário'
  })
  name: string
  @ApiProperty({
    example: 'test@email.com',
    description: 'Email do usuário'
  })
  email: string
  @ApiProperty({
    example: 'secretpassword',
    description: 'Senha do usuário'
  })
  password: string
  @ApiProperty({
    example: '+5588995820494',
    description: 'Número de contato do cliente'
  })
  phone: string
  @ApiProperty({
    example: "987.654.321-00",
    description: "CPF do usuário"
  })
  cpf: string
}