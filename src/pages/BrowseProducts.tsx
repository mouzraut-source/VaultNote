import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Button } from '@/components/Button'
import { Link } from 'react-router-dom'
import { BookOpen, Filter, Grid3X3, List, Search } from 'lucide-react'
import { useState } from 'react'

export function BrowseProducts() {
  const { data: products, isLoading } = useProducts()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const activeProducts = products?.filter(p => p.is_active) || []
  const filteredProducts = searchQuery
    ? activeProducts.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subject && p.subject.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : activeProducts

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Academic Materials</h1>
          <p className="mt-2 text-gray-600">
            Find and purchase the learning materials you need
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or subject..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 12].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-white border border-gray-200 rounded-lg h-64 mb-4">
                  <div className="h-12 bg-gray-200 rounded-t-lg mb-2" />
                  <div className="h-32 bg-gray-200 mb-3" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No materials found' : 'No materials available'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Check back later for new academic materials'}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}
          >
            {filteredProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/products/${product.id}`}
                className="block"
              >
                <ProductCard
                  product={product}
                  showPurchaseButton={false}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}