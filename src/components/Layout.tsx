import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}  // Замена Outlet на children (контент страницы)
      </main>
      <Footer />
    </div>
  );
};

export default Layout;