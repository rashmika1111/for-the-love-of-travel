# Dynamic Parallax Scrolling Content Page Setup

## Overview

The parallax scrolling content page has been updated to work dynamically with the Article with Images editor from the CMS. Instead of hardcoded content and images, the page now uses data from the CMS to create the parallax scrolling effect.

## How It Works

### 1. CMS Integration
- The system now looks for an "Article with Images" section in the content sections
- This section contains:
  - **Title**: Article title displayed in the parallax section
  - **Content**: Rich text content that gets parsed into scrollable chunks
  - **Pinned Image**: Main background image that stays fixed
  - **Changing Images**: Array of images that crossfade as you scroll
  - **Layout Settings**: Controls which images are shown
  - **Animation Settings**: Controls scroll animations

### 2. Dynamic Image Crossfade
- Images are automatically sorted by their `order` property
- The pinned image and changing images are combined into a single crossfade sequence
- Images transition smoothly based on scroll progress
- Uses the same smoothstep easing function for natural transitions

### 3. Content Parsing
- Article content is automatically parsed into scrollable chunks
- Paragraphs are intelligently grouped to create smooth scrolling sections
- Each chunk is wrapped with Framer Motion animations
- Content respects the animation settings from the CMS

## Usage in Admin Panel

### Creating a Parallax Article Section

1. **Go to Content Builder** in the admin panel
2. **Add a new section** and select "Article with Images"
3. **Configure the section**:

   **Content Tab:**
   - Add your article title
   - Add rich text content (this will be parsed into scrollable chunks)

   **Images Tab:**
   - **Pinned Image**: Upload the main background image
   - **Changing Images**: Upload 2-3 additional images for crossfade effect
   - Set proper alt text and captions for accessibility

   **Layout Tab:**
   - **Image Size**: Choose small, medium, or large
   - **Show Pinned Image**: Enable/disable the pinned image
   - **Show Changing Images**: Enable/disable the changing images

   **Animation Tab:**
   - **Enabled**: Turn animations on/off
   - **Type**: Choose fadeIn, slideUp, or none
   - **Duration**: Set animation duration (0.1-3 seconds)
   - **Delay**: Set animation delay (0-2 seconds)

### Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 1920x1080 or higher for best quality
- **Aspect Ratio**: 16:9 works best for the full-screen effect
- **File Size**: Keep under 2MB for optimal performance

### Content Guidelines

- **Title**: Keep it concise and engaging
- **Content**: Write in paragraphs for best chunking results
- **Length**: 3-5 paragraphs work well for the scrolling effect
- **Images**: 3-4 images total (1 pinned + 2-3 changing) create the best crossfade effect

## Technical Implementation

### Files Modified/Created

1. **`DynamicPinnedImageOverlay.jsx`** - New dynamic component
2. **`ContentPageClient.tsx`** - Updated to use dynamic data
3. **`ContentSectionsRenderer.tsx`** - Handles fallback rendering

### Key Features

- **Responsive Design**: Different layouts for mobile and desktop
- **Accessibility**: Respects `prefers-reduced-motion`
- **Performance**: Uses `requestAnimationFrame` for smooth animations
- **Image Optimization**: Automatically normalizes image URLs
- **Error Handling**: Graceful fallbacks when data is missing

### Data Structure

```typescript
interface ArticleWithImageSection {
  type: 'article';
  title?: string;
  content?: string;
  changingImages?: Array<{
    url: string;
    altText?: string;
    caption?: string;
    order?: number;
  }>;
  pinnedImage?: {
    url: string;
    altText?: string;
    caption?: string;
  };
  layout?: {
    imageSize?: 'small' | 'medium' | 'large';
    showPinnedImage?: boolean;
    showChangingImages?: boolean;
  };
  animation?: {
    enabled?: boolean;
    type?: 'fadeIn' | 'slideUp' | 'none';
    duration?: number;
    delay?: number;
  };
}
```

## Fallback Behavior

- If no "Article with Images" section is found, the parallax section won't render
- If images are missing, the component gracefully handles the empty state
- If content is missing, a default message is shown
- The regular article section rendering still works as a fallback

## Performance Considerations

- Images are lazy-loaded for better performance
- Scroll events are throttled using `requestAnimationFrame`
- CSS transforms are used for hardware acceleration
- Reduced motion preferences are respected

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Mobile browsers with touch scroll support
- Graceful degradation for older browsers

## Troubleshooting

### Common Issues

1. **Images not showing**: Check that image URLs are valid and accessible
2. **Content not parsing**: Ensure content is valid HTML
3. **Animations not working**: Check if `prefers-reduced-motion` is enabled
4. **Scroll not working**: Verify that the section has enough content to scroll

### Debug Mode

Add `console.log` statements in the component to debug:
- Image list generation
- Content chunking
- Scroll progress calculation

## Future Enhancements

- Support for video backgrounds
- More animation types
- Custom scroll triggers
- Advanced image effects (blur, zoom, etc.)
- Integration with analytics for scroll tracking





