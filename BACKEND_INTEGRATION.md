# Backend Integration Guide

This document explains how the frontend has been connected to the backend API for the "For Love of Travel" project.

## What's Been Added

### 1. API Configuration (`lib/api.js`)
- Centralized API configuration with base URL and endpoints
- Generic API request handler with error handling
- Specific API functions for different services:
  - Contact form submissions
  - Newsletter subscriptions
  - Posts, categories, and tags
  - Search functionality
  - Analytics tracking

### 2. Form Handling (`hooks/useForm.js`)
- Custom React hook for form state management
- Built-in validation and error handling
- Loading states and submission handling

### 3. Updated Components

#### Newsletter Component (`components/Newsletter.jsx`)
- Connected to backend newsletter subscription API
- Email validation
- Loading states and success/error feedback
- Toast notifications for user feedback

#### Contact Form (`app/contactus/page.jsx`)
- Connected to backend contact form API
- Form validation for required fields
- Loading states during submission
- Success/error feedback with toast notifications

### 4. Toast Notifications
- Added `react-hot-toast` for user feedback
- Configured in the root layout
- Success and error message styling

### 5. Dependencies Added
- `react-hot-toast`: For toast notifications
- `axios`: For HTTP requests (alternative to fetch)

## Backend API Endpoints Used

### Contact Form
- **POST** `/api/contact` - Submit contact form
  - Body: `{ name, email, subject, message }`

### Newsletter
- **POST** `/api/newsletter` - Subscribe to newsletter
  - Body: `{ email, preferences }`
- **POST** `/api/newsletter/unsubscribe` - Unsubscribe from newsletter

### Posts & Content
- **GET** `/api/posts` - Get all posts
- **GET** `/api/posts/popular` - Get popular posts
- **GET** `/api/posts/:slug` - Get single post
- **GET** `/api/categories` - Get all categories
- **GET** `/api/tags` - Get all tags

## Environment Configuration

The API base URL is configured in `lib/api.js` and defaults to `http://localhost:5000`. 

To change the API URL, you can:
1. Set the `NEXT_PUBLIC_API_BASE_URL` environment variable
2. Or modify the `API_BASE_URL` constant in `lib/api.js`

## Setup Instructions

### 1. Install Dependencies
```bash
cd for-the-love-of-travel-clone
npm install
```

### 2. Start the Backend
```bash
cd ../for-the-love-of-travel-backend
npm install
npm run dev
```

### 3. Start the Frontend
```bash
cd ../for-the-love-of-travel-clone
npm run dev
```

### 4. Configure Backend Environment
Make sure the backend has a `.env` file with the necessary configuration:
- MongoDB connection string
- Email service configuration (for contact form and newsletter emails)
- Redis configuration (optional, for caching)

## Features Implemented

### Contact Form
- ✅ Form validation
- ✅ Backend API integration
- ✅ Loading states
- ✅ Success/error feedback
- ✅ Form reset after successful submission

### Newsletter Subscription
- ✅ Email validation
- ✅ Backend API integration
- ✅ Duplicate subscription handling
- ✅ Loading states
- ✅ Success/error feedback
- ✅ Form reset after successful subscription

### Error Handling
- ✅ Network error handling
- ✅ Validation error display
- ✅ User-friendly error messages
- ✅ Loading state management

## Testing the Integration

1. **Contact Form**: Navigate to `/contactus` and submit the form
2. **Newsletter**: Scroll to the newsletter section on the homepage and subscribe
3. **Error Handling**: Try submitting forms with invalid data to see error handling

## Next Steps

To further enhance the integration, you could:

1. **Add Content Management**: Connect the posts, categories, and tags APIs to display dynamic content
2. **Search Functionality**: Implement the search API for content discovery
3. **Analytics**: Add analytics tracking for user interactions
4. **Comments System**: Implement the comments API for blog posts
5. **User Authentication**: Add user registration/login functionality

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend CORS configuration includes the frontend URL
2. **API Connection**: Verify the backend is running on the correct port
3. **Environment Variables**: Check that all required environment variables are set in the backend

### Debug Mode

To debug API calls, check the browser's Network tab in Developer Tools to see the actual requests being made and their responses.
