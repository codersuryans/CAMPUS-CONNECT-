// Central API configuration
// In production (Vercel), set VITE_API_URL to your Render backend URL.
// In development, it falls back to localhost:5000.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
