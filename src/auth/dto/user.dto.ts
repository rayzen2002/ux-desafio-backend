import z from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
   password: z.string()
    .min(8, { message: "Mínimo 8 caracteres" })
    .refine(p => /[A-Z]/.test(p), { message: "Deve conter pelo menos 1 letra maiúscula" })
    .refine(p => /[!@#%^&*]/.test(p), { message: "Deve conter pelo menos 1 caracter especial" }),
    phone: z.string().optional(),
    cpf: z.string()
  })

  export type RegisterDto = z.infer<typeof RegisterSchema>