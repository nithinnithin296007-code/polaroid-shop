const router = require('express').Router();
const Order  = require('../models/Order');
const { getPaymentAdapter } = require('../services/payment/PaymentFactory');

// ── POST /api/payment/create-order ──────────────────────────────────────────
// Called by client before showing payment UI.
// Creates a payment order on the provider's platform.
router.post('/create-order', async (req, res) => {
  try {
    const { orderId, amount, currency } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'orderId and amount are required' });
    }

    const adapter = getPaymentAdapter();

    // Razorpay/Stripe expect smallest unit (paise/cents).
    // COD receives ₹ directly (no conversion needed).
    const unitAmount = adapter.name === 'COD/UPI'
      ? amount
      : Math.round(amount * 100);

    const order = await adapter.createOrder(unitAmount, currency || 'INR', `receipt_${orderId}`);

    res.json({ success: true, provider: adapter.name, ...order });
  } catch (err) {
    console.error('❌ Payment create-order error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/payment/verify ─────────────────────────────────────────────────
// Called by client after payment is completed on the UI side.
// Verifies authenticity and marks the DB order as paid.
router.post('/verify', async (req, res) => {
  try {
    const { orderId, ...payload } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const adapter  = getPaymentAdapter();
    const verified = await adapter.verifyPayment(payload);

    if (!verified) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Mark the order as paid in DB
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paid           : true,
        paymentProvider: adapter.name,
        paymentPayload : payload,
        status         : 'confirmed',
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('❌ Payment verify error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/payment/provider ─────────────────────────────────────────────────
// Returns which payment provider is active (so the client can render the right UI).
router.get('/provider', (_req, res) => {
  try {
    const adapter = getPaymentAdapter();
    res.json({ provider: process.env.PAYMENT_PROVIDER || 'cod', name: adapter.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
