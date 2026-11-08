import { forwardRef, type HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/format'
import { scaleIn } from '@/components/ui/MotionComponents'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'status'
  status?: string
  animate?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', status, children, animate = true, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      danger: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
      status: status ? getStatusColor(status) : 'bg-gray-100 text-gray-700',
    }

    const { onAnimationStart, onAnimationEnd, onDragStart, onDragEnd, onDrag, ...restProps } = props

    return (
      <motion.span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variants[variant],
          className
        )}
        initial={animate ? 'hidden' : 'visible'}
        animate={animate ? 'visible' : undefined}
        variants={scaleIn}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        {...restProps}
      >
        {children}
      </motion.span>
    )
  }
)

Badge.displayName = 'Badge'

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'approved':
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'rejected':
    case 'revoked':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}