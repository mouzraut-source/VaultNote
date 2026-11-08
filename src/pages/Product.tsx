import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct } from '@/hooks/useProducts'
import { useAuth } from '@/hooks/useAuth'
import { usePurchases } from '@/hooks/usePurchases'
import { usePaymentSubmissions } from '@/hooks/usePaymentSubmissions'
import { useCreatePaymentSubmission } from '@/hooks/usePaymentSubmissions'
import { uploadPaymentProof } from '@/services/storage'
import { Button } from '@/components/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/Card'
import { Input } from '@/components/Input'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { formatCurrency, formatDate } from '@/utils/format'
import { BookOpen, CreditCard, AlertCircle, CheckCircle, XCircle, FileText, Upload, ArrowLeft, Eye, Download } from 'lucide-react'
import { cn } from '@/utils/format'
import type { Product } from '@/types'
import { paymentSubmissionSchema } from '@/utils/validation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PaymentSubmissionInput } from '@/utils/validation'

const UPI_ID = import.meta.env.VITE_UPI_ID || 'admin@upi'
const UPI_QR_URL = import.meta.env.VITE_UPI_QR_CODE_URL

type PaymentFormData = Omit<PaymentSubmissionInput, 'productId'>

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { data: product, isLoading, error } = useProduct(id!)
  const { data: purchases } = usePurchases()
  const { data: submissions } = usePaymentSubmissions()
  const createPaymentSubmission = useCreatePaymentSubmission()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)

  const hasActivePurchase = purchases?.some(p => p.product_id === id && p.status === 'active')
  const pendingSubmission = submissions?.find(s => s.product_id === id && s.status === 'pending')
  const rejectedSubmission = submissions?.find(s => s.product_id === id && s.status === 'rejected')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSubmissionSchema.omit({ productId: true })),
    defaultValues: {
      transactionReference: '',
      amount: product?.price || 0,
      screenshot: null,
    },
  })

  const onSubmit = async (data: PaymentFormData) => {
    if (!user || !product) return

    setSubmitting(true)
    setUploadProgress(0)
    setSubmitError(null)

    try {
      let screenshotPath: string | null = null
      if (screenshotFile) {
        setUploadProgress(30)
        screenshotPath = await uploadPaymentProof(user.id, screenshotFile)
        setUploadProgress(75)
      }

      await createPaymentSubmission.mutateAsync({
        user_id: user.id,
        product_id: product.id,
        amount: data.amount,
        transaction_reference: data.transactionReference,
        screenshot_path: screenshotPath,
      })

      setUploadProgress(100)
      setShowPaymentModal(false)
      setValue('transactionReference', '')
      setScreenshotFile(null)
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit payment'
      setSubmitError(message)
      console.error('Payment submission error:', err)
    } finally {
      setSubmitting(false)
      setUploadProgress(0)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="elevated" padding="lg" className="max-w-md text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-danger mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
          <p className="mt-2 text-gray-600">The academic material you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="mt-6 inline-block">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Materials
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="outlined" padding="lg">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
                    <BookOpen className="h-3 w-3" />
                    {product.subject || 'General'}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</div>
                </div>
              </div>

              {product.description && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Course/Subject</p>
                  <p className="font-medium text-gray-900">{product.subject || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-gray-900">{formatCurrency(product.price)}</p>
                </div>
              </div>
            </Card>

            <Card variant="outlined" padding="lg">
              <CardHeader>
                <CardTitle>Purchase Information</CardTitle>
                <CardDescription>Complete payment to access this material</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Manual UPI Payment</h3>
                      <p className="text-sm text-gray-600">Pay using UPI and submit transaction reference</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Payment Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">UPI ID</span>
                      <code className="font-mono text-gray-900 bg-white px-2 py-1 rounded">{UPI_ID}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product</span>
                      <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.title}</span>
                    </div>
                  </div>

                  {UPI_QR_URL && (
                    <div>
                      <h4 className="font-medium text-gray-900">QR Code</h4>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                        <img 
                          src={UPI_QR_URL} 
                          alt="UPI QR Code" 
                          className="mx-auto max-w-[200px] max-h-[200px]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Important Instructions</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside">
                          <li>Complete payment using the UPI details above</li>
                          <li>Save the transaction reference (UTR) from your bank app</li>
                          <li>Submit the reference below for verification</li>
                          <li>Admin approval required before access is granted</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {hasActivePurchase ? (
                  <Link to={`/reader/${product.id}`}>
                    <Button className="w-full" variant="primary">
                      <Eye className="h-4 w-4 mr-2" />
                      Access Material
                    </Button>
                  </Link>
                ) : pendingSubmission ? (
                  <div className="w-full">
                    <Badge status="pending" className="w-full justify-center py-2">
                      Payment Submitted - Pending Review
                    </Badge>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Submitted on {formatDate(pendingSubmission.created_at)}
                    </p>
                  </div>
                ) : rejectedSubmission ? (
                  <div className="w-full">
                    <Badge status="rejected" className="w-full justify-center py-2">
                      Payment Rejected
                    </Badge>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      You can submit a new payment below
                    </p>
                    <Button className="w-full mt-3" variant="outline" onClick={() => setShowPaymentModal(true)}>
                      Submit New Payment
                    </Button>
                  </div>
                ) : user ? (
                  <Button className="w-full" onClick={() => setShowPaymentModal(true)}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Submit Payment Reference
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login">
                      <Button className="flex-1">Login to Purchase</Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="outline" className="flex-1">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card variant="outlined" padding="lg" className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Full answer key PDF</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span>In-browser PDF viewer</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Page navigation & zoom</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Mobile responsive</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <XCircle className="h-5 w-5 text-danger flex-shrink-0" />
                  <span className="text-danger">No download/print</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <XCircle className="h-5 w-5 text-danger flex-shrink-0" />
                  <span className="text-danger">Access after approval only</span>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500 text-center">
                  Access granted only after admin approval of payment.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Submit Payment Reference"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {submitError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg" role="alert">
              {submitError}
            </div>
          )}

          <Input
            label="Transaction Reference / UTR Number"
            placeholder="e.g., 123456789012"
            error={errors.transactionReference?.message}
            {...register('transactionReference')}
            helperText="Find this in your bank app (UPI transaction ID, IMPS ref, NEFT UTR, etc.)"
          />

          <Input
            label="Amount Paid (₹)"
            type="number"
            step="1"
            min="1"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
            helperText={`Expected: ${formatCurrency(product.price)}`}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Payment Screenshot (Optional - Helps with verification)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                id="screenshot-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  setScreenshotFile(file)
                  register('screenshot').onChange(e)
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <label htmlFor="screenshot-upload" className="cursor-pointer block" onClick={(e) => e.stopPropagation()}>
                {screenshotFile ? (
                  <div className="flex flex-col items-center">
                    <Upload className="mx-auto h-10 w-10 text-primary mb-2" />
                    <p className="text-sm text-gray-600 font-medium">{screenshotFile.name}</p>
                    <p className="text-xs text-gray-400">{(screenshotFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-600">Click or drag to upload</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP up to 5MB. Optional but recommended.</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)} disabled={submitting || createPaymentSubmission.isPending}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={submitting || createPaymentSubmission.isPending}>
              {createPaymentSubmission.isPending ? 'Process...' : 'Submit for Review'}
            </Button>
          </div>

          {submitting && (
            <div className="mt-4 mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {uploadProgress === 100 ? 'Processing...' : uploadProgress === 0 ? 'Preparing...' : 'Uploading...'}
              </p>
            </div>
          )}
        </form>
      </Modal>
    </div>
  )
}