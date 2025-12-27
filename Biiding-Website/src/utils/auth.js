export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const isClient = () => {
  const user = getUser();
  return user?.role === 'client';
};

export const isFreelancer = () => {
  const user = getUser();
  return user?.role === 'freelancer';
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};


