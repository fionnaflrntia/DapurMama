export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <span className="text-6xl">🍳</span>
        <h1 className="mt-4 text-4xl font-extrabold text-gray-900">Tentang Dapur Mama</h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Dapur Mama adalah platform resep masakan yang dirancang untuk memberdayakan 
          perempuan Indonesia dalam dunia memasak — baik untuk keluarga tercinta 
          maupun untuk peluang usaha kuliner.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { icon: '📚', title: '500+ Resep', desc: 'Koleksi resep lengkap dari berbagai kategori masakan' },
            { icon: '👩‍🍳', title: 'Untuk Semua', desc: 'Dari pemula hingga yang sudah berpengalaman memasak' },
            { icon: '💼', title: 'Ide Jualan', desc: 'Resep dilengkapi estimasi harga untuk ide bisnis kuliner' },
          ].map(item => (
            <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 text-center">
              <span className="text-4xl">{item.icon}</span>
              <h3 className="mt-3 font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl p-8 text-white" style={{background: 'linear-gradient(to right, #E8390E, #c42d08)'}}>
          <h2 className="text-2xl font-extrabold">Dibuat dengan ❤️ untuk seluruh Ibu Indonesia</h2>
          <p className="mt-2 text-white/80">© 2025 Dapur Mama - Platform Resep Masakan Indonesia</p>
        </div>
      </div>
    </div>
  )
}