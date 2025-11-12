import { useState } from 'react';
import { trackingApi } from '../api/index.js';

const demoTimeline = [
  { time: '08:30', message: 'Order confirmed by restaurant' },
  { time: '08:45', message: 'Meal prepared and packed' },
  { time: '08:55', message: 'Drone DR-204 assigned and taking off' },
  { time: '09:05', message: 'Drone arrived at customer area' },
  { time: '09:10', message: 'Package dropped safely' }
];

export default function TrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState(demoTimeline);

  const handleFetch = async () => {
    try {
      const [statusData, historyData] = await Promise.all([
        trackingApi.getDroneStatus(orderId),
        trackingApi.getDroneHistory(orderId)
      ]);
      setStatus(statusData);
      setHistory(historyData);
    } catch (err) {
      setStatus({ error: err.response?.data?.message || 'Cannot load tracking, showing demo timeline.' });
      setHistory(demoTimeline);
    }
  };

  return (
    <div className="card">
      <h1>Drone Tracking</h1>
      <p className="tagline">Customers follow the drone delivery in real-time.</p>

      <div className="form-row">
        <div>
          <label>
            Order ID
            <input value={orderId} onChange={(event) => setOrderId(event.target.value)} />
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="button" onClick={handleFetch}>
            Refresh tracking
          </button>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <h3>Current status</h3>
        {status ? (
          <div className="alert">
            {status.error ? status.error : `${status.droneCode} – ${status.position} – ETA ${status.eta}`}
          </div>
        ) : (
          <div className="tagline">Enter an order ID and fetch tracking information.</div>
        )}
      </div>

      <div style={{ marginTop: '24px' }}>
        <h3>Timeline</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <strong>{item.time}</strong> – {item.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
