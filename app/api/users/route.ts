import { NextRequest, NextResponse } from 'next/server';

// GET /api/users - ดึงรายการ users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // TODO: ดึงข้อมูลจาก database
    const users = [
      { id: '1', name: 'สมชาย ใจดี', email: 'somchai@example.com', role: 'user' },
      { id: '2', name: 'สมหญิง ใจงาม', email: 'somying@example.com', role: 'admin' },
      { id: '3', name: 'จอห์น โด', email: 'john@example.com', role: 'user' },
    ];

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: users.length,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/users - สร้าง user ใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: บันทึกลง database
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: role || 'user',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: 'User created successfully',
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

