import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, HelpCircle, User, Menu } from 'lucide-react';

const DashboardLayout = ({ children, activePage, onPageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FBFCFE] font-sans antialiased overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shrink-0`}>
        <Sidebar 
          activePage={activePage} 
          onPageChange={(page) => {
            onPageChange(page);
            setIsSidebarOpen(false);
          }} 
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-10 bg-white/70 backdrop-blur-3xl border-b border-slate-50 z-10 shrink-0">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <button 
              className="p-1 -ml-1 text-slate-400 hover:text-indigo-600 lg:hidden transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full bg-[#F3F5F9] border-none rounded-2xl py-2 md:py-3 pl-10 md:pl-12 pr-4 text-[10px] md:text-xs font-black tracking-widest uppercase focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300 placeholder:normal-case shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            <button className="text-slate-200 hover:text-indigo-600 transition-colors hidden md:block">
              <Bell className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="text-slate-200 hover:text-indigo-600 transition-colors sm:hidden">
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="text-slate-200 hover:text-indigo-600 transition-colors hidden md:block">
              <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div className="flex items-center gap-3 md:gap-4 pl-3 md:pl-6 border-l border-slate-50">
               <div className="text-right hidden xl:block">
                  <p className="text-[12px] font-black text-slate-900 uppercase leading-none tracking-tight">Admin User</p>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter mt-1 opacity-80">Lumina Library</p>
               </div>
               <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm group hover:scale-105 transition-transform duration-300 cursor-pointer shrink-0">
                  <img src="https://i.pravatar.cc/150?u=admin" className="w-full h-full object-cover" alt="Admin" />
               </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 md:p-8 lg:p-12 bg-[#FBFCFE]">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
          
          {/* Footer */}
          <footer className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 pb-8 md:pb-12 text-center md:text-left">
            <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2024 Lumina Library Management. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              {['Documentation', 'Support', 'Privacy Policy'].map(link => (
                <a key={link} href="#" className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-indigo-600 transition-colors">
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
