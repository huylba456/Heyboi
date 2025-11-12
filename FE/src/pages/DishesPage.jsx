import { useEffect, useMemo, useState } from 'react';
import { dishApi, restaurantApi } from '../api/index.js';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  restaurantId: ''
};

export default function DishesPage() {
  const [dishes, setDishes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filterRestaurant, setFilterRestaurant] = useState('');
  const [error, setError] = useState(null);

  const filteredDishes = useMemo(() => {
    if (!filterRestaurant) return dishes;
    return dishes.filter((dish) => String(dish.restaurantId) === String(filterRestaurant));
  }, [dishes, filterRestaurant]);

  const loadData = async () => {
    try {
      const [dishData, restaurantData] = await Promise.all([dishApi.listAll(), restaurantApi.list()]);
      setDishes(dishData);
      setRestaurants(restaurantData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dishes');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    try {
      if (editingId) {
        await dishApi.update(editingId, payload);
      } else {
        await dishApi.create(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save dish');
    }
  };

  const handleEdit = (dish) => {
    setForm({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      restaurantId: dish.restaurantId
    });
    setEditingId(dish.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dish?')) return;
    await dishApi.remove(id);
    loadData();
  };

  return (
    <div className="card">
      <header>
        <div>
          <h1>Dishes</h1>
          <p className="tagline">Maintain menus for each restaurant.</p>
        </div>
      </header>

      {error ? <div className="alert">{error}</div> : null}

      <div className="filter-bar">
        <label>
          Filter by restaurant
          <select value={filterRestaurant} onChange={(event) => setFilterRestaurant(event.target.value)}>
            <option value="">All restaurants</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form className="form" onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
        <div className="form-row">
          <div>
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
          </div>
          <div>
            <label>
              Price (VND)
              <input
                type="number"
                step="1000"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                required
              />
            </label>
          </div>
        </div>
        <label>
          Restaurant
          <select
            value={form.restaurantId}
            onChange={(event) => setForm({ ...form, restaurantId: event.target.value })}
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
        <label>
          Description
          <textarea
            rows="3"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </label>
        <div className="actions">
          <button type="submit">{editingId ? 'Update Dish' : 'Create Dish'}</button>
          {editingId ? (
            <button type="button" onClick={() => setEditingId(null)}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Restaurant</th>
            <th>Description</th>
            <th>Price</th>
            <th style={{ width: '160px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDishes.length === 0 ? (
            <tr>
              <td colSpan="5">No dishes</td>
            </tr>
          ) : (
            filteredDishes.map((dish) => (
              <tr key={dish.id}>
                <td>{dish.name}</td>
                <td>{restaurants.find((r) => String(r.id) === String(dish.restaurantId))?.name || '—'}</td>
                <td>{dish.description}</td>
                <td>{dish.price?.toLocaleString?.() || dish.price}</td>
                <td>
                  <div className="actions">
                    <button type="button" onClick={() => handleEdit(dish)}>
                      Edit
                    </button>
                    <button type="button" className="delete" onClick={() => handleDelete(dish.id)}>
                      Delete
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
