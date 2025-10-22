# Video Debugging Guide

## Issue Summary
Videos are not showing as cover images for posts in the DynamicFilteredArticles component. The error shows "Video load error: {}" in the console.

## Changes Made

### 1. Improved Error Handling
- Changed `console.error` to `console.warn` for video load errors
- Added detailed error information including src, error, networkState, and readyState
- Added proper fallback image handling when videos fail to load

### 2. Enhanced Video Detection
- Improved `isVideoPost` function to check multiple conditions:
  - `featuredMedia.type === 'video'`
  - `featuredMedia.url` contains video extension
  - `featuredImage.url` contains video extension (legacy support)

### 3. Added Loading States
- Added loading placeholder for videos
- Added proper loading event handlers (`onLoadStart`, `onLoadedData`)
- Hide loading placeholder when video loads successfully

### 4. Enhanced Debugging
- Added comprehensive logging for video post detection
- Added debug information for video URL transformation
- Added fallback image for video posts

## Debugging Steps

### 1. Check Console Logs
Look for these log messages in the browser console:
- "Video post detected:" - Shows which posts are detected as videos
- "Video loading started:" - Shows when video loading begins
- "Video loaded successfully:" - Shows when video loads successfully
- "Video load error, falling back to image:" - Shows when video fails

### 2. Test Video URLs Manually
Run the test script to check if video URLs are accessible:
```bash
node test-video-urls.js
```

### 3. Check Network Tab
1. Open browser DevTools
2. Go to Network tab
3. Filter by "Media" or "XHR"
4. Look for failed video requests
5. Check the response status and headers

### 4. Verify Video Files Exist
Check if the video files actually exist in the uploads folder:
```bash
ls -la Admin-panel-backend/uploads/*.mp4
```

### 5. Test Media Serving Endpoint
Test the media serving endpoint directly:
```bash
curl -I http://localhost:5000/api/v1/media/serve/[filename].mp4
```

## Common Issues and Solutions

### Issue 1: Video URLs Not Transformed Correctly
**Symptoms**: Video URLs still point to localhost:3002
**Solution**: Check the URL transformation logic in `getMediaUrl` function

### Issue 2: Video Files Don't Exist
**Symptoms**: 404 errors in network tab
**Solution**: Verify files exist in uploads folder and have correct permissions

### Issue 3: CORS Issues
**Symptoms**: CORS errors in console
**Solution**: Check CORS headers in media serving endpoint

### Issue 4: Wrong MIME Type
**Symptoms**: Video loads but doesn't play
**Solution**: Check Content-Type headers in media serving endpoint

### Issue 5: Video Detection Not Working
**Symptoms**: Videos not detected as videos
**Solution**: Check the `isVideoPost` function logic and data structure

## Testing Commands

### Test Video Detection
```bash
node debug-video-posts.js
```

### Test Video URLs
```bash
node test-video-urls.js
```

### Test API Endpoint
```bash
curl -X GET "http://localhost:5000/api/v1/posts?limit=5&status=published" | jq '.data[] | select(.featuredMedia.type == "video")'
```

## Expected Behavior

1. **Video Posts**: Should show video element with loading placeholder
2. **Image Posts**: Should show image element
3. **Failed Videos**: Should fall back to image
4. **Loading States**: Should show loading placeholder while video loads
5. **Error Handling**: Should gracefully handle errors and show fallback

## Next Steps

1. Run the debugging steps above
2. Check the console logs for detailed information
3. Verify video files exist and are accessible
4. Test the media serving endpoint
5. Check for any CORS or MIME type issues


