const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items:           [{ name: String, price: Number, qty: Number, image: String, category: String }],
  shippingAddress: {
    name: String, email: String, phone: String,
    address: String, city: String, state: String, pincode: String,
  },
  totalPrice:      { type: Number, required: true },
  paid:            { type: Boolean, default: false },
  status:          { type: String, enum: ['pending','confirmed','preparing','shipped','delivered','cancelled'], default: 'pending' },
  paymentStatus:   { type: String, enum: ['unpaid','paid','refunded'], default: 'unpaid' },
  paymentProvider: { type: String, default: 'none' },   // 'Razorpay' | 'Stripe' | 'COD/UPI'
  paymentPayload:  { type: mongoose.Schema.Types.Mixed }, // raw provider payload for audit
  paymentId:       { type: String },
  trackingId:      { type: String },
  notes:           { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);