import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Book, 
  ArrowLeftRight, 
  Clock,
  Bell,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { statsAPI } from '@/lib/api';

const DashboardOverview = () => {
  const [statsData, setStatsData] = useState(null);
  const [topBooks, setTopBooks] = useState([]);
  const [borrowStatus, setBorrowStatus] = useState({ BORROWED: 0, RETURNED: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [overview, top, status] = await Promise.all([
          statsAPI.getOverview(),
          statsAPI.getTopBooks(),
          statsAPI.getBorrowStatus(),
        ]);
        setStatsData(overview);
        setTopBooks(top);
        setBorrowStatus(status);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    { 
      title: 'Total Books', 
      value: statsData?.totalBooks || 0, 
      icon: Book, 
      color: 'bg-[#F2F4FF] text-[#4F46E5]',
      trend: 'Live',
      trendUp: true
    },
    { 
      title: 'Total Authors', 
      value: statsData?.totalAuthors || 0, 
      icon: Users, 
      color: 'bg-[#F8F2FF] text-[#9333EA]',
      trend: 'Stable',
      trendUp: null
    },
    { 
      title: 'Active Borrowings', 
      value: borrowStatus.BORROWED || 0, 
      icon: ArrowLeftRight, 
      color: 'bg-indigo-50 text-indigo-600',
      trend: 'Current',
      trendUp: true
    },
    { 
      title: 'Total Returned', 
      value: borrowStatus.RETURNED || 0, 
      icon: Clock, 
      color: 'bg-emerald-50 text-emerald-600',
      trend: 'Completed',
      trendUp: true
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Dashboard Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tightest">Dashboard Overview</h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-60">Welcome back, Admin. Here's what's happening today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 group overflow-hidden relative">
            <div className="flex justify-between items-start mb-4">
              <div className={cn(stat.color, "p-3 rounded-xl transition-transform group-hover:scale-110 duration-500")}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-slate-50 text-slate-400"
              )}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900 leading-tight tabular-nums group-hover:translate-x-1 transition-transform duration-300">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[460px] flex flex-col relative overflow-hidden">
            <h2 className="text-xl font-black text-slate-900">Borrowed vs Returned Distribution</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60 mb-10">Current system checkouts</p>
            
            <div className="flex-1 flex flex-col justify-center gap-10 px-10">
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Borrowed</span>
                     <span className="text-2xl font-black text-indigo-600">{borrowStatus.BORROWED}</span>
                  </div>
                  <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(borrowStatus.BORROWED / (borrowStatus.BORROWED + borrowStatus.RETURNED || 1)) * 100}%` }} />
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Successfully Returned</span>
                     <span className="text-2xl font-black text-emerald-600">{borrowStatus.RETURNED}</span>
                  </div>
                  <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(borrowStatus.RETURNED / (borrowStatus.BORROWED + borrowStatus.RETURNED || 1)) * 100}%` }} />
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h2 className="text-xl font-black text-slate-900 leading-none">Top 5 Most Borrowed Books</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 opacity-60">Popularity leaderboard</p>
                </div>
             </div>
             
             <div className="space-y-8">
                {topBooks.length === 0 ? (
                  <p className="text-sm font-bold text-slate-300 uppercase tracking-widest text-center py-4">No data available</p>
                ) : (
                  topBooks.map((book) => (
                    <div key={book._id} className="space-y-3">
                       <div className="flex justify-between items-end">
                          <h4 className="text-[11px] font-black text-slate-800 tracking-widest uppercase">{book.title}</h4>
                          <span className="text-[11px] font-black text-indigo-500 uppercase tabular-nums tracking-widest">{book.borrowCount} CHECKOUTS</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 transition-all duration-1000 ease-out rounded-full shadow-sm"
                            style={{ width: `${Math.min(100, (book.borrowCount / (topBooks[0]?.borrowCount || 1)) * 100)}%` }}
                          />
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col p-8 min-h-[460px] relative">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black text-slate-900 leading-none">Quick Actions</h2>
          </div>
          <div className="space-y-4">
             <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Next Scheduled Return</p>
                <p className="text-sm font-bold text-slate-900">Check borrowings page for due dates</p>
             </div>
             <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">System Status</p>
                <p className="text-sm font-bold">All services operational</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
