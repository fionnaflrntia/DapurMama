import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

const CATEGORIES = [
  { name: 'Indonesian', icon: '🍛', count: '120+ Resep' },
  { name: 'Western', icon: '🥩', count: '85+ Resep' },
  { name: 'Dessert', icon: '🍰', count: '60+ Resep' },
  { name: 'Minuman', icon: '🍹', count: '45+ Resep' },
  { name: 'Chinese', icon: '🥟', count: '90+ Resep' },
]

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await api.get('/recipes')
        setRecipes(res.data.recipes.slice(0, 3))
      } catch (err) {
        console.error('Gagal fetch resep:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <section className="relative flex h-[400px] items-center justify-center overflow-hidden bg-gray-900 px-6 text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1920&q=80"
            alt="Dapur"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
            Mau Masak Apa Hari Ini?
          </h1>
          <p className="mb-8 text-lg text-gray-200">
            Temukan resep terbaik untuk keluarga tercinta atau untuk ide jualan Anda.
          </p>
          <Link
            to="/recipes"
            className="inline-block rounded-full bg-primary px-8 py-3.5 text-base font-bold text-white transition-all hover:scale-105 hover:bg-primary-dark"
          >
            Cari Resep Sekarang
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Kategori Populer</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/recipes?category=${cat.name}`)}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-gray-100"
              >
                <span className="mb-3 text-4xl transition-transform group-hover:scale-110">{cat.icon}</span>
                <span className="font-bold text-gray-800">{cat.name}</span>
                <span className="text-xs text-gray-500 mt-1">{cat.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Rekomendasi Untukmu</h2>
              <p className="text-gray-500">Resep pilihan yang paling banyak disukai</p>
            </div>
            <Link to="/recipes" className="hidden font-bold text-primary hover:underline md:block">
              Lihat Semua
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-10 bg-gray-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map(recipe => (
                <Link
                  to={`/recipes/${recipe._id}`}
                  key={recipe._id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                    <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-800 backdrop-blur-sm">
                      ⭐ {recipe.rating}
                    </div>
                    <img
                      src={recipe.img}
                      alt={recipe.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-1">{recipe.title}</h3>
                    <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                      <span>⏱️ {recipe.time} menit</span>
                      <span>💰 Rp {recipe.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="mt-auto">
                      <button className="w-full rounded-xl bg-orange-50 py-3 text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        Lihat Resep
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link to="/recipes" className="mt-8 block text-center font-bold text-primary hover:underline md:hidden">
            Lihat Semua Resep
          </Link>
        </section>
      </div>
    </div>
  )
}