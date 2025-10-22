import { NextResponse } from 'next/server';

// Simple in-memory storage for reports (in production, this would be a database)
let reports = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    
    console.log('GET /api/admin/reports - All reports:', reports);
    console.log('GET /api/admin/reports - Requested commentId:', commentId);
    
    let filteredReports = reports;
    if (commentId) {
      filteredReports = reports.filter(report => report.commentId === commentId);
    }
    
    console.log('GET /api/admin/reports - Filtered reports:', filteredReports);
    
    return NextResponse.json({
      success: true,
      data: filteredReports,
      total: filteredReports.length
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('POST /api/admin/reports - Received body:', body);
    
    const report = {
      id: `report_${Date.now()}`,
      commentId: body.commentId,
      reason: body.reason,
      description: body.description,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    reports.push(report);
    
    console.log('POST /api/admin/reports - Stored report:', report);
    console.log('POST /api/admin/reports - All reports now:', reports);
    
    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create report' },
      { status: 500 }
    );
  }
}
