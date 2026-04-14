/**
 * PaymentFactory
 * ──────────────
 * Reads PAYMENT_PROVIDER from environment and returns the correct adapter.
 *
 * Supported values for PAYMENT_PROVIDER:
 *   razorpay  → RazorpayAdapter  (requires RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET)
 *   stripe    → StripeAdapter    (requires STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY)
 *   cod       → CODAdapter       (requires COD_WHATSAPP_NUMBER + COD_UPI_ID, optional)
 *
 * Default: 'cod' (safe fallback, no credentials needed)
 */

const RazorpayAdapter = require('./RazorpayAdapter');
const StripeAdapter   = require('./StripeAdapter');
const CODAdapter      = require('./CODAdapter');

const ADAPTERS = {
  razorpay: RazorpayAdapter,
  stripe   : StripeAdapter,
  cod      : CODAdapter,
};

let _instance = null; // singleton — adapter is created once per process

function getPaymentAdapter() {
  if (_instance) return _instance;

  const provider = (process.env.PAYMENT_PROVIDER || 'cod').toLowerCase().trim();

  const AdapterClass = ADAPTERS[provider];
  if (!AdapterClass) {
    throw new Error(
      `Unknown PAYMENT_PROVIDER="${provider}". ` +
      `Valid options: ${Object.keys(ADAPTERS).join(', ')}`
    );
  }

  console.log(`💳 Payment adapter loaded: ${provider.toUpperCase()}`);
  _instance = new AdapterClass();
  return _instance;
}

module.exports = { getPaymentAdapter };
