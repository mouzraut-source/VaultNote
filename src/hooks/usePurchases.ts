import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { getUserPurchases, getAllPurchasesForAdmin, checkUserHasAccess, createPurchase, revokePurchase, getPurchaseByPaymentSubmission } from '@/services/purchases'
import type { Purchase } from '@/types'

export function usePurchases() {
  const { user } = useAuth()
  const query = useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: () => getUserPurchases(user!.id),
    enabled: !!user,
  })
  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useAdminPurchases() {
  return useQuery({
    queryKey: ['admin', 'purchases'],
    queryFn: getAllPurchasesForAdmin,
  })
}

export function useCheckAccess(productId: string) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['access', user?.id, productId],
    queryFn: () => checkUserHasAccess(user!.id, productId),
    enabled: !!user && !!productId,
  })
}

export function useCreatePurchase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'purchases'] })
    },
  })
}

export function useRevokePurchase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'purchases'] })
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
    },
  })
}

export function usePurchaseByPaymentSubmission(paymentSubmissionId: string) {
  return useQuery({
    queryKey: ['purchase', 'payment-submission', paymentSubmissionId],
    queryFn: () => getPurchaseByPaymentSubmission(paymentSubmissionId),
    enabled: !!paymentSubmissionId,
  })
}