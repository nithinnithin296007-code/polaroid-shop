const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  category: { type: String, enum: ['Polaroids','Posters','Frames','Stickers','Bundles'], required: true },
  image:       { type: String },
  badge:       { type: String },
  rating:      { type: Number, default: 4.8 },
  stock:       { type: Number, default: 100 },
  variants:    [{ name: String, price: Number }],
}, { timestamps: true });

// Add indexes for faster search
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);