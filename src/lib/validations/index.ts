import { z } from 'zod'

export const customerRegistrationSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  ghana_card_number: z.string().min(8, 'Ghana Card number must be valid').optional().or(z.literal('')),
  date_of_birth: z.string().optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other']).optional().or(z.literal('')),
  address: z.string().min(5, 'Address is required').optional().or(z.literal('')),
  occupation: z.string().optional().or(z.literal('')),
  employer: z.string().optional().or(z.literal('')),
  monthly_income: z.coerce.number().min(0).optional(),
  branch_id: z.string().uuid('Invalid branch'),
})

export const customerActivationSchema = z.object({
  customer_id: z.string().min(1, 'Customer ID is required'),
  phone: z.string().min(10, 'Phone number is required'),
})

export const otpVerificationSchema = z.object({
  email: z.string().email('Invalid email'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export const passwordSetupSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export const loanCreationSchema = z.object({
  customer_id: z.string().uuid('Invalid customer'),
  loan_type: z.enum(['personal', 'business', 'emergency', 'agricultural', 'education']),
  principal_amount: z.coerce.number().min(100, 'Minimum loan amount is GH₵ 100'),
  interest_rate: z.coerce.number().min(0).max(100, 'Interest rate must be between 0 and 100'),
  term_months: z.coerce.number().min(1).max(60, 'Term must be between 1 and 60 months'),
  repayment_frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']),
  notes: z.string().optional(),
})

export const loanApprovalSchema = z.object({
  loan_id: z.string().uuid('Invalid loan'),
  approved: z.boolean(),
  notes: z.string().optional(),
})

export const repaymentSchema = z.object({
  loan_id: z.string().uuid('Invalid loan'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  payment_method: z.enum(['cash', 'mobile_money', 'bank_transfer', 'cheque']),
  payment_reference: z.string().optional(),
  notes: z.string().optional(),
})

export const depositSchema = z.object({
  customer_id: z.string().uuid('Invalid customer'),
  account_id: z.string().uuid('Invalid account'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  payment_method: z.enum(['cash', 'mobile_money', 'bank_transfer', 'cheque']),
  notes: z.string().optional(),
})

export const withdrawalSchema = z.object({
  customer_id: z.string().uuid('Invalid customer'),
  account_id: z.string().uuid('Invalid account'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  notes: z.string().optional(),
})

export const staffCreationSchema = z.object({
  email: z.string().email('Invalid email'),
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['super_admin', 'branch_manager', 'loan_officer', 'cashier', 'collector', 'customer_support']),
  branch_id: z.string().uuid('Invalid branch').optional().or(z.literal('')),
})

export const branchSchema = z.object({
  name: z.string().min(2, 'Branch name is required'),
  code: z.string().min(1, 'Branch code is required').regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers'),
  address: z.string().optional(),
  phone: z.string().optional(),
})

export const settingsSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
  category: z.string().min(1),
})

export type CustomerRegistrationInput = z.infer<typeof customerRegistrationSchema>
export type CustomerActivationInput = z.infer<typeof customerActivationSchema>
export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>
export type PasswordSetupInput = z.infer<typeof passwordSetupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type LoanCreationInput = z.infer<typeof loanCreationSchema>
export type LoanApprovalInput = z.infer<typeof loanApprovalSchema>
export type RepaymentInput = z.infer<typeof repaymentSchema>
export type DepositInput = z.infer<typeof depositSchema>
export type WithdrawalInput = z.infer<typeof withdrawalSchema>
export type StaffCreationInput = z.infer<typeof staffCreationSchema>
export type BranchInput = z.infer<typeof branchSchema>
