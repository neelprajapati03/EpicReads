import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(8, 'Email must be at least 8 characters long'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    // no spaces
    .regex(/^(?!.*\s).*$/, 'Password cannot contain spaces')
    // at least one uppercase letter
    .regex(/[A-Z]/, 'Password must have at least one uppercase letter')
    // at least one number
    .regex(/[0-9]/, 'Password must have at least one number')
    // at least one special character
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must have at least one special character',
    ),

  firstname: z.string().min(1, 'First name is required'),

  lastname: z.string().min(1, 'Last name is required'),
});

export type RegisterPayload = z.infer<typeof RegisterSchema>;
