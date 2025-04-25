// Centralized API utility for backend requests
const API_URL = 'http://localhost:5000/api';

export async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = {
    method,
    headers,
  };
  if (data) config.body = JSON.stringify(data);

  const response = await fetch(`${API_URL}${endpoint}`, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || response.statusText);
  }
  return response.json();
}

// Movie API
export const getMovies = () => apiRequest('/movies');
export const addMovie = (movie, token) => apiRequest('/movies', 'POST', movie, token);
export const updateMovie = (id, movie, token) => apiRequest(`/movies/${id}`, 'PUT', movie, token);
export const deleteMovie = (id, token) => apiRequest(`/movies/${id}`, 'DELETE', null, token);

// Admin API
export const adminLogin = (username, password) => apiRequest('/admin/login', 'POST', { username, password });
export const createAdmin = (username, password) => apiRequest('/admin/create', 'POST', { username, password });
