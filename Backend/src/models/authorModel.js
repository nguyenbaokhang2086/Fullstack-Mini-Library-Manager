import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của author
 *         name:
 *           type: string
 *           description: Tên tác giả
 *         bio:
 *           type: string
 *           description: Mô tả ngắn
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Ngày sinh
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên tác giả là bắt buộc'],
    trim: true,
  },
  bio: {
    type: String,
    default: '',
  },
  birthDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Author = mongoose.model('Author', authorSchema);
export default Author;
