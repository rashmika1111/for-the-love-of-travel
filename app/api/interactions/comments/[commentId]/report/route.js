import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function POST(request, { params }) {
  try {
    const { commentId } = await params;
    const body = await request.json();
    
    console.log('Report API called for comment:', commentId, 'with reason:', body.reason);
    
    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/interactions/comments/${commentId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: body.reason,
        description: body.description
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Report successful:', data);
    } else {
      console.error('Report failed:', data);
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Report comment API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to report comment' },
      { status: 500 }
    );
  }
}
