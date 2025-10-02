import { Injectable, NotFoundException } from '@nestjs/common';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  // Mock data - ในโปรเจคจริงจะใช้ database
  private users: User[] = [
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

  findAll(page: number = 1, limit: number = 10) {
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

  findOne(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      success: true,
      data: user,
    };
  }

  create(createUserDto: any) {
    const newUser: User = {
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

  update(id: string, updateUserDto: any) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
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

  remove(id: string) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(userIndex, 1);
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
