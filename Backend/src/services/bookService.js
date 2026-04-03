import Book from '../models/bookModel.js';
import Borrowing from '../models/borrowingModel.js';

// 1. Tạo Book
export const createBook = async (data) => {
  // Nếu không truyền availableStock, mặc định = totalStock
  if (data.availableStock === undefined) {
    data.availableStock = data.totalStock || 0;
  }
  return await Book.create(data);
};

// 2. Lấy tất cả Books
export const getAllBooks = async () => {
  return await Book.find().populate('authorId', 'name').sort({ createdAt: -1 });
};

// 3. Lấy 1 Book theo ID
export const getBookById = async (id) => {
  return await Book.findById(id).populate('authorId', 'name');
};

// 4. Cập nhật Book
export const updateBook = async (id, data) => {
  // Nếu cập nhật totalStock, có thể cần điều chỉnh availableStock
  // Tuy nhiên để đơn giản, ta cứ để user tự điều chỉnh hoặc logic phức tạp hơn sau này
  return await Book.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

// 5. Xóa Book
export const deleteBook = async (id) => {
  // Business rule 5: Không cho xóa Book nếu đang có Borrowing chưa trả
  const activeBorrowings = await Borrowing.countDocuments({ bookId: id, status: 'BORROWED' });
  if (activeBorrowings > 0) {
    throw new Error('Không thể xóa sách này vì đang có người mượn chưa trả');
  }
  return await Book.findByIdAndDelete(id);
};
