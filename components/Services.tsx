
import React from 'react';

const services = [
  {
    title: "REFURB",
    description: "We offer a full refurbishment service that will bring new life to worn alloys and add value to your vehicle.",
    icon: "fa-solid fa-rotate",
    img: "/3.png"
  },
  {
    title: "REPAIR",
    description: "We will repair pot hole and curb damage and all work is guaranteed for your peace of mind.",
    icon: "fa-solid fa-wrench",
    img: "/4.png"
  },
  {
    title: "RECOLOUR",
    description: "Huge range of colour options available. Match your car's look or try something completely unique.",
    icon: "fa-solid fa-palette",
    img: "/5.png"
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Our Specialties</h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">Precision, care, and quality materials go into every wheel we touch.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="h-56 overflow-hidden">
                <img 
                  src={service.img} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-red-brand/10 rounded-2xl flex items-center justify-center text-red-brand text-xl mb-6 group-hover:bg-red-brand group-hover:text-white transition-colors">
                  <i className={service.icon}></i>
                </div>
                <h3 className="text-2xl font-black mb-3 text-slate-900">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
