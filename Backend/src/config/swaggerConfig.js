import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lumina Library — API Documentation',
      version: '2.0.0',
      description: `
## 📚 Lumina Mini Library Manager API

REST API cho hệ thống quản lý thư viện, bao gồm:
- **Authors** — CRUD tác giả
- **Books** — CRUD danh mục sách
- **Users** — Quản lý người dùng
- **Projects** — Quản lý dự án

> Dùng nút **"Try it out"** để test trực tiếp trên URL thật.
      `,
      contact: {
        name: 'Lumina Library Team',
      },
    },
    servers: [
      {
        // Đọc từ .env — đảm bảo "Try it out" gọi đúng URL (không phải localhost khi đã deploy)
        url: process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3001}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
  },
  // Quét tất cả route files để lấy @swagger annotations
  apis: ['./src/routes/*.js', './src/controllers/*.js', './src/models/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;