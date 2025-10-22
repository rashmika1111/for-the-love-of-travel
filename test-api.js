// Simple API test script
const API_BASE_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    console.log('🧪 Testing API connection...');
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);
    
    // Test posts endpoint
    const postsResponse = await fetch(`${API_BASE_URL}/api/posts?limit=2`);
    const postsData = await postsResponse.json();
    
    if (postsData.success) {
      console.log('✅ Posts API working');
      console.log(`📝 Found ${postsData.data.length} posts`);
      
      if (postsData.data.length > 0) {
        const firstPost = postsData.data[0];
        console.log('📄 Sample post data:');
        console.log('  - Title:', firstPost.title);
        console.log('  - Category:', firstPost.categories?.[0]?.name || 'No category');
        console.log('  - Featured Image:', firstPost.featuredImage?.url || 'No image');
        console.log('  - Reading Time:', firstPost.readingTimeText || 'No reading time');
        console.log('  - Published Date:', firstPost.formattedPublishedDate || 'No date');
      }
    } else {
      console.log('❌ Posts API failed:', postsData.message);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('💡 Make sure the backend is running on port 5000');
  }
}

testAPI();

