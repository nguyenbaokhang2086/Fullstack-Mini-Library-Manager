import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Pencil,
  Trash2,
  Calendar,
  BookOpen,
  Star,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddAuthorDialog, EditAuthorDialog, DeleteAuthorDialog } from '@/components/AuthorDialogs';
import { authorAPI } from '@/lib/api';

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const fetchAuthors = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await authorAPI.getAll();
      setAuthors(data);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách tác giả.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleAddSuccess = (newAuthor) => {
    setAuthors(prev => [newAuthor, ...prev]);
  };

  const handleEditSuccess = (updatedAuthor) => {
    setAuthors(prev => prev.map(a => a._id === updatedAuthor._id ? updatedAuthor : a));
  };

  const handleDeleteSuccess = (deletedId) => {
    setAuthors(prev => prev.filter(a => a._id !== deletedId));
  };

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Đang tải danh sách tác giả...</p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
      </div>
      <div className="text-center">
        <p className="font-black text-slate-900 mb-1 font-sans">Không thể kết nối tới API</p>
        <p className="text-sm text-slate-400 max-w-xs">{error}</p>
      </div>
      <button onClick={fetchAuthors} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest px-6 py-3 rounded-xl transition-all">
        <RefreshCw className="w-4 h-4" /> Thử lại
      </button>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
            <span>LUMINA LIBRARY</span>
            <span className="text-slate-300">/</span>
            <span className="text-indigo-400 opacity-60">AUTHORS MANAGEMENT</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tightest">Authors Directory</h1>
          <p className="text-slate-500 font-bold text-xs max-w-lg leading-relaxed mt-1 opacity-70">
            Browse and manage the registry of distinguished authors, their biographies, and historical metadata entries.
          </p>
        </div>

        <Button
          onClick={() => setAddOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest px-8 py-6 rounded-2xl shadow-lg shadow-indigo-100 flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Register Author
        </Button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        {loading ? renderLoading() : error ? renderError() : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">NAME</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">BIO / BIO SLIP</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">BIRTH DATE</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {authors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-300 font-black text-sm uppercase tracking-widest uppercase">
                    Chưa có tác giả nào. Hãy thêm mới.
                  </td>
                </tr>
              ) : (
                authors.map((author) => (
                  <tr key={author._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm border border-indigo-100">
                          {author.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-tight mb-1">{author.name}</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: {author._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-xs font-bold text-slate-500 max-w-md line-clamp-1 opacity-80 italic">
                        {author.bio || 'No biography available.'}
                      </p>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 opacity-40" />
                        <span className="text-xs font-black text-slate-900 tabular-nums">
                          {author.birthDate ? new Date(author.birthDate).toLocaleDateString() : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => { setSelectedAuthor(author); setEditOpen(true); }} className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => { setSelectedAuthor(author); setDeleteOpen(true); }} className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-6 group">
          <div className="bg-indigo-50 p-5 rounded-[24px] text-indigo-600 group-hover:scale-110 transition-transform duration-300">
            <Star className="w-7 h-7" />
          </div>
          <div className="pt-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3 uppercase">Total Authors</p>
            <h3 className="text-3xl font-black text-slate-900 leading-none mb-2">{loading ? '—' : authors.length}</h3>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active database entries</p>
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-4 h-4 text-indigo-200" />
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100">FEATURED</p>
            </div>
            <h3 className="text-xl font-black leading-tight mb-2 uppercase">{authors.length > 0 ? authors[0].name : 'Lumina Library'}</h3>
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Latest Profile Added</p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 bg-white/5 rounded-full transform group-hover:scale-125 transition-transform duration-1000" />
          <Star className="absolute top-10 right-10 w-10 h-10 text-indigo-400 opacity-20" />
        </div>
      </div>

      <AddAuthorDialog open={addOpen} onClose={() => setAddOpen(false)} onSuccess={handleAddSuccess} />
      <EditAuthorDialog open={editOpen} onClose={() => { setEditOpen(false); setSelectedAuthor(null); }} author={selectedAuthor} onSuccess={handleEditSuccess} />
      <DeleteAuthorDialog open={deleteOpen} onClose={() => { setDeleteOpen(false); setSelectedAuthor(null); }} author={selectedAuthor} onSuccess={handleDeleteSuccess} />
    </div>
  );
};

export default AuthorsPage;
