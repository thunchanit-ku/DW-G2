"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
let UsersService = class UsersService {
    users = [
        {
            id: '1',
            name: 'สมชาย ใจดี',
            email: 'somchai@example.com',
            role: 'user',
            createdAt: new Date(),
        },
        {
            id: '2',
            name: 'สมหญิง ใจงาม',
            email: 'somying@example.com',
            role: 'admin',
            createdAt: new Date(),
        },
        {
            id: '3',
            name: 'จอห์น โด',
            email: 'john@example.com',
            role: 'user',
            createdAt: new Date(),
        },
    ];
    findAll(page = 1, limit = 10) {
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedUsers = this.users.slice(start, end);
        return {
            success: true,
            data: paginatedUsers,
            pagination: {
                page,
                limit,
                total: this.users.length,
                totalPages: Math.ceil(this.users.length / limit),
            },
        };
    }
    findOne(id) {
        const user = this.users.find((u) => u.id === id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return {
            success: true,
            data: user,
        };
    }
    create(createUserDto) {
        const newUser = {
            id: (this.users.length + 1).toString(),
            name: createUserDto.name,
            email: createUserDto.email,
            role: createUserDto.role || 'user',
            createdAt: new Date(),
        };
        this.users.push(newUser);
        return {
            success: true,
            data: newUser,
            message: 'User created successfully',
        };
    }
    update(id, updateUserDto) {
        const userIndex = this.users.findIndex((u) => u.id === id);
        if (userIndex === -1) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updateUserDto,
        };
        return {
            success: true,
            data: this.users[userIndex],
            message: 'User updated successfully',
        };
    }
    remove(id) {
        const userIndex = this.users.findIndex((u) => u.id === id);
        if (userIndex === -1) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        this.users.splice(userIndex, 1);
        return {
            success: true,
            message: 'User deleted successfully',
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map