const http = require('http');

function testContentAPI() {
  console.log('Testing API for content field...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/posts?limit=2&status=published',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        if (response.success && response.data.length > 0) {
          console.log('\n=== API Response Analysis ===');
          console.log('Number of posts:', response.data.length);
          
          response.data.forEach((post, index) => {
            console.log(`\n--- Post ${index + 1}: ${post.title} ---`);
            console.log('Available fields:', Object.keys(post));
            console.log('Has body field:', 'body' in post);
            console.log('Body value:', post.body ? post.body.substring(0, 100) + '...' : 'NO BODY');
            console.log('Has excerpt field:', 'excerpt' in post);
            console.log('Excerpt value:', post.excerpt || 'NO EXCERPT');
            console.log('Has description field:', 'description' in post);
            console.log('Description value:', post.description || 'NO DESCRIPTION');
          });
        } else {
          console.log('API call failed or no data returned');
        }
      } catch (error) {
        console.error('Error parsing response:', error);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error testing API:', error);
  });

  req.end();
}

testContentAPI();
