import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      })
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="flex min-h-screen font-sans">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[#E8390E] via-[#ff6b3d] to-[#FF8C42]">
          <div className="relative z-10 w-full p-12">
            <div className="mx-auto max-w-[400px]">
              <div className="mb-7 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                🍳 Dapur Mama
              </div>
              <h1 className="mb-4 text-5xl font-extrabold leading-tight text-white">
                Masak dengan<br />Penuh Cinta
              </h1>
              <p className="mb-10 text-lg leading-relaxed text-white/85">
                Temukan ratusan resep lezat, dari masakan rumahan hingga hidangan spesial untuk dijual.
              </p>

              <div className="flex items-center gap-6 rounded-2xl bg-white/15 px-6 py-4 backdrop-blur-md">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl font-extrabold text-white">500+</span>
                  <span className="text-xs text-white/80">Resep</span>
                </div>
                <div className="h-8 w-px bg-white/30" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl font-extrabold text-white">50K+</span>
                  <span className="text-xs text-white/80">Pengguna</span>
                </div>
                <div className="h-8 w-px bg-white/30" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl font-extrabold text-white">4.9★</span>
                  <span className="text-xs text-white/80">Rating</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="flex w-[480px] items-center justify-center bg-white p-10">
          <div className="w-full max-w-[380px]">
            <div className="mb-8">
              <Link to="/" className="mb-6 block text-xl font-bold text-gray-900 no-underline">
                Dapur<span className="text-primary">Mama</span>
              </Link>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">Selamat Datang! 👋</h2>
              <p className="text-sm text-gray-500">Masuk ke akun Anda untuk mulai memasak</p>
            </div>

            {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="contoh@email.com"
                    required
                    className="rounded-xl border-[1.5px] border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    required
                    className="rounded-xl border-[1.5px] border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 rounded-xl bg-primary p-3.5 text-base font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Belum punya akun?{' '}
              <Link to="/register" className="font-semibold text-primary no-underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
  )
}