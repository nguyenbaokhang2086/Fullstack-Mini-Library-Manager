import * as bookService from '../services/bookService.js';
import { success, error } from '../utils/response.js';

// ─────────────────────────────────────────────
// [POST] /api/books
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Thêm sách mới vào danh mục
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, authorId, totalStock]
 *             properties:
 *               title:
 *                 type: string
 *               authorId:
 *                 type: string
 *               totalStock:
 *                 type: number
 *               availableStock:
 *                 type: number
 *               publishedYear:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       500:
 *         description: Lỗi server
 */
export const create = async (req, res) => {
  try {
    const book = await bookService.createBook(req.body);
    return success(res, 'Thêm sách thành công', book, 201);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi thêm sách', 500, err.message);
  }
};

// ─────────────────────────────────────────────
// [GET] /api/books
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Lấy danh sách tất cả sách
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Danh sách sách
 */
export const getAll = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    return success(res, 'Lấy danh sách sách thành công', books);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi lấy danh sách sách', 500, err.message);
  }
};

// ─────────────────────────────────────────────
// [GET] /api/books/:id
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Lấy chi tiết một cuốn sách
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Chi tiết sách
 *       404:
 *         description: Không tìm thấy
 */
export const getDetail = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) return error(res, 'Không tìm thấy sách', 404);
    return success(res, 'Lấy chi tiết sách thành công', book);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi lấy chi tiết sách', 500, err.message);
  }
};

// ─────────────────────────────────────────────
// [PUT] /api/books/:id
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Cập nhật thông tin sách
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy
 */
export const update = async (req, res) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    if (!book) return error(res, 'Không tìm thấy sách để cập nhật', 404);
    return success(res, 'Cập nhật thành công', book);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi cập nhật sách', 500, err.message);
  }
};

// ─────────────────────────────────────────────
// [DELETE] /api/books/:id
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Xóa sách khỏi danh mục
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy
 *       400:
 *         description: Lỗi nghiệp vụ (đang có người mượn)
 */
export const remove = async (req, res) => {
  try {
    const book = await bookService.deleteBook(req.params.id);
    if (!book) return error(res, 'Không tìm thấy sách để xóa', 404);
    return success(res, 'Xóa sách thành công');
  } catch (err) {
    return error(res, err.message, 400); 
  }
};

