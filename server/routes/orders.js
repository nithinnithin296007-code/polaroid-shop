const router = require('express').Router();
const Order  = require('../models/Order');
const { sendStatusEmail } = require('../utils/mailer');

router.post('/', async (req, res) => {
  try {
    const { items, ...rest } = req.body;

    // Strip out _id and any extra fields — only keep what the schema needs
    const cleanItems = items.map(({ name, price, qty, image, category }) => ({
      name, price, qty, image, category,
    }));

    const order = await Order.create({ ...rest, items: cleanItems });
    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (order.shippingAddress?.email) {
      await sendStatusEmail(
        order.shippingAddress.email,
        order.shippingAddress.name,
        req.body.status,
        order.items,
      );
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;