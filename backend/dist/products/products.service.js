"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
let ProductsService = class ProductsService {
    products = [
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
    findAll(category, search) {
        let filtered = this.products;
        if (category) {
            filtered = filtered.filter((p) => p.category === category);
        }
        if (search) {
            filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        return {
            success: true,
            data: filtered,
            total: filtered.length,
        };
    }
    findOne(id) {
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return {
            success: true,
            data: product,
        };
    }
    create(createProductDto) {
        const newProduct = {
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
    update(id, updateProductDto) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
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
    remove(id) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        this.products.splice(productIndex, 1);
        return {
            success: true,
            message: 'Product deleted successfully',
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map