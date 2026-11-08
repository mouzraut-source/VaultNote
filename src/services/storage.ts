import { supabase } from './supabase'
import { STORAGE_BUCKETS, MAX_FILE_SIZES, ALLOWED_FILE_TYPES } from '@/utils/constants'

export async function uploadAcademicMaterial(
  productId: string,
  file: File
): Promise<string> {
  const allowedPdfTypes = ALLOWED_FILE_TYPES.PDF as readonly string[]
  if (!allowedPdfTypes.includes(file.type)) {
    throw new Error('Only PDF files are allowed')
  }
  if (file.size > MAX_FILE_SIZES.PDF) {
    throw new Error('PDF file size must be less than 50MB')
  }

  const fileExt = file.name.split('.').pop() || 'pdf'
  const fileName = `${productId}/${Date.now()}.${fileExt}`
  const path = `products/${fileName}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.ACADEMIC_MATERIALS)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error
  return path
}

export async function uploadPaymentProof(
  userId: string,
  file: File
): Promise<string> {
  const allowedImageTypes = ALLOWED_FILE_TYPES.IMAGE as readonly string[]
  if (!allowedImageTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG, or WebP images are allowed')
  }
  if (file.size > MAX_FILE_SIZES.IMAGE) {
    throw new Error('Image file size must be less than 5MB')
  }

  const fileExt = file.name.split('.').pop() || 'jpg'
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  const path = fileName

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.PAYMENT_PROOFS)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error
  return path
}

export async function getSignedUrlForPDF(
  storagePath: string,
  expiresIn: number = 300 // 5 minutes
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.ACADEMIC_MATERIALS)
    .createSignedUrl(storagePath, expiresIn)

  if (error) throw error
  return data.signedUrl
}

export async function getSignedUrlForPaymentProof(
  storagePath: string,
  expiresIn: number = 300
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.PAYMENT_PROOFS)
    .createSignedUrl(storagePath, expiresIn)

  if (error) throw error
  return data.signedUrl
}

export async function deleteAcademicMaterial(storagePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.ACADEMIC_MATERIALS)
    .remove([storagePath])

  if (error) throw error
}

export async function deletePaymentProof(storagePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.PAYMENT_PROOFS)
    .remove([storagePath])

  if (error) throw error
}