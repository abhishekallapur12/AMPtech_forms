import React from 'react';
import Header from './components/Header';
import HeroForm from './components/HeroForm';
import Services from './components/Services';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroForm />
        <Services />
        
        {/* Gallery Section */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-4">Our Work Gallery</h2>
                <p className="text-slate-600 font-medium">See the transformations we've delivered for our clients.</p>
              </div>
              <button className="px-8 py-3 rounded-full border-2 border-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all">
                View All Projects
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["6.png","7.png","10.png","9.png"].map((src, idx) => (
                <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-lg group">
                  <img 
                    src={`/${src}`} 
                    alt={`Work ${idx + 1}`} 
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 bg-red-brand text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Ready for a transformation?</h2>
            <p className="text-xl text-white/80 mb-10 font-medium">Don't settle for scratched or dull wheels. Let the specialists bring them back to life today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#quote" className="px-10 py-4 bg-white text-red-brand rounded-full font-bold text-lg hover:shadow-2xl transition-all active:scale-95">
                Get Your Free Quote
              </a>
              <a href="tel:9850862283" className="px-10 py-4 bg-white backdrop-blur-md text-black border border-white/10 rounded-full font-bold text-lg hover:bg-red-100 transition-all">
                Call Our Workshop
              </a>
            </div>
          </div>
        </section>
      </main>
     
    </div>
  );
};

export default App;
