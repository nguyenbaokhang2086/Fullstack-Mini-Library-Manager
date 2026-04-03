import Borrowing from '../models/borrowingModel.js';
import Book from '../models/bookModel.js';
import mongoose from 'mongoose';

// 1. Lấy tất cả Borrowings
export const getAllBorrowings = async () => {
  return await Borrowing.find().populate('bookId', 'title').sort({ createdAt: -1 });
};

// 2. Lấy 1 Borrowing theo ID
export const getBorrowingById = async (id) => {
  return await Borrowing.findById(id).populate('bookId', 'title');
};

// 3. Tạo record mượn sách
export const createBorrowing = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const book = await Book.findById(data.bookId).session(session);
    if (!book) {
      throw new Error('Sách không tồn tại');
    }

    // Business rule 1: Không cho mượn khi hết sách
    if (book.availableStock <= 0) {
      throw new Error('Sách đã hết, không thể mượn');
    }

    // Business rule 2: Mỗi lần mượn -> giảm availableStock
    book.availableStock -= 1;
    await book.save({ session });

    const borrowing = await Borrowing.create([data], { session });

    await session.commitTransaction();
    return borrowing[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// 4. Trả sách
export const returnBook = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const borrowing = await Borrowing.findById(id).session(session);
    if (!borrowing) {
      throw new Error('Bản ghi mượn sách không tồn tại');
    }

    if (borrowing.status === 'RETURNED') {
      throw new Error('Sách này đã được trả trước đó');
    }

    const book = await Book.findById(borrowing.bookId).session(session);
    if (!book) {
      throw new Error('Sách không tồn tại trong hệ thống');
    }

    // Business rule 3: Trả sách -> tăng lại availableStock
    book.availableStock += 1;
    await book.save({ session });

    borrowing.status = 'RETURNED';
    borrowing.returnDate = new Date();
    await borrowing.save({ session });

    await session.commitTransaction();
    return borrowing;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
