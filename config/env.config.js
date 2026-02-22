import dotenv from 'dotenv';

dotenv.config();

/**
 * Validate required environment variables
 */
const requiredEnv = [
  'APP_NAME',
  'APP_URL',
  'PORT',
  'MONGODB_URI',
  'SESSION_SECRET',
  'JWT_SECRET'
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

/**
 * Centralized Environment Configuration
 */
export const ENV = {
  app: {
    name: process.env.APP_NAME,
    url: process.env.APP_URL,
    port: process.env.PORT || 3000
  },

  database: {
    uri: process.env.MONGODB_URI
  },

  session: {
    secret: process.env.SESSION_SECRET
  },

  jwt: {
    secret: process.env.JWT_SECRET
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl: process.env.GOOGLE_REDIRECT_URL
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }
};