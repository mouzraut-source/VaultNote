import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/format'
import { fadeInUp } from '@/components/ui/MotionComponents'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onAnimationStart' | 'onAnimationEnd'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, leftIcon, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    useEffect(() => {
      setHasValue(!!props.value || (props.defaultValue ? String(props.defaultValue).length > 0 : false))
    }, [props.value, props.defaultValue])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    const labelClasses = cn(
      'absolute left-3 text-gray-400 pointer-events-none transition-all duration-200 ease-out',
      isFocused || hasValue
        ? 'top-2 text-xs text-primary'
        : 'top-[38px] text-sm'
    )

    return (
      <div className="w-full">
        <div className="relative">
          {label && (
            <motion.label
              htmlFor={inputId}
              className={labelClasses}
              initial={hasValue ? { top: 6, fontSize: 12 } : { top: 38, fontSize: 14 }}
              animate={isFocused || hasValue ? { top: 6, fontSize: 12, color: 'rgb(59 130 246)' } : { top: 38, fontSize: 14, color: 'rgb(156 163 175)' }}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.label>
          )}
          {leftIcon && (
            <div className="absolute left-3 top-[38px] text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
              'disabled:bg-gray-50 disabled:cursor-not-allowed',
              error ? 'border-danger focus:ring-danger' : 'border-gray-300',
              leftIcon ? 'pl-10' : 'px-3',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id={`${inputId}-error`}
              className="mt-1.5 text-sm text-danger"
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onAnimationStart' | 'onAnimationEnd'> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    useEffect(() => {
      setHasValue(!!props.value || (props.defaultValue ? String(props.defaultValue).length > 0 : false))
    }, [props.value, props.defaultValue])

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    const labelClasses = cn(
      'absolute left-3 text-gray-400 pointer-events-none transition-all duration-200 ease-out',
      isFocused || hasValue
        ? 'top-2 text-xs text-primary'
        : 'top-[38px] text-sm'
    )

    return (
      <div className="w-full">
        <div className="relative">
          {label && (
            <motion.label
              htmlFor={inputId}
              className={labelClasses}
              initial={hasValue ? { top: 6, fontSize: 12 } : { top: 38, fontSize: 14 }}
              animate={isFocused || hasValue ? { top: 6, fontSize: 12, color: 'rgb(59 130 246)' } : { top: 38, fontSize: 14, color: 'rgb(156 163 175)' }}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.label>
          )}
          <textarea
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 resize-y min-h-[100px]',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
              'disabled:bg-gray-50 disabled:cursor-not-allowed',
              error ? 'border-danger focus:ring-danger' : 'border-gray-300',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id={`${inputId}-error`}
              className="mt-1.5 text-sm text-danger"
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onAnimationStart' | 'onAnimationEnd'> {
  label?: string
  error?: string
  helperText?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    useEffect(() => {
      setHasValue(!!props.value || (props.defaultValue ? String(props.defaultValue).length > 0 : false))
    }, [props.value, props.defaultValue])

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    const labelClasses = cn(
      'absolute left-3 text-gray-400 pointer-events-none transition-all duration-200 ease-out',
      isFocused || hasValue
        ? 'top-2 text-xs text-primary'
        : 'top-[38px] text-sm'
    )

    return (
      <div className="w-full">
        <div className="relative">
          {label && (
            <motion.label
              htmlFor={selectId}
              className={labelClasses}
              initial={hasValue ? { top: 6, fontSize: 12 } : { top: 38, fontSize: 14 }}
              animate={isFocused || hasValue ? { top: 6, fontSize: 12, color: 'rgb(59 130 246)' } : { top: 38, fontSize: 14, color: 'rgb(156 163 175)' }}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.label>
          )}
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-white text-gray-900 appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
              'disabled:bg-gray-50 disabled:cursor-not-allowed',
              error ? 'border-danger focus:ring-danger' : 'border-gray-300',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id={`${selectId}-error`}
              className="mt-1.5 text-sm text-danger"
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'