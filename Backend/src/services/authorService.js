import Author from '../models/authorModel.js';
import Book from '../models/bookModel.js';

// 1. Tạo Author
export const createAuthor = async (data) => {
  return await Author.create(data);
};

// 2. Lấy tất cả Authors
export const getAllAuthors = async () => {
  return await Author.find().sort({ createdAt: -1 });
};

// 3. Lấy 1 Author theo ID
export const getAuthorById = async (id) => {
  return await Author.findById(id);
};

// 4. Cập nhật Author
export const updateAuthor = async (id, data) => {
  return await Author.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

// 5. Xóa Author
export const deleteAuthor = async (id) => {
  // Business rule 4: Không cho xóa Author nếu có Book
  const booksCount = await Book.countDocuments({ authorId: id });
  if (booksCount > 0) {
    throw new Error('Không thể xóa tác giả này vì đang có sách liên kết');
  }
  return await Author.findByIdAndDelete(id);
};
