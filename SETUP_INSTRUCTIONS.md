# For the Love of Travel - Setup Instructions

This document provides comprehensive setup instructions for the "For the Love of Travel" website project.

## Project Overview

The project consists of:
- **Frontend**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Backend**: Node.js/Express API with MongoDB
- **Features**: Dynamic content management, SEO optimization, user interactions, and admin integration

## Prerequisites

Before starting, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)
- Git

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd for-the-love-of-travel-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```bash
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/love-of-travel

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

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-here
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### 5. Seed the Database
Populate the database with sample data:
```bash
npm run seed
```

This will create:
- Sample categories (Destinations, Adventure, Culture, etc.)
- Sample authors with profiles and social links
- Sample blog posts with rich content
- Admin user (admin@loveoftravel.com / admin123)

### 6. Start the Backend Server
```bash
npm run dev
```

The backend will be available at `http://localhost:3000`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd for-the-love-of-travel-clone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the frontend directory:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Environment
NODE_ENV=development
```

### 4. Start the Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3001`

## Project Structure

### Backend Structure
```
for-the-love-of-travel-backend/
├── src/
│   ├── controllers/          # API controllers
│   ├── middleware/           # Custom middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── services/            # Business logic services
│   ├── utils/               # Utility functions
│   └── scripts/             # Database seeding scripts
├── logs/                    # Application logs
├── server.js               # Main server file
└── package.json
```

### Frontend Structure
```
for-the-love-of-travel-clone/
├── app/                     # Next.js App Router
│   ├── content/            # Content pages
│   │   ├── [slug]/         # Dynamic post pages
│   │   └── page.jsx        # Content listing page
│   ├── globals.css         # Global styles
│   └── layout.jsx          # Root layout
├── components/             # React components
├── lib/                    # Utility libraries
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts with pagination and filtering
- `GET /api/posts/:slug` - Get single post by slug
- `GET /api/posts/popular` - Get popular posts
- `GET /api/posts/featured` - Get featured posts
- `GET /api/posts/pinned` - Get pinned posts
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/share` - Share a post

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug/posts` - Get posts by category

### Authors
- `GET /api/authors` - Get all authors
- `GET /api/authors/:slug` - Get single author
- `GET /api/authors/:slug/posts` - Get author's posts
- `GET /api/authors/featured` - Get featured authors

### Search
- `GET /api/search?q=query` - Search posts, categories, and authors

## Features Implemented

### ✅ Database & Models
- MongoDB connection with Mongoose
- Post model with rich content structure
- Category model with hierarchical support
- Author model with social links and stats
- User model for authentication
- Comment model for post interactions
- Analytics model for tracking

### ✅ API Endpoints
- Complete REST API for all content types
- Pagination and filtering support
- Search functionality
- Like and share functionality
- Analytics tracking

### ✅ Frontend Features
- Dynamic content pages with SEO optimization
- Responsive design with Tailwind CSS
- TypeScript support for type safety
- Framer Motion animations
- Search and filtering
- Pagination
- Social sharing
- Like functionality

### ✅ SEO Optimization
- Dynamic meta tags
- Open Graph support
- Twitter Card support
- Structured data
- Canonical URLs
- Sitemap generation ready

## Development Workflow

### 1. Database Changes
When modifying models:
1. Update the model file in `src/models/`
2. Update the TypeScript types in `types/index.ts`
3. Update API endpoints if needed
4. Re-seed the database: `npm run seed`

### 2. Frontend Changes
When adding new features:
1. Update TypeScript types if needed
2. Create/update components
3. Update API calls in `lib/api.ts`
4. Test with the backend running

### 3. Adding New Content
- Use the admin panel (when implemented) or
- Add directly to the database using the seeding script
- Update the seeding script for new sample data

## Testing the Setup

### 1. Backend Health Check
Visit `http://localhost:3000/health` to verify the backend is running.

### 2. API Documentation
Visit `http://localhost:3000/api` to see available endpoints.

### 3. Frontend Pages
- Home: `http://localhost:3001`
- Content: `http://localhost:3001/content`
- Individual Post: `http://localhost:3001/content/[slug]`

### 4. Sample Data
After seeding, you can access:
- Sample posts with rich content
- Categories and tags
- Author profiles
- Admin user for testing

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your .env file
   - Verify MongoDB is accessible on the specified port

2. **Port Already in Use**
   - Change the PORT in your .env file
   - Kill processes using the port: `lsof -ti:3000 | xargs kill -9`

3. **TypeScript Errors**
   - Run `npm run build` to check for type errors
   - Ensure all imports are correct
   - Check type definitions in `types/index.ts`

4. **API Connection Issues**
   - Verify the backend is running on port 3000
   - Check the NEXT_PUBLIC_API_BASE_URL in frontend .env.local
   - Ensure CORS is properly configured

### Getting Help

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the database connection and data

## Next Steps

### Planned Features
- [ ] Admin panel for content management
- [ ] User authentication and registration
- [ ] Comment system
- [ ] Email notifications
- [ ] Advanced search with filters
- [ ] RSS feed generation
- [ ] Sitemap generation
- [ ] Image optimization
- [ ] Caching strategies
- [ ] Performance monitoring

### Deployment
- [ ] Docker configuration
- [ ] Production environment setup
- [ ] CI/CD pipeline
- [ ] Monitoring and logging
- [ ] Backup strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
