import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Add a test report
    const testReport = {
      commentId: body.commentId || '68ecc7c6609ea85d2b82bc82', // Use one of the actual comment IDs
      reason: body.reason || 'spam',
      description: body.description || 'Test report'
    };
    
    // Store the report via the admin reports API
    const reportResponse = await fetch(`${request.nextUrl.origin}/api/admin/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testReport)
    });
    
    if (reportResponse.ok) {
      const reportData = await reportResponse.json();
      return NextResponse.json({
        success: true,
        message: 'Test report added successfully',
        data: reportData
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to add test report'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error adding test report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add test report' },
      { status: 500 }
    );
  }
}
