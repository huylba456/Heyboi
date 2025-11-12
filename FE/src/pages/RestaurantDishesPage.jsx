import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dishApi, restaurantApi } from '../api/index.js';

export default function RestaurantDishesPage() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [restaurantData, dishesData] = await Promise.all([
        restaurantApi.list(),
        dishApi.listByRestaurant(restaurantId)
      ]);
      setRestaurant(restaurantData.find((r) => String(r.id) === String(restaurantId)));
      setDishes(dishesData);
    };
    load();
  }, [restaurantId]);

  return (
    <div className="card">
      <h1>Menu</h1>
      <p className="tagline">Dishes available at {restaurant?.name || 'this restaurant'}.</p>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {dishes.length === 0 ? (
            <tr>
              <td colSpan="3">No dishes listed.</td>
            </tr>
          ) : (
            dishes.map((dish) => (
              <tr key={dish.id}>
                <td>{dish.name}</td>
                <td>{dish.description}</td>
                <td>{dish.price?.toLocaleString?.() || dish.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
