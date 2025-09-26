import { z } from "zod";

export const AddToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).default(1),
});
export type AddToCartDto = z.infer<typeof AddToCartSchema>;

export const RemoveFromCartSchema = z.object({
  productId: z.number().int().positive(),
});
export type RemoveFromCartDto = z.infer<typeof RemoveFromCartSchema>;
