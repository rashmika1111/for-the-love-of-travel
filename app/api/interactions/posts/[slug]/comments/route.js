import { NextResponse } from 'next/server';

const WEBSITE_BACKEND_URL = process.env.WEBSITE_BACKEND_URL || 'http://localhost:3000';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    
    // Forward the request to the website backend
    const queryString = searchParams.toString();
    const backendUrl = `${WEBSITE_BACKEND_URL}/api/interactions/posts/${slug}/comments${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    // Forward the request to the website backend
    const backendUrl = `${WEBSITE_BACKEND_URL}/api/interactions/posts/${slug}/comments`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error submitting comment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit comment' },
      { status: 500 }
    );
  }
}
