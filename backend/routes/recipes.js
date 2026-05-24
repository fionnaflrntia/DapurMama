const express = require('express')
const Recipe = require('../models/Recipe')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const { category, difficulty, search, sort, maxTime, maxPrice } = req.query

    let filter = {}

    if (category && category !== 'Semua') filter.category = category
    if (difficulty) filter.difficulty = { $in: difficulty.split(',') }
    if (maxTime) filter.time = { $lte: Number(maxTime) }
    if (maxPrice) filter.price = { $lte: Number(maxPrice) }
    if (search) filter.title = { $regex: search, $options: 'i' }

    let sortOption = { rating: -1 }
    if (sort === 'time') sortOption = { time: 1 }
    if (sort === 'price') sortOption = { price: 1 }

    const recipes = await Recipe.find(filter).sort(sortOption)

    res.json({ success: true, count: recipes.length, recipes })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Resep tidak ditemukan.' })
    }
    res.json({ success: true, recipe })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body)
    res.status(201).json({ success: true, recipe })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

module.exports = router