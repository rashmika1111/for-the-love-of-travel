// Test script to verify video URLs are accessible
const fetch = require('node-fetch');

async function testVideoUrls() {
  const testUrls = [
    'http://localhost:5000/api/v1/media/serve/video1.mp4',
    'http://localhost:5000/api/v1/media/serve/video2.mp4',
    'http://localhost:5000/api/v1/media/serve/1760549607585-563035590.mp4', // From uploads folder
    'http://localhost:5000/api/v1/media/serve/1760549674248-471474198.mp4', // From uploads folder
  ];

  console.log('Testing video URL accessibility...\n');

  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`  Status: ${response.status}`);
      console.log(`  Content-Type: ${response.headers.get('content-type')}`);
      console.log(`  Content-Length: ${response.headers.get('content-length')}`);
      console.log(`  CORS Headers: ${response.headers.get('access-control-allow-origin')}`);
      console.log('  ✅ Accessible\n');
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
  }
}

testVideoUrls();


