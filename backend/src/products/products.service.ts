import { Injectable, NotFoundException } from '@nestjs/common';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  createdAt: Date;
}

@Injectable()
export class ProductsService {
  // Mock data - ในโปรเจคจริงจะใช้ database
  private products: Product[] = [
    {
      id: '1',
      name: 'แล็ปท็อป Dell XPS 13',
      price: 45900,
      category: 'electronics',
      stock: 15,
      description: 'แล็ปท็อปสเปคสูง CPU Intel Core i7',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      price: 42900,
      category: 'electronics',
      stock: 25,
      description: 'สมาร์ทโฟนรุ่นล่าสุดจาก Apple',
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'เสื้อยืด Cotton 100%',
      price: 299,
      category: 'fashion',
      stock: 50,
      description: 'เสื้อยืดคุณภาพดี สวมใส่สบาย',
      createdAt: new Date(),
    },
    {
      id: '4',
      name: 'กางเกงยีนส์',
      price: 899,
      category: 'fashion',
      stock: 30,
      description: 'กางเกงยีนส์ทรงสวย ใส่ทนาน',
      createdAt: new Date(),
    },
  ];

  findAll(category?: string, search?: string) {
    let filtered = this.products;

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return {
      success: true,
      data: filtered,
      total: filtered.length,
    };
  }

  findOne(id: string) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return {
      success: true,
      data: product,
    };
  }

  create(createProductDto: any) {
    const newProduct: Product = {
      id: (this.products.length + 1).toString(),
      name: createProductDto.name,
      price: createProductDto.price,
      category: createProductDto.category,
      stock: createProductDto.stock || 0,
      description: createProductDto.description || '',
      createdAt: new Date(),
    };
    this.products.push(newProduct);
    return {
      success: true,
      data: newProduct,
      message: 'Product created successfully',
    };
  }

  update(id: string, updateProductDto: any) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateProductDto,
    };
    return {
      success: true,
      data: this.products[productIndex],
      message: 'Product updated successfully',
    };
  }

  remove(id: string) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(productIndex, 1);
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}
