# Environment Setup Guide

## Frontend Environment Variables

Create a `.env.local` file in the `for-the-love-of-travel-clone` directory with the following content:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Environment
NODE_ENV=development
```

## Backend Environment Variables

Make sure your backend has a `.env` file in the `for-the-love-of-travel-backend` directory with the following configuration:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/love-of-travel

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URLs
FRONTEND_URL=http://localhost:3001
ADMIN_URL=http://localhost:3001

# Analytics Configuration
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
MIXPANEL_TOKEN=your-mixpanel-token

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-here

# External Services
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Monitoring and Error Tracking
SENTRY_DSN=your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-newrelic-license-key

# Development Tools
DEBUG=love-of-travel:*
NODE_DEBUG=*
```

## Important Notes

1. **Frontend Port**: The frontend runs on port 3001 by default (Next.js), while the backend runs on port 3000
2. **CORS Configuration**: The backend is configured to accept requests from `http://localhost:3001`
3. **Email Service**: You need to configure SMTP settings for contact form and newsletter emails to work
4. **Database**: Make sure MongoDB is running and accessible
5. **Redis**: Optional but recommended for caching and rate limiting

## Quick Start

1. Copy the environment variables above to your respective `.env` files
2. Update the values according to your setup
3. Start MongoDB and Redis (if using)
4. Start the backend: `npm run dev` in the backend directory
5. Start the frontend: `npm run dev` in the frontend directory
6. Visit `http://localhost:3001` to see the frontend
7. Test the contact form and newsletter subscription
