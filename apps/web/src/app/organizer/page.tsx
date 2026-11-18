'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Ticket, Calendar, DollarSign, ArrowUpRight, BarChart3, Building2, ExternalLink } from 'lucide-react';

export default function OrganizerDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [kpi, setKpi] = useState({
    totalRevenue: 0,
    totalTicketsSold: 0,
    totalQuota: 0,
    activeEvents: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchMyEvents = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tixpulse_token') : null;
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:3000/api/v1/events/organizer/my-events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        if (data.kpi) {
          setKpi(data.kpi);
        }
      }
    } catch {
      // Backend maybe offline, keep default
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tixpulse_user');
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {
          setCurrentUser(null);
        }
      }
    }

    fetchMyEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Dashboard Event Organizer</h1>
            {currentUser?.organizer?.name && (
              <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {currentUser.organizer.name}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Selamat datang kembali, <strong>{currentUser?.fullName || 'Event Organizer'}</strong>. Kelola penjualan tiket dan kuota secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/organizer/create-event"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Buat Event Baru
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Pendapatan</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            Rp {(kpi.totalRevenue / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt
          </span>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Real-time database
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tiket Terjual</span>
            <Ticket className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            {kpi.totalTicketsSold.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            dari {kpi.totalQuota.toLocaleString('id-ID')} total kuota
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Event Aktif</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">{kpi.activeEvents}</span>
          <span className="text-[11px] text-slate-500 font-medium">Siap tayang & dijual</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tingkat Okupansi</span>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">{kpi.occupancyRate}%</span>
          <span className="text-[11px] text-indigo-600 font-bold">Rata-rata penjualan</span>
        </div>
      </div>

      {/* Managed Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Daftar Event Anda</h2>
          <span className="text-xs text-slate-400">
            {loading ? 'Memuat data...' : `Menampilkan ${events.length} event`}
          </span>
        </div>

        {events.length === 0 && !loading ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm text-slate-500">Anda belum memiliki event aktif.</p>
            <Link
              href="/organizer/create-event"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Buat Event Pertama Anda
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Event</th>
                  <th className="py-3 px-4">Jadwal & Lokasi</th>
                  <th className="py-3 px-4">Penjualan Tiket</th>
                  <th className="py-3 px-4">Pendapatan Bruto</th>
                  <th className="py-3 px-4">Status & Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => {
                  const percentage = evt.totalQuota > 0 ? Math.round((evt.ticketsSold / evt.totalQuota) * 100) : 0;
                  return (
                    <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900 text-sm">
                        <Link
                          href={`/events/${evt.slug}`}
                          className="hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                          title="Lihat halaman publik"
                        >
                          <span>{evt.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <div>{evt.date}</div>
                        <div className="text-[11px] text-slate-400">{evt.venue}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">
                          {evt.ticketsSold} / {evt.totalQuota}
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${Math.min(100, percentage)}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-400">{percentage}% terjual</span>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-indigo-600">
                        Rp {evt.revenue.toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {evt.status === 'PUBLISHED' ? 'Tayang Publik' : evt.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
