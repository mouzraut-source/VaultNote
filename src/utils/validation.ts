import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000).optional(),
  subject: z.string().max(100).optional(),
  price: z.number().min(0, 'Price cannot be negative'),
  isActive: z.boolean().default(true),
  pdfFile: z.instanceof(File).optional(),
})

export const paymentSubmissionSchema = z.object({
  productId: z.string().uuid('Invalid product'),
  amount: z.number().min(1, 'Amount must be at least 1'),
  transactionReference: z.string().min(5, 'Transaction reference is too short').max(100),
  screenshot: z.instanceof(File).nullable().optional().refine(
    (file) => !file || file.size <= 5 * 1024 * 1024,
    'Screenshot must be less than 5MB'
  ).refine(
    (file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'Screenshot must be JPG, PNG, or WebP'
  ),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type PaymentSubmissionInput = z.infer<typeof paymentSubmissionSchema>