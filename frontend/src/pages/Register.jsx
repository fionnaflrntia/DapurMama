import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) return setError('Password tidak cocok!')
    if (form.password.length < 6) return setError('Password minimal 6 karakter!')

    setLoading(true)

    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      })

      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mendaftar.')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="flex min-h-screen font-sans">
        <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-[#E8390E] via-[#ff6b3d] to-[#FF8C42] p-12">
          <div className="max-w-[400px]">
            <div className="mb-7 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              🍳 Dapur Mama
            </div>
            <h1 className="mb-4 text-5xl font-extrabold leading-tight text-white">
              Bergabunglah<br />Bersama Kami!
            </h1>
            <p className="mb-8 text-base leading-relaxed text-white/85">
              Mulai perjalanan memasak Anda. Daftar gratis dan akses ratusan resep lezat.
            </p>
            <div className="flex flex-col gap-2.5">
              {['✅ 500+ resep lengkap dengan video', '✅ Estimasi harga bahan masakan', '✅ Komunitas ibu-ibu memasak', '✅ Riwayat masakan tersimpan'].map(f => (
                  <p key={f} className="text-sm font-medium text-white/90">{f}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-[480px] items-center justify-center overflow-y-auto bg-white p-10">
          <div className="w-full max-w-[380px]">
            <Link to="/" className="mb-5 block text-xl font-bold text-gray-900 no-underline">
              Dapur<span className="text-primary">Mama</span>
            </Link>
            <h2 className="mb-1.5 text-3xl font-bold text-gray-900">Buat Akun Baru 🎉</h2>
            <p className="mb-7 text-sm text-gray-500">Gratis selamanya, mulai memasak hari ini!</p>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { name: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama Anda' },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'contoh@email.com' },
                { name: 'password', label: 'Password', type: 'password', placeholder: 'Minimal 6 karakter' },
                { name: 'confirm', label: 'Konfirmasi Password', type: 'password', placeholder: 'Ulangi password' },
              ].map(field => (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">{field.label}</label>
                    <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required
                        className="rounded-xl border-[1.5px] border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                  </div>
              ))}

              <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 rounded-xl bg-primary p-3.5 text-base font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Membuat akun...' : 'Daftar Sekarang'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-semibold text-primary no-underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
  )
}