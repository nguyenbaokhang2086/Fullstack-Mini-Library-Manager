import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ArrowLeftRight, 
  BarChart3, 
  Plus, 
  Settings, 
  LogOut,
  Library
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'dashboard', name: 'DASHBOARD', icon: LayoutDashboard },
  { id: 'authors', name: 'AUTHORS', icon: Users },
  { id: 'books', name: 'BOOKS', icon: BookOpen },
  { id: 'borrowings', name: 'BORROWINGS', icon: ArrowLeftRight },
  { id: 'stats', name: 'STATS', icon: BarChart3 },
];

const Sidebar = ({ activePage = 'authors', onPageChange }) => {
  return (
    <div className="w-64 h-full bg-[#F8FAFC] border-r border-slate-200 flex flex-col p-6 font-sans shrink-0">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
          <Library className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="text-[17px] font-black text-indigo-900 leading-[0.8] tracking-tighter uppercase">Lumina</h1>
          <h1 className="text-[17px] font-black text-indigo-900 leading-[1.2] tracking-tighter uppercase mb-0.5">Admin</h1>
          <p className="text-[10px] font-black text-slate-400 tracking-widest mt-0.5 opacity-60">CURATOR ACCESS</p>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange?.(item.id)}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
              activePage === item.id 
                ? "bg-white shadow-sm border border-slate-100 text-indigo-600 font-black" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              activePage === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-400"
            )} />
            <span className="text-[11px] font-black tracking-widest uppercase">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Add New Resource Button */}
      <div className="mb-10">
        <Button className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest">
          <Plus className="w-5 h-5" />
          ADD NEW RESOURCE
        </Button>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2 pt-6 border-t border-slate-50">
        <button className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all group">
          <Settings className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
          <span className="text-[11px] font-black tracking-widest uppercase">Settings</span>
        </button>
        <button className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all group">
          <LogOut className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
          <span className="text-[11px] font-black tracking-widest uppercase">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
