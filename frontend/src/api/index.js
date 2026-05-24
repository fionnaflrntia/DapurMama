import axios from 'axios'

const api = axios.create({
    baseURL: 'https://dapur-mama-backend.vercel.app/api',
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dapur_mama_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dapur_mama_token')
      localStorage.removeItem('dapur_mama_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api