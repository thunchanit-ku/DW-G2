import { NextRequest, NextResponse } from 'next/server';

// Example API route
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    // Your API logic here
    const data = {
      message: 'Hello from API',
      query: query || 'no query',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Your API logic here
    const data = {
      message: 'Data received',
      received: body,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

