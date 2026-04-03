import * as borrowingService from '../services/borrowingService.js';
import { success, error } from '../utils/response.js';

// ─────────────────────────────────────────────
// [POST] /api/borrowings
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/borrowings:
 *   post:
 *     summary: Tạo record mượn sách
 *     tags: [Borrowings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookId, borrowerName]
 *             properties:
 *               bookId:
 *                 type: string
 *               borrowerName:
 *                 type: string
 *               borrowDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Hết sách hoặc lỗi dữ liệu
 */
export const create = async (req, res) => {
  try {
    const borrowing = await borrowingService.createBorrowing(req.body);
    return success(res, 'Mượn sách thành công', borrowing, 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

// ─────────────────────────────────────────────
// [GET] /api/borrowings
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/borrowings:
 *   get:
 *     summary: Lấy danh sách borrow
 *     tags: [Borrowings]
 *     responses:
 *       200:
 *         description: Danh sách
 */
export const getAll = async (req, res) => {
  try {
    const borrowings = await borrowingService.getAllBorrowings();
    return success(res, 'Lấy danh sách borrowing thành công', borrowings);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi lấy danh sách borrowing', 500, err.message);
  }
};

// ─────────────────────────────────────────────
// [PUT] /api/borrowings/:id/return
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/borrowings/{id}/return:
 *   put:
 *     summary: Trả sách
 *     tags: [Borrowings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Trả sách thành công
 */
export const returnBook = async (req, res) => {
  try {
    const borrowing = await borrowingService.returnBook(req.params.id);
    return success(res, 'Trả sách thành công', borrowing);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

// ─────────────────────────────────────────────
// [GET] /api/borrowings/:id
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/borrowings/{id}:
 *   get:
 *     summary: Chi tiết borrowing
 *     tags: [Borrowings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Chi tiết
 */
export const getDetail = async (req, res) => {
  try {
    const borrowing = await borrowingService.getBorrowingById(req.params.id);
    if (!borrowing) return error(res, 'Không tìm thấy record mượn sách', 404);
    return success(res, 'Lấy chi tiết borrowing thành công', borrowing);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi lấy chi tiết borrowing', 500, err.message);
  }
};

