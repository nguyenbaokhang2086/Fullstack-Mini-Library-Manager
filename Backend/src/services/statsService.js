import Book from '../models/bookModel.js';
import Author from '../models/authorModel.js';
import Borrowing from '../models/borrowingModel.js';

// 1. Tổng số sách, authors, borrow
export const getOverviewStats = async () => {
  const [totalBooks, totalAuthors, totalBorrowings] = await Promise.all([
    Book.countDocuments(),
    Author.countDocuments(),
    Borrowing.countDocuments()
  ]);
  return {
    totalBooks,
    totalAuthors,
    totalBorrowings
  };
};

// 2. Top sách được mượn nhiều
export const getTopBooksStats = async () => {
  const topBooks = await Borrowing.aggregate([
    {
      $group: {
        _id: '$bookId',
        borrowCount: { $sum: 1 }
      }
    },
    {
      $sort: { borrowCount: -1 }
    },
    {
      $limit: 5
    },
    {
      $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: '_id',
        as: 'bookInfo'
      }
    },
    {
      $unwind: '$bookInfo'
    },
    {
      $project: {
        _id: 1,
        borrowCount: 1,
        title: '$bookInfo.title'
      }
    }
  ]);
  return topBooks;
};

// 3. Số lượng đang mượn vs đã trả
export const getBorrowStatusStats = async () => {
  const stats = await Borrowing.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    BORROWED: 0,
    RETURNED: 0
  };

  stats.forEach(item => {
    result[item._id] = item.count;
  });

  return result;
};
