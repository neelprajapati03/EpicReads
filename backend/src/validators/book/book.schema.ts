import { z } from 'zod';

export const CreateBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)), {
      message: 'Price must be a valid number',
    }),

  stock: z
    .number({ message: 'Stock must be a number' })
    .int()
    .nonnegative()
    .optional(),

  imgUrl: z
    .string({ message: 'Image URL must be a string' })
    .url('Please provide a valid URL')
    .optional(),
});

export const UpdateBookSchema = CreateBookSchema.partial();

export type CreateBookPayload = z.infer<typeof CreateBookSchema>;
export type UpdateBookPayload = z.infer<typeof UpdateBookSchema>;
