import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { getUserPaymentSubmissions, getAllPaymentSubmissionsForAdmin, createPaymentSubmission, approvePaymentSubmission, rejectPaymentSubmission, getPaymentSubmissionById } from '@/services/payments'
import { createPurchase, getPurchaseByPaymentSubmission } from '@/services/purchases'
import type { PaymentSubmission, CreatePaymentSubmissionInput } from '@/types'

export function usePaymentSubmissions() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['payment-submissions', user?.id],
    queryFn: () => getUserPaymentSubmissions(user!.id),
    enabled: !!user,
  })
}

export function useAdminPaymentSubmissions(status?: 'pending' | 'approved' | 'rejected') {
  return useQuery({
    queryKey: ['admin', 'payment-submissions', status],
    queryFn: () => getAllPaymentSubmissionsForAdmin(status),
  })
}

export function usePaymentSubmission(id: string) {
  return useQuery({
    queryKey: ['payment-submission', id],
    queryFn: () => getPaymentSubmissionById(id),
    enabled: !!id,
  })
}

export function useCreatePaymentSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatePaymentSubmissionInput) => createPaymentSubmission(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-submissions'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'payment-submissions'] })
    },
  })
}

export function useApprovePaymentSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ submissionId, adminId }: { submissionId: string; adminId: string }) => {
      // First approve the payment submission
      await approvePaymentSubmission(submissionId, adminId)
      
      // Then get the submission to create the purchase
      const submission = await getPaymentSubmissionById(submissionId)
      
      if (submission) {
        // Check if purchase already exists
        const existingPurchase = await getPurchaseByPaymentSubmission(submissionId)
        if (!existingPurchase) {
          await createPurchase({
            user_id: submission.user_id,
            product_id: submission.product_id,
            payment_submission_id: submissionId,
          })
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-submissions'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'payment-submissions'] })
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'purchases'] })
    },
  })
}

export function useRejectPaymentSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ submissionId, adminId }: { submissionId: string; adminId: string }) => 
      rejectPaymentSubmission(submissionId, adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-submissions'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'payment-submissions'] })
    },
  })
}