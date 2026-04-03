import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Pencil,
  Trash2,
  AlertCircle,
  BookOpen,
  Star,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddBookDialog, EditBookDialog, DeleteBookDialog } from '@/components/BookDialogs';
import { bookAPI } from '@/lib/api';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookAPI.getAll();
      setBooks(data);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách sách.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddSuccess = (newBook) => {
    setBooks(prev => [newBook, ...prev]);
  };

  const handleEditSuccess = (updatedBook) => {
    setBooks(prev => prev.map(b => b._id === updatedBook._id ? updatedBook : b));
  };

  const handleDeleteSuccess = (deletedId) => {
    setBooks(prev => prev.filter(b => b._id !== deletedId));
  };

  const lowStockCount = books.filter(b => b.availableStock <= 5).length;

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Đang tải danh mục sách...</p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
      </div>
      <div className="text-center">
        <p className="font-black text-slate-900 mb-1">Không thể kết nối tới API</p>
        <p className="text-sm text-slate-400 max-w-xs">{error}</p>
      </div>
      <button onClick={fetchBooks} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest px-6 py-3 rounded-xl">
        <RefreshCw className="w-4 h-4" /> Thử lại
      </button>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
            <span>LUMINA LIBRARY</span>
            <span className="text-slate-300">/</span>
            <span className="text-indigo-400 opacity-60 uppercase">BOOKS MANAGEMENT</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tightest uppercase">Book Catalog</h1>
          <p className="text-slate-500 font-bold text-xs max-w-lg leading-relaxed mt-1 opacity-70">
            Manage the global library resource pool, track availability levels, and update resource metadata from a central hub.
          </p>
        </div>

        <Button
          onClick={() => setAddOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest px-8 py-6 rounded-2xl"
        >
          <Plus className="w-5 h-5 mr-3" />
          Add New Resource
        </Button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-x-auto">
        {loading ? renderLoading() : error ? renderError() : (
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">TITLE</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">AUTHOR</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">TOTAL STOCK</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">AVAILABLE</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest tabular-nums">PUBLISHED YEAR</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {books.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-300 font-black text-sm uppercase tracking-widest">
                    Chưa có sách nào. Hãy thêm sách mới.
                  </td>
                </tr>
              ) : (
                books.map((book) => {
                  const isLow = book.availableStock <= 5;
                  return (
                    <tr key={book._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          {book.img ? (
                            <img src={book.img} className="w-10 h-14 rounded-lg object-cover shadow-sm bg-slate-100" alt="" />
                          ) : (
                            <div className="w-10 h-14 rounded-lg bg-indigo-50 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-indigo-300" />
                            </div>
                          )}
                          <div>
                            <p className="font-black text-slate-900 leading-tight mb-1">{book.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-black text-indigo-500 uppercase tracking-tight">
                          {book.authorId?.name || 'Unknown Author'}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-black text-slate-900 tabular-nums">{book.totalStock}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-900 tabular-nums">{book.availableStock}</span>
                          {isLow && (
                            <span className="text-[9px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-widest">
                              {book.availableStock} LEFT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-black text-slate-400 tabular-nums">{book.publishedYear}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button onClick={() => { setSelectedBook(book); setEditOpen(true); }} className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => { setSelectedBook(book); setDeleteOpen(true); }} className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-5">
          <div className="bg-rose-50 p-4 rounded-2xl text-rose-600"><AlertCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 pt-1 uppercase">LOW STOCK ALERTS</p>
            <h3 className="text-2xl font-black text-rose-600 leading-none mb-2">{loading ? '—' : `${lowStockCount} Items`}</h3>
            <p className="text-[10px] font-bold text-slate-400 opacity-60">Requires immediate replenishment</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-5">
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><BookOpen className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 pt-1 uppercase">TOTAL IN CATALOG</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none mb-2">{loading ? '—' : `${books.length} Books`}</h3>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live from database</p>
          </div>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-4 h-4 text-indigo-200 fill-indigo-200" />
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100 uppercase">MOST BORROWED</p>
            </div>
            <h3 className="text-lg font-black leading-tight mb-2 pr-10">{books.length > 0 ? books[0].title : 'No data yet'}</h3>
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest uppercase">Latest addition</p>
          </div>
          <BookOpen className="absolute top-8 right-8 w-8 h-8 text-indigo-400 opacity-30" />
        </div>
      </div>

      <AddBookDialog open={addOpen} onClose={() => setAddOpen(false)} onSuccess={handleAddSuccess} />
      <EditBookDialog open={editOpen} onClose={() => { setEditOpen(false); setSelectedBook(null); }} book={selectedBook} onSuccess={handleEditSuccess} />
      <DeleteBookDialog open={deleteOpen} onClose={() => { setDeleteOpen(false); setSelectedBook(null); }} book={selectedBook} onSuccess={handleDeleteSuccess} />
    </div>
  );
};

export default BooksPage;
