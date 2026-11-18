'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Tag, ShieldCheck, Zap, Sparkles, ArrowRight, Compass } from 'lucide-react';
import { SAMPLE_EVENTS } from '@/lib/sample-data';

export default function HomePage() {
  const [eventsList, setEventsList] = useState<any[]>(SAMPLE_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/events')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEventsList(data);
        }
      })
      .catch(() => {
        // Fallback to sample data if offline
      });
  }, []);

  const categories = [
    { key: 'ALL', label: '🔥 Semua Event' },
    { key: 'CONCERT', label: '🎵 Konser & Musik' },
    { key: 'OUTDOOR', label: '🏕️ Wisata & Alam Bebas' },
    { key: 'SEMINAR', label: '💡 Seminar & AI' },
    { key: 'SPORTS', label: '🏸 Turnamen Olahraga' },
  ];

  const filteredEvents = eventsList.filter((evt) => {
    const matchCategory = selectedCategory === 'ALL' || evt.category === selectedCategory;
    const matchQuery =
      (evt.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.venueName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Platform Tiketing Modern & Anti-Double Booking
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            War Tiket Tanpa Was-Was,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-indigo-200">
              Cepat & Pasti Dapat Kursi
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Dari konser musik berskala internasional, simaksi pendakian gunung, hingga turnamen olahraga nasional. Dilengkapi proteksi seat locking atomik.
          </p>

          {/* Quick Search Card */}
          <div className="max-w-3xl mx-auto mt-8 p-2.5 sm:p-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Ketik nama event, artis, atau kota (contoh: Jakarta, Semeru)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-white text-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-400"
            />
            <button
              onClick={() => {}}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Jelajahi Tiket
            </button>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.key
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map((evt) => (
            <Link
              key={evt.id}
              href={`/events/${evt.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col"
            >
              {/* Event Image */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={evt.bannerUrl}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-400" />
                  {evt.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold">
                  {evt.ticketMode === 'RESERVED_SEATING' ? '💺 Pilih Kursi' : '🎟️ Kuota GA'}
                </span>
              </div>

              {/* Event Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {evt.title}
                  </h3>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{evt.dateString || 'Segera Hadir'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{evt.venueName}, {evt.city}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Mulai Dari</span>
                    <span className="text-base font-extrabold text-indigo-600">
                      Rp {(evt.priceStart || 250000).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-sm">Tidak ada event yang sesuai dengan kata kunci pencarian Anda.</p>
          </div>
        )}
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Seat Locking 15 Menit</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Saat Anda memilih tiket atau kursi, kursi tersebut otomatis dikunci via Redis selama 15 menit agar Anda leluasa menyelesaikan pembayaran tanpa diserobot user lain.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">E-Ticket Bertanda Tangan Kriptografi</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              QR Code tiket menggunakan hash kriptografi JWT/HMAC yang dapat divalidasi langsung oleh scanner gate masuk tanpa koneksi internet (offline verification).
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Multi-Kategori & Multi-Sesi</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mendukung berbagai skema: konser dengan nomor kursi, simaksi pendakian gunung dengan tanggal izin masuk harian, dan seminar teknologi all-day pass.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
