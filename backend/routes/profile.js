const express = require('express')
const CookHistory = require('../models/CookHistory')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/history', protect, async (req, res) => {
  try {
    const history = await CookHistory.find({ user: req.user._id })
      .populate('recipe', 'title category time price img')
      .sort({ cookedAt: -1 })

    res.json({ success: true, count: history.length, history })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/history', protect, async (req, res) => {
  try {
    const { recipeId } = req.body

    const existing = await CookHistory.findOne({
      user: req.user._id,
      recipe: recipeId,
    })

    if (existing) {
      return res.status(400).json({ success: false, message: 'Resep ini sudah ada di riwayat.' })
    }

    const entry = await CookHistory.create({
      user: req.user._id,
      recipe: recipeId,
    })

    await entry.populate('recipe', 'title category time price img')

    res.status(201).json({ success: true, entry })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.delete('/history/:id', protect, async (req, res) => {
  try {
    await CookHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })
    res.json({ success: true, message: 'Berhasil dihapus dari riwayat.' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router