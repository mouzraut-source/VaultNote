import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { MainLayout } from '@/components/layout'
import { AdminLayout } from '@/components/layout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { BrowseProducts } from '@/pages/BrowseProducts'
import { ProductPage } from '@/pages/Product'
import { Dashboard } from '@/pages/Dashboard'
import { Reader } from '@/pages/Reader'
import { AdminDashboard } from '@/pages/Admin'
import { AdminProducts } from '@/pages/AdminProducts'
import { AdminPayments } from '@/pages/AdminPayments'
import { AdminStudents } from '@/pages/AdminStudents'
import { AdminPurchases } from '@/pages/AdminPurchases'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { TermsOfService } from '@/pages/TermsOfService'

function AuthRedirect() {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Home />
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<BrowseProducts />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reader/:id" element={<Reader />} />
        </Route>
      </Route>

      <Route element={<AdminLayout />}>
        <Route element={<ProtectedRoute allowedRoles={['admin']} redirectTo="/dashboard" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/purchases" element={<AdminPurchases />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}