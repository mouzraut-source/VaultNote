export type UserRole = 'student' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  price: number;
  storage_path: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PaymentSubmission {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  transaction_reference: string;
  screenshot_path: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  product?: Product;
  profile?: Profile;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  payment_submission_id: string;
  purchased_at: string;
  status: 'active' | 'revoked';
  product?: Product;
  profile?: Profile;
}

export interface AdminStats {
  totalProducts: number;
  totalStudents: number;
  pendingPayments: number;
  totalRevenue: number;
}

// Input types for forms
export interface CreateProductInput {
  title: string
  description?: string | null
  subject?: string | null
  price: number
  storage_path?: string | null
  is_active?: boolean
}

export interface UpdateProductInput {
  title?: string
  description?: string | null
  subject?: string | null
  price?: number
  storage_path?: string | null
  is_active?: boolean
}

export interface CreatePaymentSubmissionInput {
  user_id: string
  product_id: string
  amount: number
  transaction_reference: string
  screenshot_path?: string | null
}