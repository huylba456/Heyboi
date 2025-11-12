import client from './client.js';

export const authApi = {
  login: async (credentials) => {
    const { data } = await client.post('/auth/login', credentials);
    return data;
  }
};

export const restaurantApi = {
  list: async () => {
    const { data } = await client.get('/restaurant');
    return data;
  },
  create: async (payload) => {
    const { data } = await client.post('/restaurant', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await client.put(`/restaurant/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await client.delete(`/restaurant/${id}`);
    return data;
  }
};

export const dishApi = {
  listAll: async () => {
    const { data } = await client.get('/dish');
    return data;
  },
  listByRestaurant: async (restaurantId) => {
    const { data } = await client.get(`/restaurant/${restaurantId}/dishes`);
    return data;
  },
  create: async (payload) => {
    const { data } = await client.post('/dish', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await client.put(`/dish/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await client.delete(`/dish/${id}`);
    return data;
  }
};

export const orderApi = {
  create: async (payload) => {
    const { data } = await client.post('/order', payload);
    return data;
  },
  listForRestaurant: async (restaurantId) => {
    const { data } = await client.get(`/order/restaurant/${restaurantId}`);
    return data;
  },
  confirm: async (orderId) => {
    const { data } = await client.post(`/order/${orderId}/confirm`);
    return data;
  },
  cancel: async (orderId, payload) => {
    const { data } = await client.post(`/order/${orderId}/cancel`, payload);
    return data;
  },
  markReady: async (orderId) => {
    const { data } = await client.post(`/order/${orderId}/ready`);
    return data;
  },
  markPickedUp: async (orderId) => {
    const { data } = await client.post(`/order/${orderId}/picked-up`);
    return data;
  },
  confirmDelivered: async (orderId) => {
    const { data } = await client.post(`/order/${orderId}/delivered`);
    return data;
  }
};

export const paymentApi = {
  createPaymentUrl: async (payload) => {
    const { data } = await client.post('/payment/vnpay-url', payload);
    return data;
  },
  verifyPayment: async (params) => {
    const { data } = await client.get('/payment/vnpay-return', { params });
    return data;
  }
};

export const trackingApi = {
  getDroneStatus: async (orderId) => {
    const { data } = await client.get(`/tracking/order/${orderId}`);
    return data;
  },
  getDroneHistory: async (orderId) => {
    const { data } = await client.get(`/tracking/order/${orderId}/history`);
    return data;
  }
};
