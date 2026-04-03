import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  X,
  Loader2,
  BookMarked,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { borrowingAPI, bookAPI } from '@/lib/api';

// ─────────────────────────────────────────────
// ADD BORROWING DIALOG
// ─────────────────────────────────────────────
export const AddBorrowingDialog = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('borrow_draft');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return { bookId: '', borrowerName: '', borrowDate: new Date().toISOString().split('T')[0] }; }
    }
    return {
      bookId: '', borrowerName: '', borrowDate: new Date().toISOString().split('T')[0],
    };
  });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('borrow_draft', JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (open) {
      bookAPI.getAll().then(setBooks).catch(console.error);
    }
  }, [open]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.bookId) { setError('Vui lòng chọn sách.'); return; }
    if (!form.borrowerName.trim()) { setError('Tên người mượn không được để trống.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await borrowingAPI.create(form);
      onSuccess?.(res.data || res);
      // Xóa draft sau khi thành công
      localStorage.removeItem('borrow_draft');
      setForm({ bookId: '', borrowerName: '', borrowDate: new Date().toISOString().split('T')[0] });
      onClose();
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setError(''); onClose(); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] bg-white rounded-[40px] p-0 border-none shadow-2xl overflow-hidden">
        <div className="p-12 pb-6 border-b border-slate-50 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mượn Sách</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 opacity-60">
              Ghi nhận lượt mượn sách mới
            </p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-12 space-y-8">
          {error && (
            <div className="flex items-center gap-3 bg-rose-50 text-rose-600 px-5 py-4 rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Sách Cần Mượn</label>
            <select
              name="bookId"
              value={form.bookId}
              onChange={handleChange}
              className="w-full bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl px-4 outline-none"
            >
              <option value="">Chọn sách...</option>
              {books.map(b => (
                <option key={b._id} value={b._id} disabled={b.availableStock <= 0}>
                  {b.title} ({b.availableStock} còn lại)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tên Người Mượn</label>
            <div className="relative">
              <Input
                name="borrowerName"
                value={form.borrowerName}
                onChange={handleChange}
                placeholder="Nhập tên người mượn..."
                className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl pl-12"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ngày Mượn</label>
            <Input
              name="borrowDate"
              value={form.borrowDate}
              onChange={handleChange}
              type="date"
              className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl"
            />
          </div>
        </div>

        <div className="px-12 py-8 bg-slate-50/40 flex items-center justify-end gap-6 border-t border-slate-50">
          <button onClick={handleClose} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600">Hủy</button>
          <button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[12px] uppercase tracking-widest px-10 py-4 rounded-[18px] shadow-xl shadow-indigo-200">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookMarked className="w-4 h-4 mr-2 inline" />}
            {loading ? 'Đang xử lý...' : 'Xác Nhận Mượn'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
