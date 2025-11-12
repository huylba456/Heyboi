import { useEffect, useState } from 'react';

const ACCESS_TOKEN_KEY = 'drone-delivery-token';
const USER_ROLE_KEY = 'drone-delivery-role';

export default function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(ACCESS_TOKEN_KEY));
  const [role, setRole] = useState(() => localStorage.getItem(USER_ROLE_KEY));

  useEffect(() => {
    const handler = () => {
      setToken(localStorage.getItem(ACCESS_TOKEN_KEY));
      setRole(localStorage.getItem(USER_ROLE_KEY));
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = (accessToken, userRole) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(USER_ROLE_KEY, userRole);
    setToken(accessToken);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    setToken(null);
    setRole(null);
  };

  return {
    token,
    role,
    login,
    logout,
    isAuthenticated: Boolean(token)
  };
}

export const getAuthHeaders = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken) {
    return {};
  }
  return {
    Authorization: `Bearer ${accessToken}`
  };
};
