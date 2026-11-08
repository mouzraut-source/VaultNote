import { useState } from 'react'
import { useAdminPaymentSubmissions } from '@/hooks/usePaymentSubmissions'
import { useApprovePaymentSubmission, useRejectPaymentSubmission } from '@/hooks/usePaymentSubmissions'
import { getSignedUrlForPaymentProof } from '@/services/storage'
import { Button } from '@/components/Button'
import { Card, CardContent } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Download } from 'lucide-react'
import { cn } from '@/utils/format'
import type { PaymentSubmission } from '@/types'

export function AdminPayments() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<PaymentSubmission | null>(null)
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(undefined)

  const { data: submissions, isLoading, refetch } = useAdminPaymentSubmissions(
    statusFilter === 'all' ? undefined : statusFilter
  )
  const approvePayment = useApprovePaymentSubmission()
  const rejectPayment = useRejectPaymentSubmission()

  const filteredSubmissions = submissions?.filter(s => {
    const matchesSearch = s.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.transaction_reference?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  }) || []

  const handleViewScreenshot = async (submission: PaymentSubmission) => {
    setSelectedSubmission(submission)
    if (submission.screenshot_path) {
      try {
        const url = await getSignedUrlForPaymentProof(submission.screenshot_path)
        setScreenshotUrl(url)
      } catch (err) {
        console.error('Failed to load screenshot:', err)
      }
    }
  }

  const handleApprove = async (submission: PaymentSubmission) => {
    try {
      await approvePayment.mutateAsync({
        submissionId: submission.id,
        adminId: 'current-admin-id', // In real app, get from auth context
      })
      refetch()
    } catch (err) {
      console.error('Failed to approve payment:', err)
    }
  }

  const handleReject = async (submission: PaymentSubmission) => {
    try {
      await rejectPayment.mutateAsync({
        submissionId: submission.id,
        adminId: 'current-admin-id',
      })
      refetch()
    } catch (err) {
      console.error('Failed to reject payment:', err)
    }
  }

  const statusCounts = {
    all: submissions?.length || 0,
    pending: submissions?.filter(s => s.status === 'pending').length || 0,
    approved: submissions?.filter(s => s.status === 'approved').length || 0,
    rejected: submissions?.filter(s => s.status === 'rejected').length || 0,
  }

  const statusTabs = [
    { key: 'all', label: 'All', count: statusCounts.all },
    { key: 'pending', label: 'Pending', count: statusCounts.pending },
    { key: 'approved', label: 'Approved', count: statusCounts.approved },
    { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
  ] as const

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Submissions</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">Payment Submissions</h1>
      </div>

      <Card variant="outlined" padding="lg">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, product, or reference..."
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
              {statusTabs.map(tab => (
                <option key={tab.key} value={tab.key}>
                  {tab.label} ({tab.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No payment submissions found</h3>
            <p className="mt-1 text-gray-500">
              {statusFilter !== 'all' ? `No ${statusFilter} payments` : 'No submissions yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screenshot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{submission.profile?.full_name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{submission.profile?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{submission.product?.title}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(submission.amount)}</td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">{submission.transaction_reference}</td>
                    <td className="px-6 py-4">
                      {submission.screenshot_path ? (
                        <Button variant="ghost" size="sm" onClick={() => handleViewScreenshot(submission)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={submission.status} className="px-3 py-1">
                        {submission.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {submission.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {submission.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(submission.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {submission.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleApprove(submission)} loading={approvePayment.isPending}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleReject(submission)} className="text-danger hover:bg-danger/10" loading={rejectPayment.isPending}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {submission.status !== 'pending' && (
                          <span className="text-sm text-gray-500">
                            Reviewed {submission.reviewed_at ? formatDateTime(submission.reviewed_at) : 'recently'}
                          </span>
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

      <Modal
        isOpen={!!selectedSubmission && !!screenshotUrl}
        onClose={() => { setSelectedSubmission(null); setScreenshotUrl(undefined); }}
        title="Payment Screenshot"
        size="lg"
      >
        <div className="text-center">
          <img
            src={screenshotUrl!}
            alt="Payment screenshot"
            className="max-w-full max-h-[70vh] rounded-lg shadow-lg mx-auto"
          />
          <div className="mt-4 flex justify-center gap-3">
            <a
              href={screenshotUrl!}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </a>
            <Button variant="outline" onClick={() => { setSelectedSubmission(null); setScreenshotUrl(undefined); }}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}