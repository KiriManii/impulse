import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;