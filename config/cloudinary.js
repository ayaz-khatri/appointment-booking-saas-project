import { ENV } from '../config/env.config.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: ENV.cloudinary.cloudName,
    api_key: ENV.cloudinary.apiKey,
    api_secret: ENV.cloudinary.apiSecret
});

export default cloudinary;