const axios = require('axios');
const baseURL = 'https://polaroid-shop-backend.onrender.com/api/';
const api = axios.create({ baseURL });
console.log(api.getUri({ url: '/products' }));
console.log(api.getUri({ url: 'products' }));
