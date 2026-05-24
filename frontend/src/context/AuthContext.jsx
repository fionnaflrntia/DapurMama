import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('dapur_mama_user')
    const token = localStorage.getItem('dapur_mama_token')
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('dapur_mama_user', JSON.stringify(userData))
    localStorage.setItem('dapur_mama_token', token)

    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('dapur_mama_user')
    localStorage.removeItem('dapur_mama_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}