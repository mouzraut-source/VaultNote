import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/Card'
import { formatCurrency } from '@/utils/format'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onPurchaseClick?: (product: Product) => void
  showPurchaseButton?: boolean
}

export function ProductCard({ product, onPurchaseClick, showPurchaseButton = true }: ProductCardProps) {
  return (
    <Card variant="outlined" padding="none" className="flex flex-col h-full transition-shadow hover:shadow-md">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{product.title}</h3>
            {product.subject && (
              <p className="mt-1 text-sm text-gray-500">{product.subject}</p>
            )}
          </div>
          <span className="flex-shrink-0 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {formatCurrency(product.price)}
          </span>
        </div>
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">{product.description}</p>
        )}
      </div>
      <CardFooter className="px-6 pb-6">
        {showPurchaseButton ? (
          <button
            onClick={() => onPurchaseClick?.(product)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            View Details
          </button>
        ) : (
          <Link
            to={`/products/${product.id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}