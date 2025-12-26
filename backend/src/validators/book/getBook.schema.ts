import { z } from 'zod';

export const GetBookSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'), // UUID as string

  title: z.string().min(1, 'Title is required'),

  author: z.string().min(1, 'Author is required'),

  category: z.string().min(1, 'Category is required'),

  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)), {
      message: 'Price must be a valid number',
    }),

  stock: z.number().int().nonnegative(),

  imgUrl: z.string().url('Invalid image URL').optional(),
});

export type GetBookPayload = z.infer<typeof GetBookSchema>;
