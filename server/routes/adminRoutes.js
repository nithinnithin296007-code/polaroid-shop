const express = require('express');
const Order   = require('../models/Order');
const Product = require('../models/Product');
const User    = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', async (req, res) => {
  const [orders, products, users] = await Promise.all([
    Order.find(), Product.countDocuments(), User.countDocuments()
  ]);
  const revenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalPrice, 0);
  res.json({ totalOrders: orders.length, totalRevenue: revenue, totalProducts: products, totalUsers: users });
});

// All orders
router.get('/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
  res.json(orders);
});

// Update order status
router.put('/orders/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Add / Edit product
router.post('/products', async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put('/products/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json(product);
});

router.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
