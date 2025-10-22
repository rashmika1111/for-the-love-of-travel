// Debug script to test video post detection
const testPosts = [
  {
    _id: 'test1',
    title: 'Video Post Test 1',
    featuredMedia: {
      type: 'video',
      url: 'http://localhost:5000/api/v1/media/serve/video1.mp4'
    },
    featuredImage: null
  },
  {
    _id: 'test2',
    title: 'Video Post Test 2',
    featuredMedia: {
      url: 'http://localhost:5000/api/v1/media/serve/video2.mp4'
    },
    featuredImage: null
  },
  {
    _id: 'test3',
    title: 'Image Post Test',
    featuredMedia: {
      type: 'image',
      url: 'http://localhost:5000/api/v1/media/serve/image1.jpg'
    },
    featuredImage: null
  },
  {
    _id: 'test4',
    title: 'Legacy Video Post',
    featuredMedia: null,
    featuredImage: {
      url: 'http://localhost:5000/api/v1/media/serve/legacy-video.mp4'
    }
  }
];

// Helper functions (copied from component)
const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('.avi');
};

const isVideoPost = (post) => {
  // Check if featuredMedia indicates it's a video
  const isVideoFromMedia = post.featuredMedia && post.featuredMedia.type === 'video';
  
  // Check if featuredMedia URL is a video (even if type is not set)
  const isVideoFromMediaUrl = post.featuredMedia && post.featuredMedia.url && isVideoUrl(post.featuredMedia.url);
  
  // Check if featuredImage URL is a video (fallback for older posts)
  const isVideoFromImage = post.featuredImage && post.featuredImage.url && isVideoUrl(post.featuredImage.url);
  
  return isVideoFromMedia || isVideoFromMediaUrl || (!post.featuredMedia && isVideoFromImage);
};

const getMediaUrl = (post) => {
  // First check featuredMedia.url (this is the correct/current media)
  if (post.featuredMedia && post.featuredMedia.url) {
    return post.featuredMedia.url;
  }
  // Then check featuredImage (fallback for older posts)
  if (post.featuredImage && typeof post.featuredImage === 'string' && post.featuredImage.trim() !== '') {
    return post.featuredImage;
  }
  if (post.featuredImage && post.featuredImage.url) {
    return post.featuredImage.url;
  }
  // Fallback to a proper image that exists
  return '/images/3969146248009e641f454298f62e13de84ac0a09.jpg';
};

// Test each post
console.log('=== VIDEO POST DETECTION TEST ===');
testPosts.forEach((post, index) => {
  const mediaUrl = getMediaUrl(post);
  const isVideo = isVideoPost(post);
  const videoUrl = isVideo ? mediaUrl : null;
  const imageUrl = !isVideo ? mediaUrl : null;
  
  console.log(`\nPost ${index + 1}: ${post.title}`);
  console.log('  featuredMedia:', post.featuredMedia);
  console.log('  featuredImage:', post.featuredImage);
  console.log('  mediaUrl:', mediaUrl);
  console.log('  isVideo:', isVideo);
  console.log('  videoUrl:', videoUrl);
  console.log('  imageUrl:', imageUrl);
});

console.log('\n=== TEST COMPLETE ===');


