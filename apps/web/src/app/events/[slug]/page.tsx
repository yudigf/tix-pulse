'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, ShieldCheck, Ticket, Users, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { SAMPLE_EVENTS, EventItem } from '@/lib/sample-data';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const event = SAMPLE_EVENTS.find((e) => e.slug === slug) || SAMPLE_EVENTS[0];

  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const currentSession = event.sessions[activeSessionIndex] || event.sessions[0];

  // Ticket quantities state: { [ticketTypeId]: number }
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  // Selected seats state: string[]
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Simulated seat map for Reserved Seating
  const sampleSeats = [
    { code: 'VIP-A1', row: 'A', status: 'AVAILABLE', price: 850000 },
    { code: 'VIP-A2', row: 'A', status: 'AVAILABLE', price: 850000 },
    { code: 'VIP-A3', row: 'A', status: 'SOLD', price: 850000 },
    { code: 'VIP-A4', row: 'A', status: 'AVAILABLE', price: 850000 },
    { code: 'VIP-A5', row: 'A', status: 'AVAILABLE', price: 850000 },
    { code: 'VIP-B1', row: 'B', status: 'AVAILABLE', price: 850000 },
    { code: 'VIP-B2', row: 'B', status: 'SOLD', price: 850000 },
    { code: 'VIP-B3', row: 'B', status: 'AVAILABLE', price: 850000 },
    { code: 'VIP-B4', row: 'B', status: 'AVAILABLE', price: 850000 },
    { code: 'VIP-B5', row: 'B', status: 'AVAILABLE', price: 850000 },
  ];

  const handleQuantityChange = (ticketId: string, delta: number, max: number) => {
    const current = quantities[ticketId] || 0;
    const next = Math.max(0, Math.min(max, current + delta));
    setQuantities({ ...quantities, [ticketId]: next });
  };

  const toggleSeat = (code: string) => {
    if (selectedSeats.includes(code)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== code));
    } else {
      setSelectedSeats([...selectedSeats, code]);
    }
  };

  // Calculate total tickets & price
  let totalTickets = 0;
  let totalPrice = 0;

  if (event.ticketMode === 'RESERVED_SEATING' && selectedSeats.length > 0) {
    totalTickets = selectedSeats.length;
    totalPrice = selectedSeats.length * 850000;
  } else {
    currentSession.ticketTypes.forEach((t) => {
      const q = quantities[t.id] || 0;
      totalTickets += q;
      totalPrice += q * t.price;
    });
  }

  const handleProceedToCheckout = () => {
    if (totalTickets === 0) return;
    // Store in localStorage for checkout prototype flow
    const checkoutData = {
      eventTitle: event.title,
      eventSlug: event.slug,
      sessionTitle: currentSession.title,
      totalTickets,
      totalPrice,
      selectedSeats,
      ticketMode: event.ticketMode,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('tixpulse_checkout', JSON.stringify(checkoutData));
    }
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Katalog Event
      </Link>

      {/* Hero Banner & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Banner Image */}
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md">
            <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                {event.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 pt-1">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-amber-300" /> {event.dateString}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-400" /> {event.venueName}, {event.city}</span>
              </div>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                EO
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                  {event.organizer.name}
                  {event.organizer.verified && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <span className="text-xs text-slate-400">Penyelenggara Resmi Terverifikasi</span>
              </div>
            </div>
            <span className="text-xs text-emerald-600 font-semibold px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Original
            </span>
          </div>

          {/* Event Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h2 className="text-base font-bold text-slate-900">Deskripsi Event</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Interactive Ticket Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Pilih Tiket & Jadwal</h2>
                <p className="text-xs text-slate-400">Pilih sesi waktu dan jenis tiket yang ingin Anda beli</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-100">
                {event.ticketMode === 'RESERVED_SEATING' ? 'Mode Peta Kursi' : 'Mode Kuota GA'}
              </span>
            </div>

            {/* Session Tabs */}
            {event.sessions.length > 1 && (
              <div className="flex gap-2 border-b border-slate-100 pb-3">
                {event.sessions.map((sess, idx) => (
                  <button
                    key={sess.id}
                    onClick={() => {
                      setActiveSessionIndex(idx);
                      setQuantities({});
                      setSelectedSeats([]);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                      activeSessionIndex === idx
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sess.title}
                  </button>
                ))}
              </div>
            )}

            {/* Reserved Seating Interactive Map (If Applicable) */}
            {event.ticketMode === 'RESERVED_SEATING' && (
              <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">PANGGUNG / STAGE UTAMA</span>
                  <div className="w-full h-3 bg-indigo-500 rounded-full shadow-md shadow-indigo-200"></div>
                </div>

                <div className="pt-4 flex flex-col items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600">Pilih Kursi VIP (Klik untuk memilih):</span>
                  <div className="grid grid-cols-5 gap-3">
                    {sampleSeats.map((seat) => {
                      const isSelected = selectedSeats.includes(seat.code);
                      const isSold = seat.status === 'SOLD';
                      return (
                        <button
                          key={seat.code}
                          disabled={isSold}
                          onClick={() => toggleSeat(seat.code)}
                          className={`w-14 h-12 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                            isSold
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                              : isSelected
                              ? 'bg-emerald-500 text-white scale-105 shadow-md shadow-emerald-200 border-2 border-emerald-600'
                              : 'bg-white text-slate-700 hover:border-indigo-400 border border-slate-300 shadow-sm'
                          }`}
                        >
                          <span>{seat.code}</span>
                          <span className="text-[9px] font-normal">{isSold ? 'Habis' : '850K'}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white border border-slate-300"></span> Tersedia</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500"></span> Dipilih</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-300"></span> Terjual</span>
                  </div>
                </div>
              </div>
            )}

            {/* General Admission Ticket Cards List */}
            <div className="space-y-4">
              {currentSession.ticketTypes.map((tix) => {
                const qty = quantities[tix.id] || 0;
                const remaining = tix.quota - tix.soldCount;
                return (
                  <div
                    key={tix.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{tix.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                          Sisa {remaining} tiket
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{tix.description}</p>
                      <span className="text-base font-extrabold text-indigo-600 block pt-1">
                        Rp {tix.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    {event.ticketMode === 'GENERAL_ADMISSION' && (
                      <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-xl self-end sm:self-center">
                        <button
                          onClick={() => handleQuantityChange(tix.id, -1, 5)}
                          disabled={qty === 0}
                          className="w-8 h-8 rounded-lg bg-white disabled:opacity-40 text-slate-800 font-bold flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-slate-900">{qty}</span>
                        <button
                          onClick={() => handleQuantityChange(tix.id, 1, 5)}
                          disabled={qty >= 5}
                          className="w-8 h-8 rounded-lg bg-indigo-600 disabled:opacity-40 text-white font-bold flex items-center justify-center shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Sidebar Checkout Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">Ringkasan Pesanan</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Event</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[150px]">{event.title}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Jumlah Tiket</span>
                <span className="font-bold text-slate-900">{totalTickets} Lembar</span>
              </div>
              {selectedSeats.length > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Nomor Kursi</span>
                  <span className="font-bold text-indigo-600">{selectedSeats.join(', ')}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-3 flex justify-between text-sm">
                <span className="font-bold text-slate-900">Total Biaya</span>
                <span className="font-extrabold text-indigo-600 text-base">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>Tiket akan otomatis di-lock via Redis selama 15 menit setelah tombol ditekan.</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={totalTickets === 0}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              Lanjut ke Checkout ({totalTickets})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

