const mongoose = require('mongoose')

const ingredientSchema = new mongoose.Schema({
  amount: String,
  item: String,
}, { _id: false })

const stepSchema = new mongoose.Schema({
  step: Number,
  title: String,
  desc: String,
}, { _id: false })

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Indonesian', 'Western', 'Chinese', 'Dessert', 'Minuman'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Mudah', 'Sedang', 'Sulit'],
  },
  time: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    default: 2,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  img: {
    type: String,
    required: true,
  },
  heroImg: {
    type: String,
    default: '',
  },
  ingredients: [ingredientSchema],
  spices: [ingredientSchema],
  steps: [stepSchema],
  tips: {
    type: String,
    default: '',
  },
}, { timestamps: true })

module.exports = mongoose.model('Recipe', recipeSchema)