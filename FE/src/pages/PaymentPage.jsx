import { useState } from 'react';
import { paymentApi } from '../api/index.js';

export default function PaymentPage() {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null);

  const handlePayment = async (event) => {
    event.preventDefault();
    setMessage(null);
    try {
      const payload = {
        orderId: Number(orderId),
        amount: Number(amount)
      };
      const data = await paymentApi.createPaymentUrl(payload);
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setMessage('Payment URL generated. Redirect manually: ' + data.url);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create payment');
    }
  };

  return (
    <div className="card">
      <h1>Payment via VNPAY</h1>
      <p className="tagline">Redirect customers to VNPAY gateway after order creation.</p>
      <form onSubmit={handlePayment} style={{ display: 'grid', gap: '12px', maxWidth: '480px' }}>
        <label>
          Order ID
          <input value={orderId} onChange={(event) => setOrderId(event.target.value)} required />
        </label>
        <label>
          Amount (VND)
          <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} required />
        </label>
        <button type="submit">Create payment link</button>
      </form>
      {message ? <div className="alert" style={{ marginTop: '16px' }}>{message}</div> : null}
    </div>
  );
}
