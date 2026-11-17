'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, IdCard, ShieldCheck, CreditCard, Clock } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<any>(null);

  // Buyer contact form
  const [buyerName, setBuyerName] = useState('Budi Santoso');
  const [buyerEmail, setBuyerEmail] = useState('budi.santoso@gmail.com');
  const [buyerPhone, setBuyerPhone] = useState('081234567890');

  // Attendees form per ticket
  const [attendeeNik, setAttendeeNik] = useState('3271012304950001');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tixpulse_checkout');
      if (stored) {
        setCheckoutData(JSON.parse(stored));
      }
    }
  }, []);

  if (!checkoutData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-500">Tidak ada sesi checkout aktif.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const platformFee = 5000;
  const grandTotal = checkoutData.totalPrice + platformFee;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentPayload = {
      ...checkoutData,
      buyerName,
      buyerEmail,
      buyerPhone,
      attendeeNik,
      platformFee,
      grandTotal,
      orderNumber: 'TXP-' + Date.now().toString().slice(-8),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('tixpulse_payment', JSON.stringify(paymentPayload));
    }
    router.push('/payment');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href={`/events/${checkoutData.eventSlug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Detail Event
      </Link>

      {/* Stepper Header */}
      <div className="flex items-center justify-center gap-4 text-xs font-bold border-b border-slate-200 pb-6">
        <span className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
          Data Pemesan
        </span>
        <span className="text-slate-300">➔</span>
        <span className="flex items-center gap-2 text-slate-400">
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">2</span>
          Pembayaran
        </span>
        <span className="text-slate-300">➔</span>
        <span className="flex items-center gap-2 text-slate-400">
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">3</span>
          E-Ticket
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Input */}
        <form onSubmit={handleProceedToPayment} className="lg:col-span-2 space-y-6">
          {/* Buyer Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Informasi Kontak Pemesan
            </h2>
            <p className="text-xs text-slate-400">E-Ticket dan bukti pembayaran akan dikirimkan ke email ini.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap Sesuai KTP</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nomor WhatsApp / HP</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attendee Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <IdCard className="w-5 h-5 text-indigo-600" />
              Data Identitas Peserta / Pemegang Tiket
            </h2>
            <p className="text-xs text-slate-400">Diperlukan untuk validasi gate masuk dan asuransi keselamatan peserta.</p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nomor Identitas (NIK KTP / Paspor / SIM)</label>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={attendeeNik}
                    onChange={(e) => setAttendeeNik(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Lanjut ke Pilih Metode Pembayaran
          </button>
        </form>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Ringkasan Biaya</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Event</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[150px]">{checkoutData.eventTitle}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Tiket</span>
                <span className="font-bold text-slate-900">{checkoutData.totalTickets} Lembar</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Harga Tiket</span>
                <span className="font-semibold text-slate-800">Rp {checkoutData.totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biaya Platform & Layanan</span>
                <span className="font-semibold text-slate-800">Rp {platformFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-sm">
                <span className="font-bold text-slate-900">Total Tagihan</span>
                <span className="font-extrabold text-indigo-600 text-base">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Jaminan Keamanan Pembayaran</span>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Koneksi terenkripsi SSL 256-bit dan diawasi oleh payment gateway berlisensi resmi Bank Indonesia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

