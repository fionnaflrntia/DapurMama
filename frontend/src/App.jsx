import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import Profile from './pages/Profile'
import About from './pages/About'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',fontSize:'18px',color:'var(--primary)'}}>Loading...</div>
  }

  const hasToken = localStorage.getItem('dapur_mama_token')

  return (user || hasToken) ? children : <Navigate to="/login" replace />
}
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : children
}

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><AppLayout><Home /></AppLayout></PrivateRoute>} />
          <Route path="/recipes" element={<PrivateRoute><AppLayout><Recipes /></AppLayout></PrivateRoute>} />
          <Route path="/recipes/:id" element={<PrivateRoute><AppLayout><RecipeDetail /></AppLayout></PrivateRoute>} />
          <Route path="/about" element={<PrivateRoute><AppLayout><About /></AppLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App