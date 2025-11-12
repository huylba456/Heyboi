import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RestaurantsPage from './pages/RestaurantsPage.jsx';
import DishesPage from './pages/DishesPage.jsx';
import RestaurantDishesPage from './pages/RestaurantDishesPage.jsx';
import CreateOrderPage from './pages/CreateOrderPage.jsx';
import RestaurantOrdersPage from './pages/RestaurantOrdersPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import RestaurantDispatchPage from './pages/RestaurantDispatchPage.jsx';
import TrackingPage from './pages/TrackingPage.jsx';
import ConfirmDeliveryPage from './pages/ConfirmDeliveryPage.jsx';
import useAuth from './hooks/useAuth.js';

function PrivateRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/dishes" element={<DishesPage />} />
        <Route path="/restaurant/:restaurantId/dishes" element={<RestaurantDishesPage />} />
        <Route path="/orders/create" element={<CreateOrderPage />} />
        <Route path="/orders/manage" element={<RestaurantOrdersPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/dispatch" element={<RestaurantDispatchPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/confirm-delivery" element={<ConfirmDeliveryPage />} />
        <Route path="*" element={<Navigate to="/restaurants" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/restaurants" replace /> : <LoginPage />}
      />
      <Route path="/*" element={<PrivateRoutes />} />
    </Routes>
  );
}
