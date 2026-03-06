/* src/api/axios.ts */

import axios from 'axios';

// Vite expose their environment variables via import.meta.env
const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Very important for cookie-based authentication
    headers: {
        'Content-Type': 'application/json'
    }
});


export default api;