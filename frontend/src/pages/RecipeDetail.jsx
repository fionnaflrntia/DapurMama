import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const difficultyColor = {
  'Mudah': 'bg-green-100 text-green-700',
  'Sedang': 'bg-yellow-100 text-yellow-700',
  'Susah': 'bg-red-100 text-red-700',
}

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkedIngredients, setCheckedIngredients] = useState([])
  const [activeTab, setActiveTab] = useState('detail')
  const [cooked, setCooked] = useState(false)
  const [cookedLoading, setCookedLoading] = useState(false)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/recipes/${id}`)
        setRecipe(res.data.recipe)
      } catch (err) {
        console.error('Gagal fetch resep:', err)
        setRecipe(null)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipe()
  }, [id])

  const handleMarkCooked = async () => {
    if (cookedLoading || cooked) return
    setCookedLoading(true)
    try {
      await api.post('/profile/history', { recipeId: id })
      setCooked(true)
    } catch (err) {
      if (err.response?.data?.message?.includes('sudah ada')) {
        setCooked(true)
      }
    } finally {
      setCookedLoading(false)
    }
  }

  const toggleIngredient = (idx) => {
    setCheckedIngredients(prev =>
        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🍳</div>
            <p className="text-gray-500 font-medium">Memuat resep...</p>
          </div>
        </div>
    )
  }

  if (!recipe) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <span className="text-6xl">😅</span>
          <h2 className="text-xl font-bold text-gray-800">Resep tidak ditemukan</h2>
          <Link to="/recipes" className="rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary-dark">
            Kembali ke Resep
          </Link>
        </div>
    )
  }

  const allIngredients = [...(recipe.ingredients || []), ...(recipe.spices || [])]
  const progress = allIngredients.length > 0
      ? Math.round((checkedIngredients.length / allIngredients.length) * 100)
      : 0

  const tabs = [
    { key: 'detail', label: '📋 Detail Resep' },
    { key: 'ingredients', label: '🛒 Bahan-bahan' },
    { key: 'steps', label: '👩‍🍳 Cara Memasak' },
  ]

  return (
      <div className="min-h-screen bg-gray-50 pb-20">

        <div className="relative h-72 overflow-hidden bg-gray-900 md:h-96">
          <img
              src={recipe.heroImg || recipe.img}
              alt={recipe.title}
              className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <button
              onClick={() => navigate(-1)}
              className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/30 transition"
          >
            ← Kembali
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
              {recipe.category}
            </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${difficultyColor[recipe.difficulty] || 'bg-gray-100 text-gray-700'}`}>
              {recipe.difficulty}
            </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl drop-shadow">
              {recipe.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/90">
              <span>⭐ {recipe.rating} ({recipe.reviews} ulasan)</span>
              <span>⏱️ {recipe.time} menit</span>
              <span>🍽️ {recipe.servings} porsi</span>
              <span>💰 Rp {recipe.price?.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-6">

          <div className="mb-6 grid grid-cols-3 gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            {[
              { icon: '⏱️', label: 'Waktu Memasak', value: `${recipe.time} menit` },
              { icon: '💰', label: 'Est. Harga Bahan', value: `Rp ${recipe.price?.toLocaleString('id-ID')}` },
              { icon: '🍽️', label: 'Porsi', value: `${recipe.servings} orang` },
            ].map(info => (
                <div key={info.label} className="flex flex-col items-center text-center">
                  <span className="text-2xl mb-1">{info.icon}</span>
                  <span className="text-xs text-gray-500">{info.label}</span>
                  <span className="font-bold text-gray-900">{info.value}</span>
                </div>
            ))}
          </div>

          <div className="mb-6 flex gap-2 rounded-2xl bg-white p-1.5 shadow-sm border border-gray-100">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                        activeTab === tab.key
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                  {tab.label}
                </button>
            ))}
          </div>

          {activeTab === 'detail' && (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">

                  <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <h2 className="mb-3 text-lg font-bold text-gray-900">Tentang Resep Ini</h2>
                    <p className="text-gray-600 leading-relaxed">{recipe.description}</p>
                  </div>

                  <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <h2 className="mb-3 text-lg font-bold text-gray-900">🎬 Video Tutorial</h2>
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg cursor-pointer hover:scale-105 transition">
                        <span className="text-2xl ml-1 text-white">▶</span>
                      </div>
                      <p className="text-gray-400 text-sm">Video tutorial akan segera tersedia</p>
                    </div>
                  </div>

                  {recipe.tips && (
                      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
                        <h3 className="mb-2 font-bold text-orange-800">💡 Tips dari Chef</h3>
                        <p className="text-sm text-orange-700 leading-relaxed">{recipe.tips}</p>
                      </div>
                  )}
                </div>

                <div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                    <h3 className="mb-3 font-bold text-gray-900">🛒 Bahan Utama</h3>
                    <ul className="space-y-2">
                      {recipe.ingredients?.slice(0, 5).map((ing, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            <span>
                        <span className="font-semibold text-gray-800">{ing.amount}</span> {ing.item}
                      </span>
                          </li>
                      ))}
                      {(recipe.ingredients?.length || 0) > 5 && (
                          <li
                              className="text-sm text-primary font-semibold cursor-pointer hover:underline"
                              onClick={() => setActiveTab('ingredients')}
                          >
                            +{recipe.ingredients.length - 5} bahan lainnya →
                          </li>
                      )}
                    </ul>

                    <button
                        onClick={handleMarkCooked}
                        disabled={cooked || cookedLoading}
                        className={`mt-5 w-full rounded-xl py-3 text-sm font-bold transition-all ${
                            cooked
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                    >
                      {cookedLoading ? 'Menyimpan...' : cooked ? '✅ Sudah Dimasak!' : '👩‍🍳 Tandai Sudah Dimasak'}
                    </button>
                  </div>
                </div>
              </div>
          )}

          {activeTab === 'ingredients' && (
              <div className="grid gap-6 md:grid-cols-2">

                <div className="md:col-span-2">
                  <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-gray-900">Daftar Belanja</h2>
                      <span className="text-sm font-semibold text-primary">
                    {checkedIngredients.length}/{allIngredients.length} disiapkan
                  </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                          className="h-2 rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                  <h3 className="mb-4 font-bold text-gray-900">Bahan Utama</h3>
                  <ul className="space-y-3">
                    {recipe.ingredients?.map((ing, i) => (
                        <li
                            key={i}
                            onClick={() => toggleIngredient(i)}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-all ${
                                checkedIngredients.includes(i) ? 'bg-green-50' : 'hover:bg-gray-50'
                            }`}
                        >
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                              checkedIngredients.includes(i)
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300'
                          }`}>
                            {checkedIngredients.includes(i) && (
                                <span className="text-white text-xs font-bold">✓</span>
                            )}
                          </div>
                          <span className={`text-sm transition-all ${
                              checkedIngredients.includes(i) ? 'line-through text-gray-400' : 'text-gray-700'
                          }`}>
                      <span className="font-semibold">{ing.amount}</span> {ing.item}
                    </span>
                        </li>
                    ))}
                  </ul>
                </div>

                {recipe.spices && recipe.spices.length > 0 && (
                    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                      <h3 className="mb-4 font-bold text-gray-900">Bumbu Halus</h3>
                      <ul className="space-y-3">
                        {recipe.spices.map((spice, i) => {
                          const idx = (recipe.ingredients?.length || 0) + i
                          return (
                              <li
                                  key={i}
                                  onClick={() => toggleIngredient(idx)}
                                  className={`flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-all ${
                                      checkedIngredients.includes(idx) ? 'bg-green-50' : 'hover:bg-gray-50'
                                  }`}
                              >
                                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                    checkedIngredients.includes(idx)
                                        ? 'border-green-500 bg-green-500'
                                        : 'border-gray-300'
                                }`}>
                                  {checkedIngredients.includes(idx) && (
                                      <span className="text-white text-xs font-bold">✓</span>
                                  )}
                                </div>
                                <span className={`text-sm transition-all ${
                                    checkedIngredients.includes(idx) ? 'line-through text-gray-400' : 'text-gray-700'
                                }`}>
                          <span className="font-semibold">{spice.amount}</span> {spice.item}
                        </span>
                              </li>
                          )
                        })}
                      </ul>
                    </div>
                )}
              </div>
          )}

          {activeTab === 'steps' && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4">
                  <p className="text-sm text-orange-700 font-medium">
                    💡 Estimasi waktu total: <strong>{recipe.time} menit</strong> untuk {recipe.servings} porsi
                  </p>
                </div>

                {recipe.steps?.map((step) => (
                    <div
                        key={step.step}
                        className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all hover:border-orange-200"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                ))}

                <div className="rounded-2xl p-6 text-center text-white" style={{background: 'linear-gradient(to right, #E8390E, #c42d08)'}}>
                  <p className="text-lg font-bold mb-1">🎉 Selamat! Resep selesai</p>
                  <p className="text-sm text-white/80 mb-4">
                    Tandai resep ini sebagai sudah dimasak untuk menyimpannya ke riwayatmu
                  </p>
                  <button
                      onClick={handleMarkCooked}
                      disabled={cooked || cookedLoading}
                      className={`rounded-xl px-8 py-3 font-bold transition-all ${
                          cooked
                              ? 'bg-white/30 cursor-not-allowed text-white'
                              : 'bg-white text-primary hover:bg-orange-50'
                      }`}
                  >
                    {cookedLoading ? 'Menyimpan...' : cooked ? '✅ Sudah Dimasak!' : '👩‍🍳 Tandai Sudah Dimasak'}
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  )
}