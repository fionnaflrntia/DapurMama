import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/recipes', label: 'Resep' },
    { path: '/about', label: 'Tentang Kami' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900 no-underline">
          Dapur<span className="text-primary">Mama</span>
        </Link>

        <div className="flex flex-1 justify-center gap-2">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-orange-50 text-primary' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
                {/* Garis bawah tipis jika menu sedang aktif */}
                {isActive && (
                  <span className="absolute -bottom-[6px] left-1/2 h-[2px] w-3/5 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/profile" 
            title={user?.name}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white no-underline transition-transform hover:scale-105"
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Link>
          <span className="text-sm font-medium text-gray-600 hidden md:block">
            {user?.name}
          </span>
          <button 
            onClick={handleLogout} 
            className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
          >
            Keluar
          </button>
        </div>
        
      </div>
    </nav>
  )
}