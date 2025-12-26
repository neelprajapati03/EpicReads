import { z } from 'zod';

export const GetUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  email: z.string().email('Invalid email format'),
});

export type GetUserPayload = z.infer<typeof GetUserSchema>;
