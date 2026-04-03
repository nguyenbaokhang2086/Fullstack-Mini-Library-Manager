import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - authorId
 *         - totalStock
 *         - availableStock
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của book
 *         title:
 *           type: string
 *           description: Tên sách
 *         authorId:
 *           type: string
 *           description: Liên kết author
 *         totalStock:
 *           type: number
 *           description: Tổng số sách
 *         availableStock:
 *           type: number
 *           description: Số sách còn có thể mượn
 *         publishedYear:
 *           type: number
 *           description: Năm xuất bản
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tên sách là bắt buộc'],
    trim: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: [true, 'Liên kết author là bắt buộc'],
  },
  totalStock: {
    type: Number,
    required: [true, 'Tổng số sách là bắt buộc'],
    min: [0, 'Số lượng không được âm'],
  },
  availableStock: {
    type: Number,
    required: [true, 'Số sách còn có thể mượn là bắt buộc'],
    min: [0, 'Số lượng không được âm'],
  },
  publishedYear: {
    type: Number,
  },
}, {
  timestamps: true,
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
