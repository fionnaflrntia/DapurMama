require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const authRoutes = require('./routes/auth')
const recipeRoutes = require('./routes/recipes')
const profileRoutes = require('./routes/profile')

const app = express()

connectDB()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://dapur-mama-web.vercel.app',
  ],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/recipes', recipeRoutes)
app.use('/api/profile', profileRoutes)

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Dapur Mama API is running!' })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' })
})

module.exports = app

if (require.main === module) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`)
  })
}