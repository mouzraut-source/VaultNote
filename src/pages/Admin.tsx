import { useAuth } from '@/hooks/useAuth'
import { useAdminProducts } from '@/hooks/useProducts'
import { useAdminPaymentSubmissions } from '@/hooks/usePaymentSubmissions'
import { useAdminPurchases } from '@/hooks/usePurchases'
import { Card, CardContent } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { BookOpen, CreditCard, Users, ShoppingBag, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/format'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/format'

export function AdminDashboard() {
  const { profile } = useAuth()
  const { data: products } = useAdminProducts()
  const { data: pendingPayments } = useAdminPaymentSubmissions('pending')
  const { data: purchases } = useAdminPurchases()

  const activeProducts = products?.filter(p => p.is_active).length || 0
  const totalStudents = new Set(purchases?.map(p => p.user_id) || []).size
  const pendingCount = pendingPayments?.length || 0
  const totalRevenue = purchases
    ?.filter(p => p.status === 'active')
    .reduce((sum, p) => sum + (p.product?.price || 0), 0) || 0

  const recentPurchases = purchases?.slice(0, 5) || []
  const recentPendingPayments = pendingPayments?.slice(0, 5) || []

  const stats = [
    {
      title: 'Active Products',
      value: activeProducts,
      icon: BookOpen,
      color: 'text-primary bg-primary/10',
      href: '/admin/products',
    },
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'text-green-600 bg-green-100',
      href: '/admin/students',
    },
    {
      title: 'Pending Payments',
      value: pendingCount,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100',
      href: '/admin/payments',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
      href: '/admin/purchases',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome back, {profile?.full_name || 'Admin'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} to={stat.href} className="block">
              <Card variant="outlined" padding="lg" className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={cn('h-12 w-12 rounded-lg flex items-center justify-center', stat.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card variant="outlined" padding="none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pending Payments</h2>
              <Link to="/admin/payments" className="text-sm text-primary hover:text-primary-hover">
                View all
              </Link>
            </div>
            {pendingCount === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No pending payments</h3>
                <p className="mt-1 text-gray-500">All payments are up to date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPendingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{payment.profile?.full_name || 'Unknown'}</h4>
                        <p className="text-sm text-gray-500">
                          {payment.product?.title} • {formatCurrency(payment.amount)}
                        </p>
                      </div>
                    </div>
                    <Link to={`/admin/payments`}>
                      <Badge status="pending" className="px-3 py-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="outlined" padding="none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Purchases</h2>
              <Link to="/admin/purchases" className="text-sm text-primary hover:text-primary-hover">
                View all
              </Link>
            </div>
            {recentPurchases.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No purchases yet</h3>
                <p className="mt-1 text-gray-500">Purchases will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{purchase.product?.title}</h4>
                        <p className="text-sm text-gray-500">
                          {purchase.profile?.full_name || 'Unknown'} • {formatDate(purchase.purchased_at)}
                        </p>
                      </div>
                    </div>
                    <Badge status={purchase.status} className="px-3 py-1">
                      {purchase.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {purchase.status === 'revoked' && <XCircle className="h-3 w-3 mr-1" />}
                      {purchase.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Link to="/admin/products" className="block">
          <Card variant="outlined" padding="lg" className="hover:shadow-md transition-shadow text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
            <p className="mt-1 text-gray-500">Create, edit, and manage academic materials</p>
            <p className="mt-4 text-sm font-medium text-primary">Go to Products →</p>
          </Card>
        </Link>
        <Link to="/admin/students" className="block">
          <Card variant="outlined" padding="lg" className="hover:shadow-md transition-shadow text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-green-100 flex items-center justify-center">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Manage Students</h3>
            <p className="mt-1 text-gray-500">View student accounts and their activity</p>
            <p className="mt-4 text-sm font-medium text-green-600">Go to Students →</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}