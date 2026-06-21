// TODO: connecter au backend Node.js/Express
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Produits
export const getProducts = async (filters = {}) => {};
export const getProductById = async (id) => {};
export const getProductsByCategory = async (category) => {};
export const searchProducts = async (query) => {};

// Commandes
export const createOrder = async (orderData) => {};
export const getOrderById = async (id) => {};
export const getUserOrders = async (userId) => {};

// Utilisateurs
export const login = async (email, password) => {};
export const register = async (userData) => {};
export const getProfile = async (token) => {};
export const updateProfile = async (userId, data) => {};

// Newsletter
export const subscribeNewsletter = async (email) => {};

// Contact
export const sendContactForm = async (formData) => {};
