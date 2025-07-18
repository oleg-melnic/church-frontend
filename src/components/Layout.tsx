import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}  {/* Здесь был комментарий? Замените на такой стиль */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;