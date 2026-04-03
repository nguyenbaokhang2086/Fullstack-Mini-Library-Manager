import express from 'express';
import { create, getAll, getDetail, update, remove } from '../controllers/bookController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Quản lý danh mục sách
 */

// GET  /api/books
router.get('/', getAll);

// GET  /api/books/:id
router.get('/:id', getDetail);

// POST /api/books
router.post('/', create);

// PUT  /api/books/:id
router.put('/:id', update);

// DELETE /api/books/:id
router.delete('/:id', remove);

export default router;
