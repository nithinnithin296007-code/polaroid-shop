const router = require('express').Router();
const Order  = require('../models/Order');
const { sendStatusEmail } = require('../utils/mailer');

router.post('/', async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
});

router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});

router.put('/:id/status', async (req, res) => {
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
});

module.exports = router;