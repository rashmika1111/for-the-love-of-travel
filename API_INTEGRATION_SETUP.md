# API Integration Setup Guide

## Overview
The destination page now displays dynamic content from the admin panel. The first two post cards in the "Latest Post" section will show real data from the backend API.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd for-the-love-of-travel-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `env.example`):
   ```bash
   cp env.example .env
   ```

4. Update the `.env` file with your MongoDB connection:
   ```env
   MONGODB_URI=mongodb://localhost:27017/love-of-travel
   PORT=5000
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd for-the-love-of-travel-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 3. Test the Integration
1. Run the API test script:
   ```bash
   node test-api.js
   ```

2. Visit the destination page: `http://localhost:3000/destination`

3. Check the browser console for any API errors

## What's Been Implemented

### ✅ Dynamic Content Display
- Post cards now display real data from the admin panel
- Featured images are pulled from the backend
- Post titles, descriptions, and metadata are dynamic
- Category buttons show the actual post category

### ✅ API Configuration
- Fixed API base URL to point to the correct backend (port 5000)
- Added proper error handling for API calls
- Implemented fallback data when API is unavailable

### ✅ Component Updates
- Updated `LatestPostCard` component to use dynamic data
- Made category button dynamic based on post data
- Maintained responsive design and animations

## API Endpoints Used

- `GET /health` - Health check
- `GET /api/posts?limit=7&sortBy=createdAt&sortOrder=desc` - Latest posts for the grid

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend is running on port 5000
   - Check MongoDB connection
   - Verify CORS configuration

2. **No Posts Displayed**
   - Check if there are published posts in the database
   - Verify the posts have featured images
   - Check browser console for errors

3. **Images Not Loading**
   - Ensure featured images are properly uploaded
   - Check image URLs in the database
   - Verify image accessibility

### Debug Steps

1. Check backend logs for errors
2. Use browser developer tools to inspect API calls
3. Run the test script: `node test-api.js`
4. Verify database has published posts with featured images

## Next Steps

To further enhance the CMS workflow:

1. **Add More Dynamic Content**: Extend other sections to use dynamic data
2. **Real-time Updates**: Implement WebSocket connections for live updates
3. **Content Scheduling**: Add support for scheduled posts
4. **Image Optimization**: Implement automatic image resizing and optimization
5. **Caching**: Add Redis caching for better performance

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the browser console for errors
3. Verify the backend API is responding correctly
4. Ensure all environment variables are properly configured

