import { useEffect, useState } from 'react';
import { dishApi, orderApi, restaurantApi } from '../api/index.js';

const defaultOrder = {
  customerName: '',
  customerPhone: '',
  customerAddress: '',
  restaurantId: '',
  dishIds: [],
  note: ''
};

export default function CreateOrderPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [form, setForm] = useState(defaultOrder);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    restaurantApi.list().then(setRestaurants);
    dishApi.listAll().then(setDishes);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      const payload = {
        ...form,
        dishIds: form.dishIds.map((id) => Number(id))
      };
      const data = await orderApi.create(payload);
      setSuccess(`Order created with code ${data.orderCode || data.id}`);
      setForm(defaultOrder);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    }
  };

  const handleDishToggle = (dishId) => {
    setForm((prev) => {
      const exists = prev.dishIds.includes(dishId);
      return {
        ...prev,
        dishIds: exists ? prev.dishIds.filter((id) => id !== dishId) : [...prev.dishIds, dishId]
      };
    });
  };

  const dishesForRestaurant = dishes.filter((dish) => String(dish.restaurantId) === String(form.restaurantId));

  return (
    <div className="card">
      <h1>Create Order</h1>
      <p className="tagline">Kick off the order → payment → fulfillment flow.</p>

      {success ? <div className="alert">{success}</div> : null}
      {error ? <div className="alert" style={{ background: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' }}>{error}</div> : null}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
        <div className="form-row">
          <div>
            <label>
              Customer name
              <input
                value={form.customerName}
                onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Phone
              <input
                value={form.customerPhone}
                onChange={(event) => setForm({ ...form, customerPhone: event.target.value })}
                required
              />
            </label>
          </div>
        </div>
        <label>
          Delivery address
          <input
            value={form.customerAddress}
            onChange={(event) => setForm({ ...form, customerAddress: event.target.value })}
            required
          />
        </label>
        <label>
          Restaurant
          <select
            value={form.restaurantId}
            onChange={(event) => setForm({ ...form, restaurantId: event.target.value, dishIds: [] })}
            required
          >
            <option value="" disabled>
              Choose restaurant
            </option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          <strong>Dishes</strong>
          <p className="tagline">Select one or many dishes to include.</p>
          <div style={{ display: 'grid', gap: '8px' }}>
            {dishesForRestaurant.map((dish) => {
              const checked = form.dishIds.includes(dish.id);
              return (
                <label key={dish.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleDishToggle(dish.id)}
                  />
                  <span>
                    {dish.name} – {dish.price?.toLocaleString?.() || dish.price} VND
                  </span>
                </label>
              );
            })}
            {dishesForRestaurant.length === 0 ? <em>No dishes for this restaurant.</em> : null}
          </div>
        </div>

        <label>
          Note for restaurant
          <textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} rows="3" />
        </label>

        <button type="submit">Create order &amp; proceed to payment</button>
      </form>
    </div>
  );
}
