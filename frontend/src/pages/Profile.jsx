import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('history')
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/profile/history')
        setHistory(res.data.history)
      } catch (err) {
        console.error('Gagal fetch history:', err)
      } finally {
        setLoadingHistory(false)
      }
    }
    fetchHistory()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const tabs = [
    { key: 'history', label: '📖 Riwayat Masak', count: history.length },
    { key: 'favorites', label: '❤️ Favorit', count: 0 },
    { key: 'settings', label: '⚙️ Pengaturan', count: null },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-3xl font-extrabold text-white shadow-md">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-400 border-2 border-white" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-gray-900">{user?.name || 'Pengguna'}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
              <p className="mt-2 text-xs font-medium text-primary bg-orange-50 inline-block px-3 py-1 rounded-full">
                🍳 Member Dapur Mama
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Keluar
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { icon: '📖', value: history.length, label: 'Resep Dimasak' },
              { icon: '❤️', value: 0, label: 'Favorit' },
              { icon: '⭐', value: '4.8', label: 'Rating Rata-rata' },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl bg-gray-50 p-4 text-center border border-gray-100">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-extrabold text-primary">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 pt-6">
        <div className="mb-6 flex gap-1 rounded-2xl bg-white p-1.5 shadow-sm border border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === tab.key ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'history' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Riwayat Masakan</h2>
              <span className="text-sm text-gray-500">{history.length} resep</span>
            </div>

            {loadingHistory ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-4 animate-pulse">
                    <div className="h-16 w-16 rounded-xl bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <span className="text-6xl mb-4">🍽️</span>
                <h3 className="font-bold text-gray-700 text-lg">Belum ada riwayat masak</h3>
                <p className="text-gray-500 mt-1 mb-5 text-sm">Mulai memasak dan tandai resep yang sudah kamu buat!</p>
                <Link to="/recipes" className="rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary-dark transition">
                  Cari Resep Sekarang
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item, idx) => (
                  <Link
                    key={idx}
                    to={`/recipes/${item.recipe?._id}`}
                    className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-orange-100"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={item.recipe?.img}
                        alt={item.recipe?.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{item.recipe?.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="rounded-full bg-orange-50 text-primary px-2 py-0.5 font-semibold">{item.recipe?.category}</span>
                        <span>⏱️ {item.recipe?.time} menit</span>
                        <span>💰 Rp {item.recipe?.price?.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-gray-400">Dimasak pada</p>
                      <p className="text-xs font-semibold text-gray-600">{formatDate(item.cookedAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="text-6xl mb-4">❤️</span>
            <h3 className="font-bold text-gray-700 text-lg">Fitur Favorit</h3>
            <p className="text-gray-500 mt-1 text-sm max-w-xs">Fitur ini akan segera hadir!</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Pengaturan Akun</h2>
            </div>
            {[
              { icon: '👤', label: 'Nama', value: user?.name },
              { icon: '📧', label: 'Email', value: user?.email },
              { icon: '🔒', label: 'Password', value: '••••••••' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-5">
              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
              >
                🚪 Keluar dari Akun
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}