import express from 'express';
import { create, getAll, getDetail, update, remove } from '../controllers/authorController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Quản lý tác giả
 */

// GET  /api/authors
router.get('/', getAll);

// GET  /api/authors/:id
router.get('/:id', getDetail);

// POST /api/authors
router.post('/', create);

// PUT  /api/authors/:id
router.put('/:id', update);

// DELETE /api/authors/:id
router.delete('/:id', remove);

export default router;
