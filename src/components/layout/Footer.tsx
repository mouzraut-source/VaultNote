import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">VaultNote</h3>
            <p className="mt-2 text-sm text-gray-500">
              A lightweight academic content distribution platform for students.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Links</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link to="/" className="text-gray-500 hover:text-gray-900">Home</Link></li>
              <li><Link to="/login" className="text-gray-500 hover:text-gray-900">Login</Link></li>
              <li><Link to="/register" className="text-gray-500 hover:text-gray-900">Register</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link to="/privacy" className="text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-gray-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} VaultNote. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}