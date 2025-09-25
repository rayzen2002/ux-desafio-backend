import z from "zod";

export const CreateProductSchema = z.object({
  name: z.string()
  .min(1, "Nome é obrigatório")
  .max(100, "Nome não pode ter mais de 100 caracteres")
  .trim(),

  description: z.string()
  .max(500, "Descrição não pode ter mais de 500 caracteres")
  .optional(),

  imageUrl: z.url("Deve ser uma URL válida").optional(),

  price: z.number()
  .positive("Preço deve ser maior que 0")
  });

  export type CreateProductDto = z.infer<typeof CreateProductSchema>;

  export const UpdateProductSchema = CreateProductSchema.partial();
  export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

  export const PaginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    name: z.string().optional(),
  });
  export type PaginationDto = z.infer<typeof PaginationSchema>;