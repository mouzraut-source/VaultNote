export const STORAGE_BUCKETS = {
  ACADEMIC_MATERIALS: 'academic-materials',
  PAYMENT_PROOFS: 'payment-proofs',
} as const

export const RLS_POLICIES = {
  PROFILES: 'profiles',
  PRODUCTS: 'products',
  PAYMENT_SUBMISSIONS: 'payment_submissions',
  PURCHASES: 'purchases',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCT: (id: string) => `/products/${id}`,
  DASHBOARD: '/dashboard',
  READER: (id: string) => `/reader/${id}`,
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_PURCHASES: '/admin/purchases',
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export const PURCHASE_STATUS = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
} as const

export const USER_ROLE = {
  STUDENT: 'student',
  ADMIN: 'admin',
} as const

export const MAX_FILE_SIZES = {
  PDF: 50 * 1024 * 1024, // 50MB
  IMAGE: 5 * 1024 * 1024, // 5MB
} as const

export const ALLOWED_FILE_TYPES = {
  PDF: ['application/pdf'],
  IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
} as const