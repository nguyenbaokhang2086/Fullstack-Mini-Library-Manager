import express from 'express';
import { create, getAll, getDetail, returnBook } from '../controllers/borrowingController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Borrowings
 *   description: Quản lý mượn trả sách
 */

// GET /api/borrowings - Lấy danh sách record mượn
router.get('/', getAll);

// POST /api/borrowings - Tạo record mượn sách
router.post('/', create);

// PUT /api/borrowings/:id/return - Trả sách
router.put('/:id/return', returnBook);

// GET /api/borrowings/:id - Chi tiết borrowing
router.get('/:id', getDetail);

export default router;
