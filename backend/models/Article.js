const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be greater than 0'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Cake', 'Bread', 'Pastry', 'Viennoiserie'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Article', articleSchema); 