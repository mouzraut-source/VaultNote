import { supabase } from './supabase'
import type { Purchase } from '@/types'

export async function getUserPurchases(userId: string): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('purchased_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getAllPurchasesForAdmin(): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      product:products(*),
      profile:profiles(*),
      payment_submission:payment_submissions(*)
    `)
    .order('purchased_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function checkUserHasAccess(userId: string, productId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('status', 'active')
    .maybeSingle()

  if (error) throw error
  return !!data
}

export interface CreatePurchaseInput {
  user_id: string
  product_id: string
  payment_submission_id: string
}

export async function createPurchase(input: CreatePurchaseInput): Promise<Purchase> {
  const { data, error } = await supabase
    .from('purchases')
    .insert({
      ...input,
      status: 'active',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function revokePurchase(purchaseId: string): Promise<Purchase> {
  const { data, error } = await supabase
    .from('purchases')
    .update({ status: 'revoked' })
    .eq('id', purchaseId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPurchaseByPaymentSubmission(
  paymentSubmissionId: string
): Promise<Purchase | null> {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('payment_submission_id', paymentSubmissionId)
    .maybeSingle()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}