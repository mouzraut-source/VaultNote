import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { LayoutDashboard, BookOpen, CreditCard, Users, ShoppingBag, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/format'
import { Button } from '@/components/Button'
import { pageTransition, fadeInUp } from '@/components/ui/MotionComponents'

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: BookOpen },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/purchases', label: 'Purchases', icon: ShoppingBag },
]

export function AdminLayout() {
  const { profile, signOut, user, isAdmin, loading } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Admin sidebar"
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
          <Link to="/admin" className="flex items-center gap-2" aria-label="Admin Home">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="currentColor"/>
              <path d="M16 8V24M8 16H24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="text-xl font-bold text-gray-900">VaultNote Admin</span>
          </Link>
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Admin navigation">
          <AnimatePresence mode="popLayout">
            {adminNavItems.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </nav>

        <motion.div 
          className="p-4 border-t border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: adminNavItems.length * 0.05 + 0.1 }}
        >
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {profile?.full_name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{profile?.full_name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start mt-2" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      </aside>

      <div className="lg:pl-64 flex-1">
        <div className="lg:hidden p-4 border-b border-gray-200 bg-white">
          <button
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={pageTransition}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}