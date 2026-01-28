import axios from "axios";

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const fetchProducts = (page = 1) =>
  API.get(`/products/?page=${page}`);

export const searchProducts = (query, page = 1) =>
  API.get(`/products/search/?q=${query}&page=${page}`);

export const fetchProductDetail = (id) =>
  API.get(`/products/${id}/`);

// Export the base URL for use in other components
export const getApiUrl = () => API_BASE_URL;

export default API;
