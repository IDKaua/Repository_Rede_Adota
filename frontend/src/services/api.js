// src/services/api.js
import axios from 'axios';

const api = axios.create({
    // O endereço onde o seu Node.js está a correr
    baseURL: 'http://localhost:5000/api',
});

export default api;