// src/Components/common/utils/auth.js
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const updateLocalUser = (updates) => {
  const user = getUser();
  if (user) {
    const updated = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
  }
};

export const getToken = () => localStorage.getItem('token');

export const isAdmin = () => {
  const user = getUser();
  return user && user.is_admin === true;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};