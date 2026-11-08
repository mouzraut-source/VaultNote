import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePurchases } from '@/hooks/usePurchases'
import { usePaymentSubmissions } from '@/hooks/usePaymentSubmissions'
import { Button } from '@/components/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { formatCurrency, formatDate } from '@/utils/format'
import { BookOpen, CreditCard, Clock, CheckCircle, XCircle, Eye, ArrowRight, RefreshCw, FileText } from 'lucide-react'
import { cn } from '@/utils/format'

export function Dashboard() {
  const { profile, refreshProfile } = useAuth()
  const { data: purchases, isLoading: purchasesLoading, refetch: refetchPurchases } = usePurchases()
  const { data: submissions, isLoading: submissionsLoading, refetch: refetchSubmissions } = usePaymentSubmissions()

  const activePurchases = purchases?.filter(p => p.status === 'active') || []
  const pendingSubmissions = submissions?.filter(s => s.status === 'pending') || []
  const rejectedSubmissions = submissions?.filter(s => s.status === 'rejected') || []
  const approvedSubmissions = submissions?.filter(s => s.status === 'approved') || []

  const handleRefresh = () => {
    refreshProfile()
    refetchPurchases()
    refetchSubmissions()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile?.full_name || 'Student'}</h1>
            <p className="mt-1 text-gray-600">Manage your purchases and payment submissions</p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={purchasesLoading || submissionsLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="outlined" padding="lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Purchased Materials</p>
                <p className="text-2xl font-bold text-gray-900">{activePurchases.length}</p>
              </div>
            </div>
          </Card>
          <Card variant="outlined" padding="lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">{pendingSubmissions.length}</p>
              </div>
            </div>
          </Card>
          <Card variant="outlined" padding="lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rejected Payments</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedSubmissions.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card variant="outlined" padding="none">
            <CardHeader className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Purchased Materials
                  </CardTitle>
                  <CardDescription>Access your approved academic materials</CardDescription>
                </div>
                {activePurchases.length > 0 && (
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {activePurchases.length}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {purchasesLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="h-12 w-12 bg-gray-200 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activePurchases.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No purchased materials</h3>
                  <p className="mt-1 text-gray-500">Browse available materials and make a purchase</p>
                  <Link to="/products" className="mt-4 inline-block">
                    <Button>Browse Materials</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activePurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{purchase.product?.title}</h4>
                          <p className="text-sm text-gray-500">
                            {purchase.product?.subject || 'General'} • Purchased {formatDate(purchase.purchased_at)}
                          </p>
                        </div>
                      </div>
                      <Link to={`/reader/${purchase.product_id}`}>
                        <Button variant="primary" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined" padding="none">
            <CardHeader className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Submissions
                  </CardTitle>
                  <CardDescription>Track your payment verification status</CardDescription>
                </div>
                <Link to="/products">
                  <Button variant="outline" size="sm">Browse Materials</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {submissionsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-200 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3" />
                          <div className="h-3 bg-gray-200 rounded w-1/4" />
                        </div>
                      </div>
                      <div className="h-6 w-20 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : (submissions || []).length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No payment submissions</h3>
                  <p className="mt-1 text-gray-500">Submit a payment reference to purchase materials</p>
                  <Link to="/products" className="mt-4 inline-block">
                    <Button>Browse Materials</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {(submissions || []).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{submission.product?.title}</h4>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(submission.amount)} • Submitted {formatDate(submission.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge status={submission.status} className="px-3 py-1">
                          {submission.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {submission.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {submission.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </Badge>
                        {submission.status === 'rejected' && (
                          <Link to={`/products/${submission.product_id}`}>
                            <Button variant="outline" size="sm">Retry</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}