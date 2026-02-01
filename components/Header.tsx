




import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header-root fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/2.png" alt="AMP Tech" className="logo-small object-contain rounded-md mr-1" />
          <div className="leading-tight">
           

          </div>
        </div>

        <div className="hidden md:flex items-center gap-5 text-sm font-semibold ">
          <a href="#services" className="nav-link transition-colors ">Services</a>
          <a href="#quote" className="nav-link transition-colors">Quick Quote</a>
          <a href="tel:9850862283" aria-label="Call AMP Tech" className="phone-cta flex items-center gap-2 bg-red-brand text-white px-4 py-2 rounded-full transition-all shadow-md active:scale-95">
            <i className="fa-solid fa-phone" aria-hidden="true"></i>
            <span className="sr-only">Call AMP Tech</span>
            <span>9850862283</span>
          </a>
        </div>

        <a href="tel:9850862283" className="md:hidden phone-cta flex items-center gap-2 bg-red-brand text-white px-3 py-2 rounded-full shadow-md">
          <i className="fa-solid fa-phone"></i>
        </a>
      </div>
    </header>
  );
};

export default Header;
