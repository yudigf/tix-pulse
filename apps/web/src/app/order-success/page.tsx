'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Download, Share2, Ticket, QrCode, Calendar, MapPin, User, ShieldCheck, Home } from 'lucide-react';

export default function OrderSuccessPage() {
  const [ticketData, setTicketData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tixpulse_ticket_result');
      if (stored) {
        setTicketData(JSON.parse(stored));
      }
    }
  }, []);

  if (!ticketData) {
    return <div className="text-center py-20 text-slate-400">Memuat rincian tiket...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Alert Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-100">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Pembayaran Berhasil!</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          E-Ticket resmi Anda telah diterbitkan dan bukti transaksi telah dikirimkan ke <strong>{ticketData.buyerEmail}</strong>.
        </p>
      </div>

      {/* Visual Boarding Pass / E-Ticket Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl overflow-hidden">
        {/* Ticket Top Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-6 sm:p-8 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-3 py-1 bg-white/20 rounded-full uppercase tracking-wider backdrop-blur-md">
              E-TICKET RESMI
            </span>
            <span className="font-mono text-xs font-extrabold text-amber-300">
              {ticketData.ticketCode}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">{ticketData.eventTitle}</h2>
          <p className="text-xs text-indigo-200">{ticketData.sessionTitle}</p>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex items-center bg-slate-50 px-6 py-2 border-y border-dashed border-slate-300">
          <div className="w-4 h-4 rounded-full bg-slate-100 absolute -left-2 border border-slate-300"></div>
          <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mx-auto">
            TIXPULSE CRYPTOGRAPHIC PASS • OFFLINE SCANNER READY
          </span>
          <div className="w-4 h-4 rounded-full bg-slate-100 absolute -right-2 border border-slate-300"></div>
        </div>

        {/* Ticket Body & QR Code */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div className="sm:col-span-2 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Pemegang Tiket</span>
                <span className="font-bold text-slate-900 block text-sm">{ticketData.buyerName}</span>
                <span className="text-[11px] text-slate-500 font-mono">NIK: {ticketData.attendeeNik}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Kursi / Akses</span>
                <span className="font-bold text-indigo-600 block text-sm">
                  {ticketData.selectedSeats?.length > 0 ? ticketData.selectedSeats.join(', ') : 'General Admission'}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">Gate Masuk: Gate Utama</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Waktu Pembayaran: {new Date(ticketData.paidAt).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Status Tiket: <strong>VALID & SIAP DIGUNAKAN</strong></span>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketData.ticketCode}`}
              alt="E-Ticket QR"
              className="w-32 h-32 object-contain"
            />
            <span className="text-[10px] text-slate-400 font-mono text-center">Tunjukkan QR ini di gate masuk</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => alert('Fitur simulasi download PDF E-Ticket berhasil!')}
          className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" />
          Download PDF E-Ticket
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

