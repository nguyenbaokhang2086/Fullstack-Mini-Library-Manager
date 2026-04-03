import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/dashboard/dashboard';
import AuthorsPage from './pages/authors/authors';
import BooksPage from './pages/books/books';
import BorrowingsPage from "./pages/borrowings/borrowings";
import StatsPage from './pages/stats/stats';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <DashboardLayout activePage={activePage} onPageChange={setActivePage}>
      {activePage === 'dashboard' && <DashboardOverview />}
      {activePage === 'authors' && <AuthorsPage />}
      {activePage === 'books' && <BooksPage />}
      {activePage === 'borrowings' && <BorrowingsPage />}
      {activePage === 'stats' && <StatsPage />}
    </DashboardLayout>
  );
}

export default App;

