import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const CATEGORIES = ['Semua', 'Indonesian', 'Western', 'Chinese', 'Dessert', 'Minuman']
const DIFFICULTIES = ['Mudah', 'Sedang', 'Susah']

const difficultyColor = {
  'Mudah': 'bg-green-100 text-green-700',
  'Sedang': 'bg-yellow-100 text-yellow-700',
  'Susah': 'bg-red-100 text-red-700',
}

export default function Recipes() {
  const [allRecipes, setAllRecipes] = useState([])
  const [loadingRecipes, setLoadingRecipes] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [selectedDifficulties, setSelectedDifficulties] = useState([])
  const [maxTime, setMaxTime] = useState(180)
  const [maxPrice, setMaxPrice] = useState(100000)
  const [sortBy, setSortBy] = useState('rating')
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoadingRecipes(true)
        const res = await api.get('/recipes')
        setAllRecipes(res.data.recipes)
      } catch (err) {
        console.error('Gagal fetch resep:', err)
      } finally {
        setLoadingRecipes(false)
      }
    }
    fetchRecipes()
  }, [])

  const toggleDifficulty = (d) => {
    setSelectedDifficulties(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    )
  }

  const filtered = allRecipes
    .filter(r => activeCategory === 'Semua' || r.category === activeCategory)
    .filter(r => search === '' || r.title.toLowerCase().includes(search.toLowerCase()))
    .filter(r => selectedDifficulties.length === 0 || selectedDifficulties.includes(r.difficulty))
    .filter(r => r.time <= maxTime)
    .filter(r => r.price <= maxPrice)
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : sortBy === 'time' ? a.time - b.time : a.price - b.price)

  if (loadingRecipes) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🍳</div>
          <p className="text-gray-500 font-medium">Memuat resep...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Eksplorasi Resep</h1>
          <p className="mt-1 text-gray-500">Temukan inspirasi masakan favoritmu</p>

          <div className="mt-5 flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari resep atau bahan makanan..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-primary"
            >
              <option value="rating">Rating Tertinggi</option>
              <option value="time">Waktu Tercepat</option>
              <option value="price">Harga Termurah</option>
            </select>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${showFilter ? 'border-primary bg-orange-50 text-primary' : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary'}`}
            >
              ⚙️ Filter
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-6">
        <div className="flex gap-6">
          {showFilter && (
            <aside className="w-64 shrink-0">
              <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Filter</h3>
                  <button
                    onClick={() => { setSelectedDifficulties([]); setMaxTime(180); setMaxPrice(100000) }}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Reset
                  </button>
                </div>

                <div className="mb-5">
                  <p className="mb-2 text-sm font-semibold text-gray-700">Tingkat Kesulitan</p>
                  <div className="flex flex-col gap-2">
                    {DIFFICULTIES.map(d => (
                      <label key={d} className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={selectedDifficulties.includes(d)}
                          onChange={() => toggleDifficulty(d)}
                          className="h-4 w-4 rounded accent-primary"
                        />
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyColor[d]}`}>{d}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Waktu Memasak: <span className="text-primary">{maxTime} menit</span>
                  </p>
                  <input type="range" min={10} max={180} step={10} value={maxTime}
                    onChange={e => setMaxTime(Number(e.target.value))} className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10 min</span><span>180 min</span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Maks. Harga: <span className="text-primary">Rp {maxPrice.toLocaleString('id-ID')}</span>
                  </p>
                  <input type="range" min={5000} max={100000} step={5000} value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Rp 5K</span><span>Rp 100K</span>
                  </div>
                </div>
              </div>
            </aside>
          )}

          <div className="flex-1">
            <p className="mb-4 text-sm text-gray-500">
              <span className="font-bold text-gray-800">{filtered.length}</span> resep ditemukan
            </p>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-6xl mb-4">🍽️</span>
                <h3 className="text-lg font-bold text-gray-700">Resep tidak ditemukan</h3>
                <p className="text-gray-500 mt-1">Coba ubah filter atau kata kunci pencarianmu</p>
              </div>
            ) : (
              <div className={`grid gap-5 ${showFilter ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {filtered.map(recipe => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipes/${recipe._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-orange-100"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={recipe.img}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-gray-800 backdrop-blur-sm shadow-sm">
          ⭐ {recipe.rating}
          <span className="text-gray-400 font-normal">({recipe.reviews})</span>
        </div>
        <div className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${difficultyColor[recipe.difficulty] || 'bg-gray-100 text-gray-700'}`}>
          {recipe.difficulty}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-xs font-semibold text-primary">{recipe.category}</span>
        <h3 className="mb-3 font-bold text-gray-900 line-clamp-2 leading-snug">{recipe.title}</h3>
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <span>⏱️ {recipe.time} menit</span>
          <span>💰 Rp {recipe.price.toLocaleString('id-ID')}</span>
        </div>
        <button className="mt-3 w-full rounded-xl bg-orange-50 py-2.5 text-sm font-bold text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white">
          Lihat Resep →
        </button>
      </div>
    </Link>
  )
}