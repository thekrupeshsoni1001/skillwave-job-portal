// utils/cloudinary.js

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dzwhoy9sf',
    api_key: '974429968424699',
    api_secret: 'PYKEi_hJ0MRnqcrJTbm1LU269BU',
    secure: true, // Ensures the URL is HTTPS
});

export default cloudinary;
