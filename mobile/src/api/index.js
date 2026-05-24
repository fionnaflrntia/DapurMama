import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const api = axios.create({
    baseURL: 'https://dapur-mama-backend.vercel.app/',
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('dapur_mama_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default api