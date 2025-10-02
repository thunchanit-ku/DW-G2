export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
}
export declare class UsersService {
    private users;
    findAll(page?: number, limit?: number): {
        success: boolean;
        data: User[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
    findOne(id: string): {
        success: boolean;
        data: User;
    };
    create(createUserDto: any): {
        success: boolean;
        data: User;
        message: string;
    };
    update(id: string, updateUserDto: any): {
        success: boolean;
        data: User;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        message: string;
    };
}
