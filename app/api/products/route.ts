import { NextRequest, NextResponse } from 'next/server';

// GET /api/products - ดึงรายการสินค้า
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // TODO: ดึงข้อมูลจาก database
    const products = [
      {
        id: '1',
        name: 'แล็ปท็อป Dell XPS 13',
        price: 45900,
        category: 'electronics',
        stock: 15,
        description: 'แล็ปท็อปสเปคสูง',
      },
      {
        id: '2',
        name: 'iPhone 15 Pro',
        price: 42900,
        category: 'electronics',
        stock: 25,
        description: 'สมาร์ทโฟนรุ่นล่าสุด',
      },
      {
        id: '3',
        name: 'เสื้อยืด Cotton 100%',
        price: 299,
        category: 'fashion',
        stock: 50,
        description: 'เสื้อยืดคุณภาพดี',
      },
    ];

    let filtered = products;

    // Filter by category
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Search by name
    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/products - สร้างสินค้าใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, stock, description } = body;

    // Validation
    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: บันทึกลง database
    const newProduct = {
      id: Date.now().toString(),
      name,
      price,
      category,
      stock: stock || 0,
      description: description || '',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: 'Product created successfully',
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

