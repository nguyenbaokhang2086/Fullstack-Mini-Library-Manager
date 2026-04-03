import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Borrowing:
 *       type: object
 *       required:
 *         - bookId
 *         - borrowerName
 *         - borrowDate
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: ID borrowing
 *         bookId:
 *           type: string
 *           description: Sách được mượn
 *         borrowerName:
 *           type: string
 *           description: Người mượn
 *         borrowDate:
 *           type: string
 *           format: date
 *           description: Ngày mượn
 *         returnDate:
 *           type: string
 *           format: date
 *           description: Ngày trả
 *         status:
 *           type: string
 *           enum: [BORROWED, RETURNED]
 *           description: Trạng thái
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const borrowingSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Sách được mượn là bắt buộc'],
  },
  borrowerName: {
    type: String,
    required: [true, 'Người mượn là bắt buộc'],
    trim: true,
  },
  borrowDate: {
    type: Date,
    required: [true, 'Ngày mượn là bắt buộc'],
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: {
      values: ['BORROWED', 'RETURNED'],
      message: '{VALUE} không hợp lệ. Chỉ chấp nhận BORROWED hoặc RETURNED',
    },
    default: 'BORROWED',
    required: [true, 'Trạng thái là bắt buộc'],
  },
}, {
  timestamps: true,
});

const Borrowing = mongoose.model('Borrowing', borrowingSchema);
export default Borrowing;
