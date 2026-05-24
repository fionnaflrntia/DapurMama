const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

const router = express.Router()

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' })
    }

    const user = await User.create({ name, email, password })
    const token = signToken(user._id)

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' })
    }

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' })
    }

    const token = signToken(user._id)

    res.json({
      success: true,
      message: 'Login berhasil!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  })
})

module.exports = router