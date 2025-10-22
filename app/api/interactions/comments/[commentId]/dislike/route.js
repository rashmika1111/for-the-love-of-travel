import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function POST(request, { params }) {
  try {
    const { commentId } = await params;
    
    console.log('Dislike API called for comment:', commentId);
    
    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/interactions/comments/${commentId}/dislike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Dislike comment API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to dislike comment' },
      { status: 500 }
    );
  }
}
