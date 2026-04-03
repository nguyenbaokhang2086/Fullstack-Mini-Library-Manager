import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, HelpCircle, User } from 'lucide-react';

const DashboardLayout = ({ children, activePage, onPageChange }) => {
  return (
    <div className="flex h-screen bg-[#FBFCFE] font-sans antialiased overflow-hidden">
      <Sidebar activePage={activePage} onPageChange={onPageChange} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-10 bg-white/70 backdrop-blur-3xl border-b border-slate-50 z-10 shrink-0">
          <div className="relative w-96 max-w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search archives, members, or IDs..." 
              className="w-full bg-[#F3F5F9] border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-black tracking-widest uppercase focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300 placeholder:normal-case shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-slate-200 hover:text-indigo-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-slate-200 hover:text-indigo-600 transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-50">
               <div className="text-right">
                  <p className="text-[12px] font-black text-slate-900 uppercase leading-none tracking-tight">Admin User</p>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter mt-1 opacity-80">Lumina Library</p>
               </div>
               <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm group hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <img src="https://i.pravatar.cc/150?u=admin" className="w-full h-full object-cover" alt="Admin" />
               </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-12 bg-[#FBFCFE]">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
          
          {/* Footer */}
          <footer className="mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 pb-12">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2024 Lumina Library Management. All rights reserved.</p>
            <div className="flex items-center gap-8">
              {['Documentation', 'Support', 'Privacy Policy'].map(link => (
                <a key={link} href="#" className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
