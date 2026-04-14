import { useRef } from 'react';

const C = {
  pink: '#FF6B9D', yellow: '#FFE135', blue: '#4ECDC4',
  purple: '#A855F7', ink: '#1A1A2E', white: '#FFFFFF', cream: '#FAFAF7',
};

export default function InvoiceGenerator({ order, onClose }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice — FrameOnyx #${order._id?.slice(-6).toUpperCase()}</title>
          <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'DM Sans', sans-serif; background: #fff; color: #1A1A2E; }
            h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const invoiceNum = `FO-${order._id?.slice(-6).toUpperCase()}`;
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const subtotal = order.items?.reduce((s, i) => s + i.price * i.qty, 0) || 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        background: C.white, borderRadius: 24, width: '100%', maxWidth: 780,
        maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
        border: `3px solid ${C.ink}`,
      }}>

        {/* Action bar */}
        <div style={{
          background: C.ink, padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 700, color: C.white, margin: 0, fontSize: 15 }}>
            Invoice — {invoiceNum}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: C.pink, color: C.white, border: 'none',
                fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                padding: '8px 20px', borderRadius: 10, cursor: 'pointer',
                boxShadow: `0 4px 12px ${C.pink}50`,
              }}
            >
              🖨️ Print / Download PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)', color: C.white,
                border: '1px solid rgba(255,255,255,0.2)',
                fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Invoice content */}
        <div ref={printRef} style={{ padding: '3rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
            <div>
              <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: C.ink, margin: '0 0 4px' }}>
                Frame<span style={{ color: C.pink }}>Onyx</span>
              </h1>
              <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#888', margin: '0 0 2px' }}>Hold your favorite memories in your hand</p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#aaa', margin: '8px 0 0', lineHeight: 1.6 }}>
                📧 frameonyx007@gmail.com<br />
                📱 +91 97101 94144<br />
                📸 @frameonyx<br />
                📍 Chennai, Tamil Nadu
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                background: C.ink, color: C.white,
                fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem',
                padding: '8px 20px', borderRadius: 12, marginBottom: 12,
                display: 'inline-block',
              }}>
                INVOICE
              </div>
              <div style={{ background: '#f8f8f8', border: '2px solid #eee', borderRadius: 12, padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#888' }}>Invoice No.</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: C.ink }}>{invoiceNum}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#888' }}>Date</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 12, color: C.ink }}>{date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#888' }}>Status</span>
                  <span style={{
                    fontFamily: 'Syne', fontWeight: 700, fontSize: 11,
                    background: order.status === 'delivered' ? '#d4edda' : '#fff3cd',
                    color: order.status === 'delivered' ? '#155724' : '#856404',
                    padding: '2px 10px', borderRadius: 50,
                    textTransform: 'capitalize',
                  }}>{order.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${C.pink}, ${C.purple}, ${C.blue})`, borderRadius: 3, marginBottom: '2.5rem' }} />

          {/* Bill to */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Bill To</p>
            <div style={{ background: '#f8f8f8', border: '2px solid #eee', borderRadius: 16, padding: '1.25rem 1.5rem' }}>
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', color: C.ink, margin: '0 0 6px' }}>
                {order.shippingAddress?.name}
              </p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#666', margin: '0 0 3px' }}>{order.shippingAddress?.email}</p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#666', margin: '0 0 3px' }}>{order.shippingAddress?.phone}</p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#666', margin: 0 }}>
                {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>

          {/* Items table */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Items Ordered</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #eee', borderRadius: 16, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: C.ink }}>
                  {['#', 'Item', 'Qty', 'Unit Price', 'Total'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', fontFamily: 'Syne', fontWeight: 700,
                      fontSize: 12, color: C.white, textAlign: h === '#' || h === 'Qty' ? 'center' : 'left',
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? C.white : '#fafafa' }}>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: 'DM Sans', fontSize: 13, color: '#aaa' }}>{i + 1}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink, margin: 0 }}>{item.name}</p>
                      {item.variant && item.variant !== 'default' && (
                        <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#aaa', margin: '2px 0 0' }}>{item.variant}</p>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink }}>{item.qty}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'DM Sans', fontSize: 13, color: '#666' }}>₹{item.price}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: C.ink }}>₹{item.price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2.5rem' }}>
            <div style={{ width: 280 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#888' }}>Subtotal</span>
                <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13 }}>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#888' }}>Shipping</span>
                <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: '#06D6A0' }}>₹0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: C.ink, borderRadius: 12, marginTop: 8 }}>
                <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: C.white }}>Total</span>
                <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color: C.pink }}>₹{order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: '2px dashed #eee', paddingTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', color: C.ink, marginBottom: 8 }}>
              Thank you for your order! 💖
            </p>
            <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#aaa', lineHeight: 1.7 }}>
              For any queries, contact us at frameonyx007@gmail.com or WhatsApp +91 97101 94144<br />
              Follow us on Instagram @frameonyx
            </p>
            <div style={{ marginTop: 16, display: 'inline-block', background: `${C.pink}15`, border: `2px solid ${C.pink}40`, borderRadius: 12, padding: '8px 20px' }}>
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: C.pink, margin: 0 }}>
                Made with 💖 in Chennai · FrameOnyx
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}