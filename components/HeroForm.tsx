import React, { useEffect, useState, useRef } from 'react';
import './HeroForm.css';
import { GoogleGenAI } from '@google/genai';
import { supabase, sheetBestUrl } from '../lib/supabase';
import { fileToGenerativePart } from '../lib/helpers';
import { UploadIcon, SpinnerIcon, SuccessIcon } from './Icons';

const HeroForm: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status === 'success') {
      // scroll the success message into view offset by header height so it's not hidden
      setTimeout(() => {
        const el = successRef.current;
        if (!el) return;
        const header = document.querySelector('header') as HTMLElement | null;
        const headerHeight = header ? header.offsetHeight : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 80);
    }
  }, [status]);

  const resetForm = () => {
    setName(''); setPhone(''); setImageFiles([]); setImagePreviews([]); setStatus('idle'); setErrorMessage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) as File[] : [];
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      if (!['image/jpeg','image/png'].includes(file.type)) { setErrorMessage('Unsupported file type. Please upload JPG or PNG images.'); continue; }
      if (file.size > 8 * 1024 * 1024) { setErrorMessage('Image is too large (max 8 MB).'); continue; }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (newFiles.length > 0) {
      setErrorMessage(null);
      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
    e.target.value = '';
  };

  const removeImage = (indexToRemove:number) => {
    setImageFiles(prev => prev.filter((_,i) => i !== indexToRemove));
    setImagePreviews(prev => { const newPrev = prev.filter((_,i)=> i!== indexToRemove); URL.revokeObjectURL(prev[indexToRemove]); return newPrev; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || imageFiles.length === 0) { setErrorMessage('All fields and at least one image are required.'); return; }

    setStatus('loading'); setErrorMessage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const validationPromises = imageFiles.map(async (file) => {
        const imagePart = await fileToGenerativePart(file);
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ parts: [ { text: "Is this image of a vehicle wheel or rim? Answer with only 'yes' or 'no'." }, imagePart ] }]
        });
        return response.text.trim().toLowerCase().includes('yes');
      });

      const validationResults = await Promise.all(validationPromises);
      if (!validationResults.every(Boolean)) {
        setStatus('error'); setErrorMessage('One or more images are not wheels or rims. Please review your selection.'); return;
      }

      // upload images
      const uploadPromises = imageFiles.map(file => {
        const ext = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        return supabase?.storage.from('wheel-images').upload(fileName, file);
      });
      const uploadResults = await Promise.all(uploadPromises);
      const urls: string[] = [];
      for (const res of uploadResults) {
        if (res?.error) throw new Error(res.error.message);
        const { data } = supabase!.storage.from('wheel-images').getPublicUrl((res as any).data.path);
        urls.push(data.publicUrl);
      }

      // insert appointment record
      const { data: newAppointment, error: insertError } = await supabase!.from('appointments').insert({ customer_name: name, customer_phone: phone, image_urls: urls, status: 'Pending', admin_notes: '' }).select().single();
      if (insertError) throw insertError;

      // sync to sheet if configured (send as an array payload and check response)
      if (sheetBestUrl && newAppointment) {
        try {
          const payload = [{
            customer_name: name,
            customer_phone: phone,
            image_urls: Array.isArray(newAppointment.image_urls) ? newAppointment.image_urls.join(', ') : newAppointment.image_urls || '',
            status: 'Pending',
            created_at: new Date().toISOString(),
          }];

          const res = await fetch(sheetBestUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const txt = await res.text();
            console.warn('Sheet sync failed', res.status, txt);
            // surface a minor warning back to the user (non-blocking)
            setErrorMessage((prev) => prev ? prev : 'Appointment saved, but sheet sync failed.');
          } else {
            try {
              const text = await res.text();
              console.log('Sheet sync successful', text);
            } catch (e) { /* ignore */ }
          }
        } catch (e) {
          console.warn('Sheet sync failed', e);
          setErrorMessage((prev) => prev ? prev : 'Appointment saved, but sheet sync failed (network).');
        }
      }

      setStatus('success');
    } catch (err: any) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div ref={successRef} className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 text-center mt-6 success-card">
        <SuccessIcon />
        <h3 className="text-2xl font-bold mt-4">Appointment Requested!</h3>
        <p className="text-slate-600 mt-2">Thanks, {name}. We'll contact you at {phone} to confirm.</p>
        <button onClick={resetForm} className="mt-6 success-button">Submit Another Request</button>
      </div>
    );
  }

  return (
    <section id="quote" className="hero-quote pt-32 pb-16 px-4 bg-slate-50 min-h-[90vh] flex items-center">
      <div className="max-w-7xl container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-6 relative content">
          <img src="/image.png" alt="" aria-hidden="true" className="rim-bg" />
          <div className="inline-block px-4 py-1.5 bg-black text-white rounded-full text-sm font-bold tracking-wide">
           AMPtech EST. 2008 
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]">
            POWDER <span className="text-red-brand">COATERS</span>
          </h2>
          <p className="text-xl text-slate-600 font-medium max-w-lg">
            Give your wheels a factory-fresh finish with our expert refurbishment and repair services. Professional, durable, and stunning results.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 features">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <i className="fa-solid fa-check text-red-brand"></i>
              Full Refurb
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <i className="fa-solid fa-check text-red-brand"></i>
              Expert Repair
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <i className="fa-solid fa-check text-red-brand"></i>
              Custom Recolour
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Decorative shapes */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-brand/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-brand/10 rounded-full blur-3xl -z-10"></div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 card">
            <h3 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-bolt-lightning text-red-brand"></i>
              Send Us Your Wheel/Rim Photos
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-brand/50 focus:bg-white transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+91 00000 00000"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-brand/50 focus:bg-white transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Wheel Image</label>
                <div className="p-2 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 min-h-[10rem] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" onClick={() => fileInputRef.current?.click()}>
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative aspect-square">
                      <img src={src} alt={`Wheel preview ${index+1}`} className="w-full h-full object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">&times;</button>
                    </div>
                  ))}
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full aspect-square cursor-pointer hover:bg-gray-100 rounded-lg">
                    <div className="flex flex-col items-center justify-center text-center">
                      <UploadIcon />
                      <p className="text-xs text-gray-500"><span className="font-semibold">Add photos</span></p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg" multiple onChange={handleImageChange} aria-label="Upload wheel or rim photo" />
                  </label>
                </div>
                <p className="mt-1 text-xs text-center text-gray-500">PNG or JPG (MAX. 8MB each)</p>
              </div>

              {errorMessage && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert"><span className="font-medium">Error:</span> {errorMessage}</div>}

              <button 
                type="submit"
                disabled={status === 'loading' || !supabase}
                className="w-full py-4 mb-4 bg-red-brand text-white rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 transition-all disabled:opacity-70 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {status === 'loading' ? (<SpinnerIcon />) : (<><i className="fa-solid fa-paper-plane"></i>Submit</>)}
              </button>

            </form>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroForm;
