'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CONCERT');
  const [ticketMode, setTicketMode] = useState('GENERAL_ADMISSION');
  const [city, setCity] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [description, setDescription] = useState('');
  const [ticketName, setTicketName] = useState('Presale 1');
  const [price, setPrice] = useState(250000);
  const [quota, setQuota] = useState(500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tixpulse_token') : null;
      if (!token) {
        throw new Error('Anda harus masuk sebagai Event Organizer terlebih dahulu untuk membuat event.');
      }

      const res = await fetch('http://localhost:3000/api/v1/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          ticketMode,
          city,
          venueName,
          venueAddress: venueAddress || venueName,
          description,
          ticketName,
          price: Number(price),
          quota: Number(quota),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal membuat event di backend');
      }

      setSuccess(`Event "${data.title}" berhasil dipublikasikan dan tersimpan di database!`);
      setTimeout(() => {
        router.push('/organizer');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mempublikasikan event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link href="/organizer" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Dashboard EO
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900">Buat Event Baru</h1>
        <p className="text-xs text-slate-500">Isi detail acara dan konfigurasikan jenis tiket serta kuota</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Informasi Dasar Event</h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama / Judul Event</label>
              <input
                type="text"
                required
                placeholder="Contoh: Jazz Gunung Bromo 2026 / Coldplay Live in Jakarta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kategori Event</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="CONCERT">Konser & Musik</option>
                  <option value="OUTDOOR">Wisata & Alam Bebas (Simaksi)</option>
                  <option value="SEMINAR">Seminar & Konferensi</option>
                  <option value="SPORTS">Turnamen Olahraga</option>
                  <option value="FESTIVAL">Festival Kuliner & Budaya</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mode Tiket</label>
                <select
                  value={ticketMode}
                  onChange={(e) => setTicketMode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="GENERAL_ADMISSION">General Admission (Berdasarkan Kuota)</option>
                  <option value="RESERVED_SEATING">Reserved Seating (Pilih Nomor Kursi)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kota Pelaksanaan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jakarta, Bandung, Malang"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Lokasi / Venue</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Stadion Utama GBK / Amphitheater Jiwa Jawa"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Alamat Lengkap Venue (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: Jl. Pintu Satu Senayan, Gelora"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Deskripsi Lengkap Event</label>
              <textarea
                rows={3}
                required
                placeholder="Tuliskan ringkasan acara, bintang tamu, dan ketentuan khusus..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>
        </div>

        {/* Ticket Configuration */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Konfigurasi Kategori Tiket</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Tiket</label>
              <input
                type="text"
                required
                placeholder="Contoh: Early Bird / VIP"
                value={ticketName}
                onChange={(e) => setTicketName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Harga (Rupiah)</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Total Kuota Lembar</label>
              <input
                type="number"
                required
                min={1}
                value={quota}
                onChange={(e) => setQuota(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Menyimpan ke Database...' : 'Publikasikan Event Sekarang 🚀'}
        </button>
      </form>
    </div>
  );
}
