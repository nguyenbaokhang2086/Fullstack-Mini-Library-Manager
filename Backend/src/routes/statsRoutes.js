import express from 'express';
import { getOverview, getTopBooks, getBorrowStatus } from '../controllers/statsController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Thống kê dữ liệu hệ thống
 */

// GET /api/stats/overview - Tổng số sách, authors, borrow
router.get('/overview', getOverview);

// GET /api/stats/top-books - Top sách được mượn nhiều
router.get('/top-books', getTopBooks);

// GET /api/stats/borrow-status - Số lượng đang mượn vs đã trả
router.get('/borrow-status', getBorrowStatus);

export default router;
