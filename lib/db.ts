// Database connection utilities
// Add your MySQL connection here

// Example using mysql2 package (you'll need to install it)
// import mysql from 'mysql2/promise';

// export async function getConnection() {
//   const connection = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT) || 3306,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   });
//   return connection;
// }

// Example using Prisma (recommended)
// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export {};

