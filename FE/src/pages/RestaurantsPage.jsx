import { useEffect, useState } from 'react';
import { restaurantApi } from '../api/index.js';

const emptyForm = {
  name: '',
  address: '',
  description: ''
};

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await restaurantApi.list();
      setRestaurants(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await restaurantApi.update(editingId, form);
      } else {
        await restaurantApi.create(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadRestaurants();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save restaurant');
    }
  };

  const handleEdit = (restaurant) => {
    setForm({ name: restaurant.name, address: restaurant.address, description: restaurant.description });
    setEditingId(restaurant.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this restaurant?')) return;
    await restaurantApi.remove(id);
    loadRestaurants();
  };

  return (
    <div className="card">
      <header>
        <div>
          <h1>Restaurants</h1>
          <p className="tagline">Manage the restaurant catalog participating in drone delivery.</p>
        </div>
      </header>

      {error ? <div className="alert">{error}</div> : null}

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
              Address
              <input
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                required
              />
            </label>
          </div>
        </div>
        <label>
          Description
          <textarea
            rows="3"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </label>
        <div className="actions">
          <button type="submit">{editingId ? 'Update Restaurant' : 'Create Restaurant'}</button>
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
            <th>Address</th>
            <th>Description</th>
            <th style={{ width: '160px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4">Loading…</td>
            </tr>
          ) : restaurants.length === 0 ? (
            <tr>
              <td colSpan="4">No restaurants yet.</td>
            </tr>
          ) : (
            restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>{restaurant.name}</td>
                <td>{restaurant.address}</td>
                <td>{restaurant.description}</td>
                <td>
                  <div className="actions">
                    <button type="button" onClick={() => handleEdit(restaurant)}>
                      Edit
                    </button>
                    <button type="button" className="delete" onClick={() => handleDelete(restaurant.id)}>
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
