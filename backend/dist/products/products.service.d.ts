export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    description: string;
    createdAt: Date;
}
export declare class ProductsService {
    private products;
    findAll(category?: string, search?: string): {
        success: boolean;
        data: Product[];
        total: number;
    };
    findOne(id: string): {
        success: boolean;
        data: Product;
    };
    create(createProductDto: any): {
        success: boolean;
        data: Product;
        message: string;
    };
    update(id: string, updateProductDto: any): {
        success: boolean;
        data: Product;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        message: string;
    };
}
