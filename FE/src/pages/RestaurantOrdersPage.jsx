import { useEffect, useState } from 'react';
import { orderApi, restaurantApi } from '../api/index.js';

export default function RestaurantOrdersPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    restaurantApi.list().then(setRestaurants);
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) return;
    const loadOrders = async () => {
      try {
        const data = await orderApi.listForRestaurant(selectedRestaurant);
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      }
    };
    loadOrders();
  }, [selectedRestaurant]);

  const mutateOrder = async (orderId, action, payload) => {
    setError(null);
    try {
      if (action === 'confirm') await orderApi.confirm(orderId);
      if (action === 'cancel') await orderApi.cancel(orderId, payload);
      const data = await orderApi.listForRestaurant(selectedRestaurant);
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
    }
  };

  return (
    <div className="card">
      <h1>Manage Orders</h1>
      <p className="tagline">Restaurant managers confirm or cancel orders after payment.</p>

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

      {error ? <div className="alert" style={{ background: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' }}>{error}</div> : null}

      <table className="table" style={{ marginTop: '16px' }}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Delivery</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5">Select a restaurant to view orders.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>
                  #{order.id}
                  <div className="tagline">{order.dishes?.map((dish) => dish.name).join(', ')}</div>
                </td>
                <td>
                  {order.customerName}
                  <div className="tagline">{order.customerPhone}</div>
                </td>
                <td>{order.customerAddress}</td>
                <td>
                  <span className="badge">{order.status}</span>
                </td>
                <td>
                  <div className="actions">
                    <button type="button" onClick={() => mutateOrder(order.id, 'confirm')}>
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="delete"
                      onClick={() => {
                        const reason = window.prompt('Cancellation reason?');
                        if (reason) {
                          mutateOrder(order.id, 'cancel', { reason });
                        }
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
