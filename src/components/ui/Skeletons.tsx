import { motion } from 'framer-motion'
import { cn } from '@/utils/format'
import { skeletonPulse } from './MotionComponents'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'button'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({ 
  className, 
  variant = 'text', 
  width, 
  height, 
  lines = 1 
}: SkeletonProps) {
  const baseStyle = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    borderRadius: '0.5rem',
    animation: 'shimmer 1.5s infinite linear',
  }

  const variants = {
    text: { 
      height: height || '1rem', 
      width: width || '100%', 
      borderRadius: '0.25rem',
    },
    circular: { 
      height: height || '3rem', 
      width: width || '3rem', 
      borderRadius: '9999px',
    },
    rectangular: { 
      height: height || '8rem', 
      width: width || '100%', 
      borderRadius: '0.5rem',
    },
    card: { 
      height: height || '12rem', 
      width: width || '100%', 
      borderRadius: '0.75rem',
    },
    button: { 
      height: height || '2.5rem', 
      width: width || '8rem', 
      borderRadius: '0.5rem',
    },
  }

  const style = { ...baseStyle, ...variants[variant] } as React.CSSProperties

  if (lines > 1 && variant === 'text') {
    return (
      <motion.div 
        className={cn('space-y-2', className)} 
        initial="hidden"
        animate="visible"
        variants={skeletonPulse}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            style={{ ...style, width: i === lines - 1 ? '60%' : '100%' }}
            initial="hidden"
            animate="visible"
            variants={skeletonPulse}
          />
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={className} 
      style={style}
      initial="hidden"
      animate="visible"
      variants={skeletonPulse}
    />
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <motion.div className={cn('rounded-xl bg-white border border-gray-200 p-6 space-y-4', className)} initial="hidden" animate="visible" variants={skeletonPulse}>
      <Skeleton variant="circular" width="48" height="48" />
      <div className="space-y-3">
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="90%" lines={2} />
      </div>
      <div className="flex gap-2 pt-4">
        <Skeleton variant="button" />
        <Skeleton variant="button" />
      </div>
    </motion.div>
  )
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <motion.div className={cn('rounded-xl bg-white border border-gray-200 overflow-hidden', className)} initial="hidden" animate="visible" variants={skeletonPulse}>
      <Skeleton variant="rectangular" height="200" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" lines={2} />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="button" width="100%" />
      </div>
    </motion.div>
  )
}

export function TableRowSkeleton({ columns = 5, className }: { columns?: number; className?: string }) {
  return (
    <motion.tr className={className} initial="hidden" animate="visible" variants={skeletonPulse}>
      {Array.from({ length: columns }).map((_, i) => (
        <motion.td key={i} className="p-4">
          <Skeleton variant="text" width="80%" height="1rem" />
        </motion.td>
      ))}
    </motion.tr>
  )
}

export function TableSkeleton({ rows = 5, columns = 5, className }: { rows?: number; columns?: number; className?: string }) {
  return (
    <motion.div className={cn('overflow-hidden rounded-lg border border-gray-200', className)} initial="hidden" animate="visible" variants={skeletonPulse}>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {Array.from({ length: columns }).map((_, i) => (
              <motion.th key={i} className="p-4 text-left">
                <Skeleton variant="text" width="60%" height="0.875rem" />
              </motion.th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRowSkeleton key={rowIndex} columns={columns} />
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}

export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <motion.div className={cn('space-y-6', className)} initial="hidden" animate="visible" variants={skeletonPulse}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="100%" className="mt-2 text-2xl font-bold" height="2rem" />
          </motion.div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <Skeleton variant="text" width="40%" className="mb-4" />
        <TableSkeleton rows={3} columns={4} />
      </div>
    </motion.div>
  )
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <motion.div 
      className={cn('text-center py-12', className)} 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div 
        className="mx-auto h-16 w-16 text-gray-300 mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {icon}
      </motion.div>
      <motion.h3 
        className="text-lg font-medium text-gray-900 mb-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {title}
      </motion.h3>
      <motion.p 
        className="text-gray-500 mb-6 max-w-md mx-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {description}
      </motion.p>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}

export function ErrorState({ 
  title, 
  message, 
  onRetry, 
  className 
}: { 
  title: string
  message: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <motion.div 
      className={cn('text-center py-12', className)} 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div 
        className="mx-auto h-16 w-16 text-red-400 mb-4 rounded-full bg-red-50 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </motion.div>
      <motion.h3 
        className="text-lg font-medium text-gray-900 mb-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {title}
      </motion.h3>
      <motion.p 
        className="text-gray-500 mb-6 max-w-md mx-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {message}
      </motion.p>
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}