import { useEffect, useState } from 'react';
import { orderApi, restaurantApi } from '../api/index.js';

export default function RestaurantDispatchPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    restaurantApi.list().then(setRestaurants);
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) return;
    orderApi.listForRestaurant(selectedRestaurant).then(setOrders);
  }, [selectedRestaurant]);

  const updateOrder = async (orderId, action) => {
    if (action === 'ready') await orderApi.markReady(orderId);
    if (action === 'picked-up') await orderApi.markPickedUp(orderId);
    const data = await orderApi.listForRestaurant(selectedRestaurant);
    setOrders(data);
  };

  return (
    <div className="card">
      <h1>Dispatch &amp; Drone Handoff</h1>
      <p className="tagline">Mark when meals are ready and drones have collected them.</p>

      <label>
        Restaurant
        <select value={selectedRestaurant} onChange={(event) => setSelectedRestaurant(event.target.value)}>
          <option value="">Select restaurant</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: '16px', display: 'grid', gap: '16px' }}>
        {orders.map((order) => (
          <div key={order.id} className="status-track">
            <div className={`step ${order.status === 'READY' ? 'active' : ''}`}>
              <h3>Meal ready</h3>
              <p>Signal that the kitchen finished preparing the order.</p>
              <button type="button" onClick={() => updateOrder(order.id, 'ready')}>
                Mark ready
              </button>
            </div>
            <div className={`step ${order.status === 'PICKED_UP' ? 'active' : ''}`}>
              <h3>Drone picked up</h3>
              <p>Confirm the drone pilot collected the package.</p>
              <button type="button" onClick={() => updateOrder(order.id, 'picked-up')}>
                Mark picked up
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 ? <p>No in-progress orders for this restaurant.</p> : null}
      </div>
    </div>
  );
}
