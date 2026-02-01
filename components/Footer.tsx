
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
        
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-brand rounded-lg flex items-center justify-center text-white font-bold text-lg">
              AMP
            </div>
            <h2 className="font-extrabold text-2xl tracking-tight">AMP TECH</h2>
          </div>
          <p className="text-slate-400 font-medium">
            Pune's premier destination for alloy wheel refurbishment. Over a decade of experience in delivering high-quality powder coating and repairs.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-brand transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-brand transition-colors"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-brand transition-colors"><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold uppercase tracking-widest text-red-brand">Contact Info</h3>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <i className="fa-solid fa-location-dot text-red-brand mt-1"></i>
              <p className="text-slate-400 font-medium">
                Kunal Iconia, Shop no 9/10,<br />
                Kiwale-Mamurdi Road, Near MCA International Cricket Stadium, St Tukaram Nagar, Mamurdi, Pune Maharashtra 412101
              </p>
            </li>
            <li className="flex gap-4 items-center">
              <i className="fa-solid fa-phone text-red-brand"></i>
              <a href="tel:9850862283" className="text-slate-100 font-bold text-xl hover:text-red-brand transition-colors">9850862283</a>
            </li>
            <li className="flex gap-4 items-center">
              <i className="fa-solid fa-globe text-red-brand"></i>
              <a href="http://www.amptech.co.in" target="_blank" className="text-slate-100 font-bold hover:text-red-brand transition-colors">www.amptech.co.in</a>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold uppercase tracking-widest text-red-brand">Our Workshop</h3>
          <div className="w-full h-48 rounded-2xl bg-slate-800 relative overflow-hidden flex items-center justify-center group cursor-pointer">
             <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/600')] bg-cover opacity-50 group-hover:scale-105 transition-transform"></div>
             <div className="relative z-10 bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
               <i className="fa-solid fa-map-pin text-red-brand"></i>
               View on Maps
             </div>
          </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto pt-10 border-t border-slate-800 text-center text-slate-500 text-sm font-medium">
        <p>© {new Date().getFullYear()} AMP TECH. All Rights Reserved. Built with Precision.</p>
      </div>
    </footer>
  );
};

export default Footer;
