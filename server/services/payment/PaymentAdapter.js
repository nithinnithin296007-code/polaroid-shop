/**
 * PaymentAdapter — Abstract base class
 * All payment providers must implement these methods.
 */
class PaymentAdapter {
  /**
   * Create a payment order/intent on the provider's side.
   * @param {number} amount  Amount in the smallest currency unit (paise for INR, cents for USD)
   * @param {string} currency  e.g. 'INR', 'USD'
   * @param {string} receipt  Unique receipt / order reference
   * @returns {Promise<object>} Provider-specific order object
   */
  async createOrder(amount, currency, receipt) {
    throw new Error('createOrder() must be implemented by the payment adapter');
  }

  /**
   * Verify the payment after the client completes it.
   * @param {object} payload  Payment verification data from client
   * @returns {Promise<boolean>} true if payment is verified
   */
  async verifyPayment(payload) {
    throw new Error('verifyPayment() must be implemented by the payment adapter');
  }

  /**
   * Human-readable name of this provider (for logging / UI).
   */
  get name() {
    throw new Error('name getter must be implemented by the payment adapter');
  }
}

module.exports = PaymentAdapter;
