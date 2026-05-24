import { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('dapur_mama_token')
                const savedUser = await AsyncStorage.getItem('dapur_mama_user')
                if (token && savedUser) {
                    setUser(JSON.parse(savedUser))
                    try {
                        const res = await api.get('/auth/me')
                        setUser(res.data.user)
                        await AsyncStorage.setItem('dapur_mama_user', JSON.stringify(res.data.user))
                    } catch {
                        await AsyncStorage.removeItem('dapur_mama_token')
                        await AsyncStorage.removeItem('dapur_mama_user')
                        setUser(null)
                    }
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        initAuth()
    }, [])

    const login = async (userData, token) => {
        setUser(userData)
        await AsyncStorage.setItem('dapur_mama_user', JSON.stringify(userData))
        await AsyncStorage.setItem('dapur_mama_token', token)
    }

    const logout = async () => {
        setUser(null)
        await AsyncStorage.removeItem('dapur_mama_user')
        await AsyncStorage.removeItem('dapur_mama_token')
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