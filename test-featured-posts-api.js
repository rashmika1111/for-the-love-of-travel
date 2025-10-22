// Test script to verify the featured posts API endpoint
const fetch = require('node-fetch');

async function testFeaturedPostsAPI() {
  try {
    console.log('Testing Featured Posts API...');
    
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${base}/api/v1/posts?limit=7&status=published&sortBy=publishedAt&sortOrder=desc&t=${Date.now()}`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`✅ API call successful! Found ${data.data.length} posts`);
      data.data.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title} - ${post.status}`);
      });
    } else {
      console.log('❌ API call failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testFeaturedPostsAPI();


