import { supabase, getSupabaseAdmin } from './supabase'
import type { PaymentSubmission } from '@/types'

export interface CreatePaymentSubmissionInput {
  user_id: string
  product_id: string
  amount: number
  transaction_reference: string
  screenshot_path?: string | null
}

export async function createPaymentSubmission(
  input: CreatePaymentSubmissionInput
): Promise<PaymentSubmission> {
  const { data, error } = await supabase
    .from('payment_submissions')
    .insert({
      ...input,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserPaymentSubmissions(userId: string): Promise<PaymentSubmission[]> {
  const { data, error } = await supabase
    .from('payment_submissions')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getAllPaymentSubmissionsForAdmin(
  status?: 'pending' | 'approved' | 'rejected'
): Promise<PaymentSubmission[]> {
  const adminSupabase = getSupabaseAdmin()
  let query = adminSupabase
    .from('payment_submissions')
    .select(`
      *,
      product:products(*),
      profile:profiles(*)
    `)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function approvePaymentSubmission(
  submissionId: string,
  adminId: string
): Promise<PaymentSubmission> {
  const { data, error } = await supabase
    .from('payment_submissions')
    .update({
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', submissionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function rejectPaymentSubmission(
  submissionId: string,
  adminId: string
): Promise<PaymentSubmission> {
  const { data, error } = await supabase
    .from('payment_submissions')
    .update({
      status: 'rejected',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', submissionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPaymentSubmissionById(
  id: string
): Promise<PaymentSubmission | null> {
  const { data, error } = await supabase
    .from('payment_submissions')
    .select(`
      *,
      product:products(*),
      profile:profiles(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}