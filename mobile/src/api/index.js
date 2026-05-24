import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const api = axios.create({
    baseURL: 'http://192.168.1.12:5000/api',
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('dapur_mama_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default api