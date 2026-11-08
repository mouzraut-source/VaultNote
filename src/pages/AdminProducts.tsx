import { useState } from 'react'
import { useAdminProducts } from '@/hooks/useProducts'
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts'
import { uploadAcademicMaterial } from '@/services/storage'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Textarea } from '@/components/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/Card'
import { Modal } from '@/components/Modal'
import { formatCurrency } from '@/utils/format'
import { Plus, Edit, Trash2, FileText, Upload, Eye, X, Save, Loader2 } from 'lucide-react'
import { cn } from '@/utils/format'
import { productSchema, type ProductInput } from '@/utils/validation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { Product } from '@/types'

type AdminProductFormData = ProductInput & { isActive: boolean }

export function AdminProducts() {
  const { data: products, isLoading, refetch } = useAdminProducts()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)

  const isEditMode = !!editingProduct

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      subject: '',
      price: 0,
      isActive: true,
    },
  })

  const openCreateModal = () => {
    setEditingProduct(null)
    setSelectedFile(null)
    setFileInputKey(Date.now())
    reset({
      title: '',
      description: '',
      subject: '',
      price: 0,
      isActive: true,
    })
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setSelectedFile(null)
    setFileInputKey(Date.now())
    reset({
      title: product.title,
      description: product.description || '',
      subject: product.subject || '',
      price: product.price,
      isActive: product.is_active,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setSelectedFile(null)
    reset()
  }

  const onSubmit = async (data: AdminProductFormData) => {
    if (!isEditMode && !selectedFile) {
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      let storagePath: string | null = editingProduct?.storage_path ?? null

      if (isEditMode) {
        if (selectedFile) {
          setUploadProgress(30)
          storagePath = await uploadAcademicMaterial(editingProduct!.id, selectedFile)
          setUploadProgress(70)
        }
        await updateProduct.mutateAsync({
          id: editingProduct!.id,
          input: { 
            title: data.title,
            description: data.description ?? null,
            subject: data.subject ?? null,
            price: data.price,
            storage_path: storagePath || undefined,
            is_active: data.isActive,
          },
        })
        setUploadProgress(100)
      } else {
        const newProduct = await createProduct.mutateAsync({
          title: data.title,
          description: data.description ?? null,
          subject: data.subject ?? null,
          price: data.price,
          storage_path: null,
          is_active: data.isActive,
        })

        setUploadProgress(40)

        if (selectedFile && newProduct?.id) {
          storagePath = await uploadAcademicMaterial(newProduct.id, selectedFile)
          setUploadProgress(75)

          await updateProduct.mutateAsync({
            id: newProduct.id,
            input: { 
              title: data.title,
              description: data.description ?? null,
              subject: data.subject ?? null,
              price: data.price,
              storage_path: storagePath,
              is_active: data.isActive,
            },
          })
          setUploadProgress(100)
        }
      }

      setTimeout(() => {
        closeModal()
        refetch()
      }, 500)
    } catch (err) {
      console.error('Error saving product:', err)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const confirmDelete = (product: Product) => {
    setDeletingProduct(product)
  }

  const handleDelete = async () => {
    if (!deletingProduct) return
    try {
      await deleteProduct.mutateAsync(deletingProduct.id)
      if (deletingProduct.storage_path) {
      }
      refetch()
    } catch (err) {
      console.error('Error deleting product:', err)
    } finally {
      setDeletingProduct(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Button onClick={openCreateModal} disabled>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Adding...
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} variant="outlined" padding="none" className="animate-pulse">
              <div className="h-32 bg-gray-200" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products?.length === 0 ? (
        <Card variant="outlined" padding="lg" className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No products yet</h3>
          <p className="mt-1 text-gray-500">Create your first academic material</p>
          <Button className="mt-4" onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products?.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{product.description || 'No description'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.subject || '—'}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      product.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    )}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.storage_path ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Eye className="h-3 w-3" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <X className="h-3 w-3" />
                        Missing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => confirmDelete(product)} className="text-danger hover:bg-danger/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={isEditMode ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Title"
            placeholder="e.g., Physics Question Bank 2024"
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            label="Description"
            placeholder="Describe the content, coverage, etc."
            error={errors.description?.message}
            {...register('description')}
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Subject"
              placeholder="e.g., Physics, Mathematics"
              error={errors.subject?.message}
              {...register('subject')}
            />

            <Input
              label="Price (INR)"
              type="number"
              step="1"
              min="0"
              placeholder="0"
              error={errors.price?.message}
              {...register('price', { valueAsNumber: true })}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register('isActive')}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active (visible to students)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              PDF File {isEditMode && editingProduct?.storage_path ? '(Leave empty to keep current)' : '(Required for new products)'}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                key={fileInputKey}
                id="pdf-upload"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                onClick={(e) => e.stopPropagation()}
              />
              <label htmlFor="pdf-upload" className="cursor-pointer block" onClick={(e) => e.stopPropagation()}>
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <Upload className="mx-auto h-10 w-10 text-primary mb-2" />
                    <p className="text-sm text-gray-600 font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-600">Click or drag PDF to upload</p>
                    <p className="text-xs text-gray-400">Max 50MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {uploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {uploadProgress === 100 ? 'Completing...' : 'Uploading...'}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" className="flex-1" onClick={closeModal} disabled={isSubmitting || uploading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={isSubmitting || uploading}>
              {isEditMode ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title="Delete Product"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{deletingProduct?.title}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeletingProduct(null)} disabled={deleteProduct.isPending}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleteProduct.isPending}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}