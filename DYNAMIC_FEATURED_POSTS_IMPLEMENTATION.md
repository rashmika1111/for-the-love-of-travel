# Dynamic Featured Posts Implementation

## Overview
The homepage grid section below the hero has been converted from static content to dynamic content that fetches published posts from the backend API, similar to the destination page implementation.

## Changes Made

### 1. New Component: `DynamicFeaturedPosts.jsx`
- **Location**: `Website-frontend/components/DynamicFeaturedPosts.jsx`
- **Purpose**: Fetches published posts from the backend API and displays them in the same grid layout as before
- **Features**:
  - Fetches 7 published posts from `/api/v1/posts` endpoint
  - Transforms API data to match PostCard component expectations
  - Maintains the same responsive grid layout (mobile and desktop)
  - Includes loading skeleton while fetching data
  - Fallback to static data if API fails
  - Handles media URL transformation from admin frontend to backend

### 2. Updated Homepage: `HomePageClient.jsx`
- **Location**: `Website-frontend/app/HomePageClient.jsx`
- **Changes**:
  - Replaced static `featuredPosts` import with `DynamicFeaturedPosts` component
  - Replaced entire static grid section with `<DynamicFeaturedPosts />` component
  - Removed dependency on static data from `lib/data.js`

### 3. Environment Configuration
- **File**: `Website-frontend/.env.local`
- **Change**: Updated `NEXT_PUBLIC_BACKEND_URL` from `http://localhost:3000` to `http://localhost:5000`

## API Integration

### Endpoint Used
```
GET /api/v1/posts?limit=7&status=published&sortBy=publishedAt&sortOrder=desc
```

### Data Transformation
The component transforms API response data to match the PostCard component expectations:

```javascript
{
  _id: post._id,
  title: post.title,
  excerpt: post.excerpt || post.description,
  image: transformedMediaUrl,
  author: authorName,
  date: formattedDate,
  readTime: calculatedReadTime,
  slug: post.slug,
  category: categoryName, // Single category for PostCard
  categories: post.categories // Original categories array
}
```

### Media URL Handling
- Transforms URLs from admin frontend format (`localhost:3002/api/admin/media/serve/`) to backend format (`localhost:5000/api/v1/media/serve/`)
- Provides fallback images if media URLs are missing or invalid

## Error Handling

### API Failure Fallback
If the API call fails, the component falls back to static data to ensure the homepage remains functional.

### Loading States
- Shows skeleton loading animation while fetching data
- Displays error messages if API fails and no fallback data is available

## Testing

### Test Script
A test script is provided at `Website-frontend/test-featured-posts-api.js` to verify the API endpoint functionality.

### Manual Testing
1. Start the backend server on port 5000
2. Start the frontend development server
3. Navigate to the homepage
4. Verify that the grid section shows published posts from the database
5. Check that the layout remains responsive on mobile and desktop

## Benefits

1. **Dynamic Content**: The homepage now displays real published posts from the CMS
2. **Consistent with Destination Page**: Uses the same API pattern as other dynamic sections
3. **Fallback Safety**: Gracefully handles API failures with static content
4. **Performance**: Includes loading states and optimized data fetching
5. **Maintainable**: Easy to modify API parameters or add new features

## Future Enhancements

- Add caching for better performance
- Implement real-time updates when new posts are published
- Add filtering options (by category, date range, etc.)
- Implement infinite scroll or pagination for more posts


