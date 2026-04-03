import * as authorService from '../services/authorService.js';
import { success, error } from '../utils/response.js';

// ─────────────────────────────────────────────
// [POST] /api/authors
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Tạo tác giả mới
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       500:
 *         description: Lỗi server
 */
export const create = async (req, res) => {
  try {
    const author = await authorService.createAuthor(req.body);
    return success(res, 'Tạo tác giả thành công', author, 201);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi tạo tác giả', 500, err.message);
  }
};

// ─────────────────────────────────────────────
// [GET] /api/authors
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Lấy danh sách tất cả tác giả
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Danh sách tác giả
 */
export const getAll = async (req, res) => {
  try {
    const authors = await authorService.getAllAuthors();
    return success(res, 'Lấy danh sách tác giả thành công', authors);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi lấy danh sách tác giả', 500, err.message);
  }
};

// ─────────────────────────────────────────────
// [GET] /api/authors/:id
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Lấy chi tiết một tác giả
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Chi tiết tác giả
 *       404:
 *         description: Không tìm thấy
 */
export const getDetail = async (req, res) => {
  try {
    const author = await authorService.getAuthorById(req.params.id);
    if (!author) return error(res, 'Không tìm thấy tác giả', 404);
    return success(res, 'Lấy chi tiết tác giả thành công', author);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi lấy chi tiết tác giả', 500, err.message);
  }
};

// ─────────────────────────────────────────────
// [PUT] /api/authors/:id
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Cập nhật thông tin tác giả
 *     tags: [Authors]
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
    const author = await authorService.updateAuthor(req.params.id, req.body);
    if (!author) return error(res, 'Không tìm thấy tác giả để cập nhật', 404);
    return success(res, 'Cập nhật thành công', author);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi cập nhật tác giả', 500, err.message);
  }
};

// ─────────────────────────────────────────────
// [DELETE] /api/authors/:id
// ─────────────────────────────────────────────
/**
 * @swagger
 * /api/authors/{id}:
 *   delete:
 *     summary: Xóa tác giả
 *     tags: [Authors]
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
 *         description: Lỗi nghiệp vụ (đang có sách)
 */
export const remove = async (req, res) => {
  try {
    const author = await authorService.deleteAuthor(req.params.id);
    if (!author) return error(res, 'Không tìm thấy tác giả để xóa', 404);
    return success(res, 'Xóa tác giả thành công');
  } catch (err) {
    return error(res, err.message, 400); 
  }
};

