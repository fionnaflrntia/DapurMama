const mongoose = require('mongoose')

const cookHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  cookedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true })

cookHistorySchema.index({ user: 1, recipe: 1 }, { unique: true })

module.exports = mongoose.model('CookHistory', cookHistorySchema)