import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  PlusCircle,
  Clock,
  AlertTriangle,
  History,
  CheckCircle2,
  Star,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { borrowingAPI, statsAPI } from '@/lib/api';
import { AddBorrowingDialog } from '@/components/BorrowingDialogs';
import { cn } from '@/lib/utils';

const BorrowingsPage = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [stats, setStats] = useState({ totalActive: 0, overdue: 0, returnRate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  const fetchBorrowings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await borrowingAPI.getAll();
      setBorrowings(data);
      // Fetch some stats too if needed
      const overview = await statsAPI.getOverview();
      const statusStats = await statsAPI.getBorrowStatus();
      setStats({
        totalActive: statusStats.BORROWED || 0,
        returned: statusStats.RETURNED || 0,
        total: (statusStats.BORROWED || 0) + (statusStats.RETURNED || 0),
      });
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách mượn sách.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const handleReturn = async (id) => {
    try {
      const res = await borrowingAPI.return(id);
      const updated = res.data || res;
      setBorrowings(prev => prev.map(b => b._id === id ? { ...b, status: 'RETURNED', returnDate: updated.returnDate } : b));
      // Refresh stats
      fetchBorrowings();
    } catch (err) {
      alert(err.message || 'Lỗi khi trả sách');
    }
  };

  const handleAddSuccess = (newBorrow) => {
    setBorrowings(prev => [newBorrow, ...prev]);
    fetchBorrowings();
  };

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Đang tải dữ liệu mượn trả...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tightest uppercase">Borrowings Management</h1>
          <p className="text-slate-500 font-bold text-xs max-w-lg leading-relaxed opacity-70">
            Track active circulation, manage overdue returns, and process new book requests from one central hub.
          </p>
        </div>

        <Button
          onClick={() => setAddOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest px-8 py-6 rounded-2xl shadow-lg shadow-indigo-100 flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          NEW BORROW RECORD
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative group overflow-hidden">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3 uppercase">Total Active (Borrowed)</p>
            <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tightest">{stats.totalActive}</h3>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm group">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3 uppercase">Books Returned</p>
            <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tightest">{stats.returned}</h3>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between group">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3 uppercase">Return Rate</p>
            <div className="space-y-4">
               <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tightest tabular-nums font-mono">{stats.total > 0 ? Math.round((stats.returned / stats.total) * 100) : 0}%</h3>
               <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full shadow-sm" style={{ width: `${stats.total > 0 ? (stats.returned / stats.total) * 100 : 0}%` }} />
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-x-auto">
        {loading ? renderLoading() : (
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Book Title</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Borrower Name</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Borrow Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {borrowings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-black text-sm uppercase tracking-widest">Chưa có dữ liệu mượn trả.</td>
                </tr>
              ) : (
                borrowings.map((item) => (
                  <tr key={item._id} className="group hover:bg-slate-50/40 transition-colors">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <p className="font-black text-slate-800 leading-tight mb-0.5">{item.bookId?.title || 'Unknown Book'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-xs font-black text-slate-900 leading-tight mb-0.5 uppercase tracking-tighter">{item.borrowerName}</p>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-xs font-black text-slate-700 leading-tight mb-1 tabular-nums">{new Date(item.borrowDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-8">
                      <span className={cn(
                        "text-[9px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-sm border",
                        item.status === 'BORROWED' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                        "bg-emerald-50 text-emerald-600 border-emerald-100"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-8 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.status === 'BORROWED' && (
                            <button onClick={() => handleReturn(item._id)} className="p-2 text-indigo-400 hover:text-indigo-600 transition-colors bg-indigo-50/0 hover:bg-indigo-50 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                               <RotateCcw className="w-4 h-4" /> TRẢ SÁCH
                            </button>
                          )}
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <AddBorrowingDialog open={addOpen} onClose={() => setAddOpen(false)} onSuccess={handleAddSuccess} />
    </div>
  );
};

export default BorrowingsPage;
