import { z } from 'zod';

export const AddToCartSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const UpdateCartSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export type AddToCartPayload = z.infer<typeof AddToCartSchema>;
export type UpdateCartPayload = z.infer<typeof UpdateCartSchema>;
