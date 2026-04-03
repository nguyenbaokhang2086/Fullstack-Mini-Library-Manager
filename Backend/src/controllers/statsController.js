import * as statsService from '../services/statsService.js';
import { success, error } from '../utils/response.js';

// [GET] /api/stats/overview
export const getOverview = async (req, res) => {
  try {
    const stats = await statsService.getOverviewStats();
    return success(res, 'Lấy tổng quan stats thành công', stats);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi lấy stats overview', 500, err.message);
  }
};

// [GET] /api/stats/top-books
export const getTopBooks = async (req, res) => {
  try {
    const stats = await statsService.getTopBooksStats();
    return success(res, 'Lấy danh sách top books thành công', stats);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi lấy top books', 500, err.message);
  }
};

// [GET] /api/stats/borrow-status
export const getBorrowStatus = async (req, res) => {
  try {
    const stats = await statsService.getBorrowStatusStats();
    return success(res, 'Lấy trạng thái mượn sách thành công', stats);
  } catch (err) {
    return error(res, 'Lỗi hệ thống khi lấy borrow status', 500, err.message);
  }
};

