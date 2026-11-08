import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { pageTransition } from '@/components/ui/MotionComponents'
import { Outlet, useLocation } from 'react-router-dom'

export function PageLayout() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
        className="flex min-h-screen flex-col"
      >
        <Header />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  )
}