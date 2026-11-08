import { useState } from 'react'
import { useAdminPurchases } from '@/hooks/usePurchases'
import { useRevokePurchase } from '@/hooks/usePurchases'
import { Button } from '@/components/Button'
import { Card, CardContent } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { Search, Filter, BookOpen, User, ShoppingBag, Clock, CheckCircle, XCircle, MoreVertical, RotateCcw } from 'lucide-react'
import { cn } from '@/utils/format'
import type { Purchase } from '@/types'

export function AdminPurchases() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'revoked'>('all')
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)

  const { data: purchases, isLoading, refetch } = useAdminPurchases()
  const revokePurchase = useRevokePurchase()

  const filteredPurchases = purchases?.filter(p => {
    const matchesSearch = p.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const statusCounts = {
    all: purchases?.length || 0,
    active: purchases?.filter(p => p.status === 'active').length || 0,
    revoked: purchases?.filter(p => p.status === 'revoked').length || 0,
  }

  const handleRevoke = async (purchase: Purchase) => {
    try {
      await revokePurchase.mutateAsync(purchase.id)
      refetch()
    } catch (err) {
      console.error('Failed to revoke purchase:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} variant="outlined" padding="none" className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-200 rounded" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
      </div>

      <Card variant="outlined" padding="lg">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, product, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All ({statusCounts.all})</option>
              <option value="active">Active ({statusCounts.active})</option>
              <option value="revoked">Revoked ({statusCounts.revoked})</option>
            </select>
          </div>
        </div>

        {filteredPurchases.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No purchases found</h3>
            <p className="mt-1 text-gray-500">
              {statusFilter !== 'all' ? `No ${statusFilter} purchases` : 'No purchases yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {purchase.profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{purchase.profile?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{purchase.profile?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{purchase.product?.title}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(purchase.product?.price || 0)}</td>
                    <td className="px-6 py-4">
                      <Badge status={purchase.status} className="px-3 py-1">
                        {purchase.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {purchase.status === 'revoked' && <XCircle className="h-3 w-3 mr-1" />}
                        {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(purchase.purchased_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {purchase.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevoke(purchase)}
                            className="text-danger hover:bg-danger/10"
                            loading={revokePurchase.isPending}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Revoke
                          </Button>
                        )}
                        {purchase.status === 'revoked' && (
                          <span className="text-sm text-gray-500">Access revoked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}