import React, { useState, useEffect } from 'react';
import {
  Upload,
  Calendar as CalendarIcon,
  Trash2,
  AlertTriangle,
  BookX,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { bookAPI, authorAPI } from '@/lib/api';

// ─────────────────────────────────────────────
// ADD BOOK DIALOG
// ─────────────────────────────────────────────
export const AddBookDialog = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('book_draft');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return { title: '', authorId: '', publishedYear: '', totalStock: '', category: '', img: '' }; }
    }
    return { title: '', authorId: '', publishedYear: '', totalStock: '', category: '', img: '' };
  });
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('book_draft', JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (open) {
      authorAPI.getAll().then(setAuthors).catch(console.error);
    }
  }, [open]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Tên sách không được để trống.'); return; }
    if (!form.authorId) { setError('Vui lòng chọn tác giả.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await bookAPI.create({
        ...form,
        totalStock: Number(form.totalStock) || 0,
        publishedYear: Number(form.publishedYear) || new Date().getFullYear(),
      });
      onSuccess?.(res.data || res);
      // Xóa draft sau khi thành công
      localStorage.removeItem('book_draft');
      setForm({ title: '', authorId: '', publishedYear: '', totalStock: '', category: '', img: '' });
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
      <DialogContent className="max-w-[860px] bg-white rounded-[40px] p-0 border-none shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-12 pb-6 border-b border-slate-50 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Add New Books</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 opacity-60">
              Thêm tựa sách mới vào danh mục thư viện
            </p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-12 space-y-8 max-h-[55vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="flex items-center gap-3 bg-rose-50 text-rose-600 px-5 py-4 rounded-2xl text-sm font-bold">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Book Title <span className="text-rose-500">*</span>
              </label>
              <Input name="title" value={form.title} onChange={handleChange} className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Author <span className="text-rose-500">*</span>
              </label>
              <select
                name="authorId"
                value={form.authorId}
                onChange={handleChange}
                className="w-full bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Chọn tác giả...</option>
                {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Publication Year</label>
              <Input name="publishedYear" value={form.publishedYear} onChange={handleChange} type="number" className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Stock</label>
              <Input name="totalStock" value={form.totalStock} onChange={handleChange} type="number" min="0" className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cover Image URL</label>
            <Input name="img" value={form.img} onChange={handleChange} placeholder="https://..." className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl" />
          </div>
        </div>

        {/* Footer */}
        <div className="px-12 py-8 bg-slate-50/40 flex items-center justify-end gap-6 border-t border-slate-50">
          <button onClick={handleClose} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Hủy</button>
          <button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black text-[12px] uppercase tracking-widest px-10 py-4 rounded-[18px] shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Đang thêm...' : 'Thêm Vào Danh Mục'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


// ─────────────────────────────────────────────
// EDIT BOOK DIALOG
// ─────────────────────────────────────────────
export const EditBookDialog = ({ open, onClose, book, onSuccess }) => {
  const [form, setForm] = useState({
    title: '', authorId: '', publishedYear: '', totalStock: '', availableStock: '', img: '',
  });
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      authorAPI.getAll().then(setAuthors).catch(console.error);
    }
  }, [open]);

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || '',
        authorId: book.authorId?._id || book.authorId || '',
        publishedYear: String(book.publishedYear || ''),
        totalStock: String(book.totalStock || ''),
        availableStock: String(book.availableStock || ''),
        img: book.img || '',
      });
    }
  }, [book]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Tên sách không được để trống.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await bookAPI.update(book._id, {
        ...form,
        totalStock: Number(form.totalStock),
        availableStock: Number(form.availableStock),
        publishedYear: Number(form.publishedYear),
      });
      onSuccess?.(res.data || res);
      onClose();
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setError(''); onClose(); };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[860px] bg-white rounded-[40px] p-0 border-none shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-12 pb-6 border-b border-slate-50 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Chỉnh Sửa Sách</h2>
          </div>
          <button onClick={handleClose} className="p-2 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-12 space-y-8 max-h-[55vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="flex items-center gap-3 bg-rose-50 text-rose-600 px-5 py-4 rounded-2xl text-sm font-bold">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Book Title</label>
              <Input name="title" value={form.title} onChange={handleChange} className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Author</label>
              <select
                name="authorId"
                value={form.authorId}
                onChange={handleChange}
                className="w-full bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl px-4 outline-none"
              >
                {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Stock</label>
              <Input name="totalStock" value={form.totalStock} onChange={handleChange} type="number" className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Available Stock</label>
              <Input name="availableStock" value={form.availableStock} onChange={handleChange} type="number" className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Year</label>
              <Input name="publishedYear" value={form.publishedYear} onChange={handleChange} type="number" className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-12 py-8 bg-slate-50/40 flex items-center justify-end gap-6 border-t border-slate-50">
          <button onClick={handleClose} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Hủy</button>
          <button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black text-[12px] uppercase tracking-widest px-10 py-4 rounded-[18px] shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


// ─────────────────────────────────────────────
// DELETE BOOK DIALOG
// ─────────────────────────────────────────────
export const DeleteBookDialog = ({ open, onClose, book, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await bookAPI.delete(book._id);
      onSuccess?.(book._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setError(''); onClose(); };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[500px] bg-white rounded-[40px] p-0 border-none shadow-2xl overflow-hidden text-center">
        <div className="h-1.5 w-full bg-rose-500" />
        <div className="p-12 flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center">
            <BookX className="w-9 h-9 text-rose-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Xóa Sách?</h2>
            <p className="text-sm text-slate-500 mt-2">Xác nhận xóa cuốn sách "{book.title}"?</p>
          </div>
          {error && <div className="text-rose-600 text-sm font-bold bg-rose-50 p-4 rounded-xl w-full">{error}</div>}
          <div className="flex flex-col gap-3 w-full">
            <button onClick={handleDelete} disabled={loading} className="w-full bg-rose-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-200 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {loading ? 'Đang xóa...' : 'Xác Nhận Xóa'}
            </button>
            <button onClick={handleClose} className="text-slate-400 font-bold uppercase tracking-widest text-[11px] py-2">Hủy bỏ</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
