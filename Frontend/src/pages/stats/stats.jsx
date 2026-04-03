import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  RefreshCcw, 
  TrendingUp, 
  TrendingDown,
  ExternalLink,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { statsAPI } from '@/lib/api';

const StatsPage = () => {
  const [overview, setOverview] = useState(null);
  const [topBooks, setTopBooks] = useState([]);
  const [borrowStatus, setBorrowStatus] = useState({ BORROWED: 0, RETURNED: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [over, top, status] = await Promise.all([
        statsAPI.getOverview(),
        statsAPI.getTopBooks(),
        statsAPI.getBorrowStatus(),
      ]);
      setOverview(over);
      setTopBooks(top);
      setBorrowStatus(status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summaryStats = [
    { title: 'Total Collections', value: overview?.totalBooks || 0, icon: BarChart3 },
    { title: 'Active Borrowings', value: borrowStatus.BORROWED || 0, icon: TrendingUp },
    { title: 'Total Authors', value: overview?.totalAuthors || 0, icon: TrendingUp },
    { title: 'Total History', value: overview?.totalBorrowings || 0, icon: RefreshCcw },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest uppercase">Syncing Analytics Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20">
      <div className="flex justify-between items-end">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tightest uppercase">Library Analytics</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-60">Deep-dive into borrowing trends and collection popularity.</p>
        </header>

        <div className="flex items-center gap-4">
           <Button onClick={fetchData} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest px-6 py-5 rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              Update Data
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {summaryStats.map((stat) => (
           <div key={stat.title} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative group">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3 uppercase leading-none">{stat.title}</p>
              <div className="flex justify-between items-end">
                 <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tightest tabular-nums">{stat.value}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm flex flex-col h-[480px]">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-xl font-black text-slate-900 leading-none">Checkout vs Returns Distribution</h2>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-12 px-10">
               <div className="space-y-4">
                  <div className="flex justify-between items-end"><span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Checkouts</span><span className="text-2xl font-black text-indigo-600">{borrowStatus.BORROWED}</span></div>
                  <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(borrowStatus.BORROWED / (borrowStatus.BORROWED + borrowStatus.RETURNED || 1)) * 100}%` }} /></div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-end"><span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Returned Records</span><span className="text-2xl font-black text-emerald-600">{borrowStatus.RETURNED}</span></div>
                  <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(borrowStatus.RETURNED / (borrowStatus.BORROWED + borrowStatus.RETURNED || 1)) * 100}%` }} /></div>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm flex flex-col h-[480px]">
            <h2 className="text-xl font-black text-slate-900 mb-2 leading-none uppercase">Top Books Demand</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60 uppercase mb-5">Ranked by borrow count</p>
            
            <div className="space-y-6 pt-4 border-t border-slate-50">
               {topBooks.map(item => (
                 <div key={item._id} className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors max-w-[140px] truncate">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tabular-nums tracking-widest">{item.borrowCount} borrows</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default StatsPage;
