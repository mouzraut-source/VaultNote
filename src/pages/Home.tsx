import { Link } from 'react-router-dom'
import { BookOpen, Shield, Users, ArrowRight, Sparkles } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/products'
import { Button } from '@/components/Button'
import { Card, CardContent } from '@/components/Card'

export function Home() {
  const { data: products, isLoading, error } = useProducts()

  const features = [
    {
      icon: BookOpen,
      title: 'Academic Materials',
      description: 'Browse and purchase question-bank answer keys for your courses.',
    },
    {
      icon: Shield,
      title: 'Secure Access',
      description: 'Purchase-restricted PDF viewing with manual payment verification.',
    },
    {
      icon: Users,
      title: 'Student Dashboard',
      description: 'Track your purchases, payment status, and access materials anytime.',
    },
  ]

  return (
    <div className="w-full">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-white to-white py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>VaultNote V0 - Academic Content Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Distribute Academic Content <span className="text-primary">Securely</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              A lightweight platform for students to purchase and access question-bank answer keys online.
              Manual payment verification ensures secure, controlled distribution.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Why Choose VaultNote?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Built for simplicity, security, and ease of use.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} variant="outlined" padding="lg" className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Available Materials</h2>
              <p className="mt-2 text-gray-600">Browse our collection of academic answer keys</p>
            </div>
            <Link to="/products" className="hidden sm:block">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} variant="outlined" padding="none" className="animate-pulse">
                  <div className="h-32 bg-gray-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                  <div className="p-6 pt-0">
                    <div className="h-10 bg-gray-200 rounded w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Failed to load products. Please try again later.</p>
            </div>
          ) : (
            <ProductGrid 
              products={products || []} 
              showPurchaseButton={false}
              emptyMessage="No academic materials available at the moment."
            />
          )}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
            Create your account today and access premium academic materials.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Create Free Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}