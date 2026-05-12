import { z } from 'zod'

export const createStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  dni: z.string().min(1, 'DNI is required'),
  birthDate: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  password: z.string().optional(), // Ignore password field from frontend
})

export const updateStudentSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export type CreateStudentValidated = z.infer<typeof createStudentSchema>
export type UpdateStudentValidated = z.infer<typeof updateStudentSchema>
