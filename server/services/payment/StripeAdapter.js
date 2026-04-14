const Stripe = require('stripe');
const PaymentAdapter = require('./PaymentAdapter');

class StripeAdapter extends PaymentAdapter {
  constructor() {
    super();
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY must be set in .env');
    }
    this._stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  }

  get name() { return 'Stripe'; }

  /**
   * Creates a Stripe PaymentIntent.
   * @param {number} amount   Amount in smallest unit (paise for INR, cents for USD)
   * @param {string} currency e.g. 'inr', 'usd'
   * @param {string} receipt  Unique order reference (stored as metadata)
   */
  async createOrder(amount, currency = 'inr', receipt) {
    const intent = await this._stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { receipt },
    });

    return {
      provider     : 'stripe',
      clientSecret : intent.client_secret,  // sent to frontend to complete payment
      amount       : intent.amount,
      currency     : intent.currency,
      intentId     : intent.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    };
  }

  /**
   * Verifies a Stripe payment by checking its status server-side.
   * @param {object} payload { intentId }
   */
  async verifyPayment({ intentId }) {
    const intent = await this._stripe.paymentIntents.retrieve(intentId);
    return intent.status === 'succeeded';
  }
}

module.exports = StripeAdapter;
