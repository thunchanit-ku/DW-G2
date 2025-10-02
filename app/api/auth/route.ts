import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth - Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // TODO: ตรวจสอบกับ database
    // TODO: สร้าง JWT token
    
    // Demo response
    if (email === 'admin@example.com' && password === 'password') {
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'admin',
          },
          token: 'demo-jwt-token-' + Date.now(),
        },
        message: 'Login successful',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

