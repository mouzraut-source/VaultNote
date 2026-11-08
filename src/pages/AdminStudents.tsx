import { useState } from 'react'
import { useAdminPurchases } from '@/hooks/usePurchases'
import { useAdminPaymentSubmissions } from '@/hooks/usePaymentSubmissions'
import { Button } from '@/components/Button'
import { Card, CardContent } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { formatCurrency, formatDate } from '@/utils/format'
import { Search, Filter, User, BookOpen, CreditCard, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react'
import { cn } from '@/utils/format'
import type { Purchase } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/services/supabase'

export function AdminStudents() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [studentPurchases, setStudentPurchases] = useState<Purchase[]>([])
  const [studentSubmissions, setStudentSubmissions] = useState<any[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  const { data: purchases } = useAdminPurchases()
  const { data: submissions } = useAdminPaymentSubmissions()

  const studentsMap = new Map<string, any>()
  purchases?.forEach(p => {
    if (p.profile) studentsMap.set(p.profile.id, p.profile)
  })
  submissions?.forEach(s => {
    if (s.profile) studentsMap.set(s.profile.id, s.profile)
  })

  const students = Array.from(studentsMap.values())

  const filteredStudents = students.filter(s =>
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewStudent = async (student: any) => {
    setSelectedStudent(student)
    setLoadingDetails(true)
    try {
      const [purchasesRes, submissionsRes] = await Promise.all([
        supabase.from('purchases').select('*, product:products(*)').eq('user_id', student.id).order('purchased_at', { ascending: false }),
        supabase.from('payment_submissions').select('*, product:products(*)').eq('user_id', student.id).order('created_at', { ascending: false })
      ])
      setStudentPurchases(purchasesRes.data || [])
      setStudentSubmissions(submissionsRes.data || [])
    } catch (err) {
      console.error('Failed to load student details:', err)
    } finally {
      setLoadingDetails(false)
    }
  }

  const getRoleBadge = (role: string) => (
    <Badge variant={role === 'admin' ? 'danger' : 'default'} className="px-2 py-1">
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
      </div>

      <Card variant="outlined" padding="lg">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No students found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchases</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const studentPurchases = purchases?.filter(p => p.user_id === student.id) || []
                  const studentSubs = submissions?.filter(s => s.user_id === student.id) || []
                  const activePurchases = studentPurchases.filter(p => p.status === 'active').length
                  const pendingSubs = studentSubs.filter(s => s.status === 'pending').length
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {student.full_name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.full_name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(student.role || 'student')}</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{activePurchases}</span>
                        <span className="text-sm text-gray-500 ml-1">active</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{studentSubs.length}</span>
                        <span className="text-sm text-gray-500 ml-1">total</span>
                        {pendingSubs > 0 && (
                          <Badge variant="warning" className="ml-1 text-xs">{pendingSubs} pending</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(student.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewStudent(student)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent?.full_name || 'Student Details'}
        size="xl"
      >
        {loadingDetails ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{selectedStudent?.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Role</p>
                <p className="font-medium">{selectedStudent?.role}</p>
              </div>
              <div>
                <p className="text-gray-500">Joined</p>
                <p className="font-medium">{formatDate(selectedStudent?.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-500">ID</p>
                <p className="font-mono text-xs">{selectedStudent?.id}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Purchases ({studentPurchases.length})
              </h3>
              {studentPurchases.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No purchases</p>
              ) : (
                <div className="space-y-2">
                  {studentPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{purchase.product?.title}</p>
                          <p className="text-sm text-gray-500">Purchased {formatDate(purchase.purchased_at)}</p>
                        </div>
                      </div>
                      <Badge status={purchase.status} className="px-2 py-1 text-xs">
                        {purchase.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {purchase.status === 'revoked' && <XCircle className="h-3 w-3 mr-1" />}
                        {purchase.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Submissions ({studentSubmissions.length})
              </h3>
              {studentSubmissions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No submissions</p>
              ) : (
                <div className="space-y-2">
                  {studentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{submission.product?.title}</p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(submission.amount)} • {formatDate(submission.created_at)}
                          </p>
                        </div>
                      </div>
                      <Badge status={submission.status} className="px-2 py-1 text-xs">
                        {submission.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {submission.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {submission.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                        {submission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}