const Razorpay = require('razorpay');
const crypto  = require('crypto');
const PaymentAdapter = require('./PaymentAdapter');

class RazorpayAdapter extends PaymentAdapter {
  constructor() {
    super();
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env');
    }
    this._client = new Razorpay({
      key_id    : process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  get name() { return 'Razorpay'; }

  /**
   * Creates a Razorpay order.
   * @param {number} amount   Amount in paise (multiply ₹ by 100)
   * @param {string} currency e.g. 'INR'
   * @param {string} receipt  Unique order receipt string
   */
  async createOrder(amount, currency = 'INR', receipt) {
    const order = await this._client.orders.create({
      amount,        // in paise
      currency,
      receipt,
      payment_capture: 1,
    });
    return {
      provider      : 'razorpay',
      orderId       : order.id,
      amount        : order.amount,
      currency      : order.currency,
      keyId         : process.env.RAZORPAY_KEY_ID, // safe to expose to client
    };
  }

  /**
   * Verifies the Razorpay payment signature.
   * @param {object} payload { razorpay_order_id, razorpay_payment_id, razorpay_signature }
   */
  async verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    return expectedSignature === razorpay_signature;
  }
}

module.exports = RazorpayAdapter;
