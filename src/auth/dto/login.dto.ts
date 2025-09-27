import z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string({ error: 'Required' })
    .min(8, { message: 'Mínimo de 8 caracteres' })
    .refine((password) => /[A-Z]/.test(password), {
      message: 'Senha deve conter pelo menos 1 letra maiúscula',
    })
    .refine((password) => /[a-z]/.test(password), {
      message: 'Senha deve conter pelo menos 1 letra minúscula',
    })
    .refine((password) => /[!@#%^&*]/.test(password), {
      message: 'Senha deve conter pelo menos 1 caracter especial',
    })
    .refine((password) => /\d/.test(password), {
      message: 'Senha deve conter pelo menos 1 número',
    }),
});

export type loginDto = z.infer<typeof LoginSchema>;
