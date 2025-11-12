import { useState } from 'react';
import { orderApi } from '../api/index.js';

export default function ConfirmDeliveryPage() {
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState(null);

  const handleConfirm = async (event) => {
    event.preventDefault();
    setMessage(null);
    try {
      await orderApi.confirmDelivered(Number(orderId));
      setMessage('Thanks! Delivery confirmation recorded.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to confirm delivery');
    }
  };

  return (
    <div className="card">
      <h1>Confirm Delivery</h1>
      <p className="tagline">Final step: customer acknowledges successful drop-off.</p>
      <form onSubmit={handleConfirm} style={{ display: 'grid', gap: '12px', maxWidth: '480px' }}>
        <label>
          Order ID
          <input value={orderId} onChange={(event) => setOrderId(event.target.value)} required />
        </label>
        <button type="submit">Confirm received</button>
      </form>
      {message ? <div className="alert" style={{ marginTop: '16px' }}>{message}</div> : null}
    </div>
  );
}
