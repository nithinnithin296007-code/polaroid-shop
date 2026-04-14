const PaymentAdapter = require('./PaymentAdapter');

/**
 * COD / UPI-via-WhatsApp Adapter
 * No real payment processing — just marks order as pending
 * and returns a WhatsApp redirect URL so the buyer can pay
 * manually via UPI (GPay, PhonePe, Paytm, etc.)
 */
class CODAdapter extends PaymentAdapter {
  constructor() {
    super();
    // Optional: seller's WhatsApp number and UPI ID from env
    this._whatsappNumber = process.env.COD_WHATSAPP_NUMBER || '';
    this._upiId          = process.env.COD_UPI_ID          || '';
  }

  get name() { return 'COD/UPI'; }

  /**
   * No real order created on a third-party platform.
   * Returns the WhatsApp deep-link so client can redirect.
   * @param {number} amount  Amount in rupees (NOT paise — COD is manual)
   * @param {string} currency  unused
   * @param {string} receipt  Order ID / receipt string
   */
  async createOrder(amount, currency = 'INR', receipt) {
    const message = encodeURIComponent(
      `Hi! 👋 I just placed an order.\n\n` +
      `Order ID: ${receipt}\n` +
      `Order Total: ₹${amount}\n` +
      `Please share your UPI ID to complete payment! 🙏`
    );

    return {
      provider      : 'cod',
      whatsappUrl   : this._whatsappNumber
        ? `https://wa.me/${this._whatsappNumber}?text=${message}`
        : null,
      upiId         : this._upiId || null,
      amount,
      receipt,
    };
  }

  /**
   * COD/UPI payments are verified manually by admin.
   * Always returns true here — admin controls order status.
   */
  async verifyPayment(_payload) {
    return true; // manual verification via admin panel
  }
}

module.exports = CODAdapter;
