import React, { useState, useEffect } from 'react';
import {
  Upload,
  Calendar as CalendarIcon,
  Trash2,
  AlertTriangle,
  UserX,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { authorAPI } from '@/lib/api';

// ─────────────────────────────────────────────
// ADD AUTHOR DIALOG
// ─────────────────────────────────────────────
export const AddAuthorDialog = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('author_draft');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return { name: '', birthDate: '', bio: '', avatar: '' }; }
    }
    return { name: '', birthDate: '', bio: '', avatar: '' };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('author_draft', JSON.stringify(form));
  }, [form]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Tên tác giả không được để trống.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authorAPI.create(form);
      onSuccess?.(res.data || res);
      // Xóa draft sau khi thành công
      localStorage.removeItem('author_draft');
      setForm({ name: '', birthDate: '', bio: '', avatar: '' });
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
      <DialogContent className="max-w-[820px] bg-white rounded-[40px] p-0 border-none shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-12 pb-6 border-b border-slate-50 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Add New Authors
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 opacity-60">
              Đăng ký tác giả mới vào thư viện
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

          {/* Full Name */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Gabriel García Márquez"
              className="bg-[#F8FAFC] border-none text-slate-900 placeholder:text-slate-300 h-14 rounded-2xl"
            />
          </div>

          {/* Birth Date */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Birth Date (Manual Entry)</label>
            <div className="relative">
              <Input
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                type="text"
                placeholder="YYYY-MM-DD (e.g. 1950-01-01)"
                className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl pr-12"
              />
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Biography</label>
            <Textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Mô tả ngắn gọn về cuộc đời, tác phẩm và ảnh hưởng văn học..."
              className="bg-[#F8FAFC] border-none text-slate-900 placeholder:text-slate-300 rounded-3xl p-6 min-h-[160px] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-12 py-8 bg-slate-50/40 flex items-center justify-end gap-6 border-t border-slate-50">
          <button
            onClick={handleClose}
            className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black text-[12px] uppercase tracking-widest px-10 py-4 rounded-[18px] shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Đang tạo...' : 'Tạo Tác Giả'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


// ─────────────────────────────────────────────
// EDIT AUTHOR DIALOG
// ─────────────────────────────────────────────
export const EditAuthorDialog = ({ open, onClose, author, onSuccess }) => {
  const [form, setForm] = useState({ name: '', birthDate: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (author) {
      setForm({
        name: author.name || '',
        birthDate: author.birthDate ? new Date(author.birthDate).toISOString().split('T')[0] : '',
        bio: author.bio || '',
      });
    }
  }, [author]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Tên tác giả không được để trống.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authorAPI.update(author._id, form);
      onSuccess?.(res.data || res);
      onClose();
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setError(''); onClose(); };

  if (!author) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[820px] bg-white rounded-[40px] p-0 border-none shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-12 pb-6 border-b border-slate-50 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Chỉnh Sửa Tác Giả</h2>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">
              ID: {author._id}
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

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Birth Date (Manual Entry)</label>
            <div className="relative">
              <Input
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                type="text"
                placeholder="YYYY-MM-DD (e.g. 1950-01-01)"
                className="bg-[#F8FAFC] border-none text-slate-900 h-14 rounded-2xl pr-12"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Biography</label>
            <Textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="bg-[#F8FAFC] border-none text-slate-900 rounded-3xl p-6 min-h-[160px] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-12 py-8 bg-slate-50/40 flex items-center justify-end gap-6 border-t border-slate-50">
          <button
            onClick={handleClose}
            className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black text-[12px] uppercase tracking-widest px-10 py-4 rounded-[18px] shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


// ─────────────────────────────────────────────
// DELETE AUTHOR DIALOG
// ─────────────────────────────────────────────
export const DeleteAuthorDialog = ({ open, onClose, author, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await authorAPI.delete(author._id);
      onSuccess?.(author._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setError(''); onClose(); };

  if (!author) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[480px] bg-white rounded-[40px] p-0 border-none shadow-2xl overflow-hidden">
        {/* Red accent top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-t-[40px]" />

        <div className="p-12 flex flex-col items-center text-center gap-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center shadow-sm">
            <UserX className="w-9 h-9 text-rose-500" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Xóa Tác Giả?</h2>
            <p className="text-sm font-medium text-slate-500 mt-3 leading-relaxed max-w-[340px]">
              Bạn sắp xóa vĩnh viễn tác giả{' '}
              <span className="font-black text-slate-800">"{author.name}"</span>.
              Hành động này không thể hoàn tác.
            </p>
          </div>

          {/* Author card preview */}
          <div className="w-full bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
            <div className="text-left">
              <p className="font-black text-slate-900 text-sm">{author.name}</p>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">ID: {author._id}</p>
            </div>
          </div>

          {error && (
            <div className="w-full flex items-center gap-3 bg-rose-50 text-rose-600 px-5 py-4 rounded-2xl text-sm font-bold">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3 w-full pt-2">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-black text-[12px] uppercase tracking-widest py-4 rounded-[18px] shadow-xl shadow-rose-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {loading ? 'Đang xóa...' : 'Xác Nhận Xóa'}
            </button>
            <button
              onClick={handleClose}
              disabled={loading}
              className="w-full text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 py-3 transition-colors"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
