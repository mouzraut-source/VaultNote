import { type ReactNode, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/format'
import { modalBackdrop, modalContent } from '@/components/ui/MotionComponents'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
  closeOnOverlayClick?: boolean
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  size = 'md', 
  className,
  closeOnOverlayClick = true,
}: ModalProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  }

  const content = (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalBackdrop}
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                className={cn(
                  'relative w-full bg-white rounded-xl shadow-xl',
                  sizes[size],
                  className
                )}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                {(title || description) && (
                  <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div>
                      {title && (
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                      )}
                      {description && (
                        <p className="mt-1 text-sm text-gray-500">{description}</p>
                      )}
                    </div>
                    <motion.button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-lg"
                      aria-label="Close modal"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                )}
                <div className="p-6">{children}</div>
              </motion.div>
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  )

  return createPortal(content, document.body)
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <motion.button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {cancelText}
        </motion.button>
        <motion.button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50',
            variant === 'danger' ? 'bg-danger hover:bg-red-700' : 'bg-primary hover:bg-primary-hover'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Processing...' : confirmText}
        </motion.button>
      </div>
    </Modal>
  )
}