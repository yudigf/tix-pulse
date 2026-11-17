'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, QrCode, Copy, Check, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<'QRIS' | 'BCA_VA' | 'MANDIRI_VA'>('QRIS');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes TTL
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tixpulse_payment');
      if (stored) {
        setPaymentData(JSON.parse(stored));
      }
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyVa = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePaymentSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const ticketResult = {
          ...paymentData,
          ticketCode: 'TXP-TK-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          paidAt: new Date().toISOString(),
          status: 'PAID',
        };
        localStorage.setItem('tixpulse_ticket_result', JSON.stringify(ticketResult));
      }
      router.push('/order-success');
    }, 1200);
  };

  if (!paymentData) {
    return <div className="text-center py-20 text-slate-400">Memuat rincian transaksi...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Stepper Header */}
      <div className="flex items-center justify-center gap-4 text-xs font-bold border-b border-slate-200 pb-6">
        <span className="flex items-center gap-2 text-slate-400">
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">1</span>
          Data Pemesan
        </span>
        <span className="text-slate-300">➔</span>
        <span className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
          Pembayaran
        </span>
        <span className="text-slate-300">➔</span>
        <span className="flex items-center gap-2 text-slate-400">
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">3</span>
          E-Ticket
        </span>
      </div>

      {/* Countdown Alert */}
      <div className="bg-amber-500/10 border border-amber-300 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Selesaikan Pembayaran Sebelum Waktu Habis</h3>
            <p className="text-xs text-amber-700">Tiket Anda dikunci sementara oleh Redis. Jika waktu habis, kuota akan otomatis dikembalikan ke publik.</p>
          </div>
        </div>
        <div className="font-mono text-xl font-black bg-white px-4 py-2 rounded-xl border border-amber-200 shadow-sm text-amber-600">
          {formatTimer(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Pilih Metode Pembayaran</h3>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedMethod('QRIS')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                  selectedMethod === 'QRIS'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-200'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <QrCode className="w-6 h-6 text-indigo-600" />
                <span>QRIS Instan</span>
              </button>

              <button
                onClick={() => setSelectedMethod('BCA_VA')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                  selectedMethod === 'BCA_VA'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-200'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">BCA</span>
                <span>Virtual Account</span>
              </button>

              <button
                onClick={() => setSelectedMethod('MANDIRI_VA')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                  selectedMethod === 'MANDIRI_VA'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-200'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="w-6 h-6 rounded bg-amber-600 text-white flex items-center justify-center text-[9px] font-black">MDR</span>
                <span>Mandiri VA</span>
              </button>
            </div>

            {/* Selected Method Details */}
            <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              {selectedMethod === 'QRIS' && (
                <div className="text-center space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700 block">Scan QR Code dengan Semua E-Wallet / M-Banking</span>
                    <span className="text-[11px] text-slate-400">BCA, GoPay, OVO, Dana, ShopeePay, Livin by Mandiri</span>
                  </div>

                  {/* Mock QR Code Graphic */}
                  <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-300 shadow-md flex flex-col items-center justify-center space-y-2">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TIXPULSE-PAYMENT-SIMULATION"
                      alt="QRIS Payment"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <span className="text-xs text-slate-500 block">Total Bayar: <strong className="text-indigo-600">Rp {paymentData.grandTotal.toLocaleString('id-ID')}</strong></span>
                </div>
              )}

              {selectedMethod === 'BCA_VA' && (
                <div className="space-y-3">
                  <span className="text-xs font-medium text-slate-500">Nomor Virtual Account BCA:</span>
                  <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-mono text-base font-bold text-slate-900 tracking-wider">8801 2345 6789 0123</span>
                    <button
                      onClick={() => handleCopyVa('8801234567890123')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                </div>
              )}

              {selectedMethod === 'MANDIRI_VA' && (
                <div className="space-y-3">
                  <span className="text-xs font-medium text-slate-500">Nomor Virtual Account Mandiri:</span>
                  <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-mono text-base font-bold text-slate-900 tracking-wider">7001 2987 6543 2100</span>
                    <button
                      onClick={() => handleCopyVa('7001298765432100')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary & Instant Simulation Button */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Ringkasan Tagihan</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>No. Pesanan</span>
                <span className="font-mono font-bold text-slate-900">{paymentData.orderNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Tiket</span>
                <span className="font-bold text-slate-900">{paymentData.totalTickets} Lembar</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Pembayaran</span>
                <span className="font-extrabold text-indigo-600 text-base">
                  Rp {paymentData.grandTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Prototype Instant Payment Simulation */}
          <div className="p-5 bg-indigo-900 text-white rounded-2xl shadow-xl space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Mock Payment Gateway
              </span>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Di lingkungan pengujian prototype ini, Anda dapat mensimulasikan pembayaran sukses secara instan.
              </p>
            </div>

            <button
              onClick={handleSimulatePaymentSuccess}
              disabled={isProcessing}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Memverifikasi Pembayaran...' : 'Saya Sudah Bayar (Simulasi Lunas) ➔'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

