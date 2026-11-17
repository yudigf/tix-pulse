'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, TrendingUp, Users, Ticket, Calendar, DollarSign, ArrowUpRight, BarChart3, ScanLine } from 'lucide-react';

export default function OrganizerDashboard() {
  const events = [
    {
      id: 'evt-1',
      title: 'SoundPulse Music Fest 2026',
      date: '28 Nov 2026',
      venue: 'GBK Stadium, Jakarta',
      ticketsSold: 1245,
      totalQuota: 1600,
      revenue: 654250000,
      status: 'PUBLISHED',
    },
    {
      id: 'evt-2',
      title: 'Simaksi Pendakian Semeru & Ranu Kumbolo',
      date: '1 - 10 Des 2026',
      venue: 'TNBTS, Malang',
      ticketsSold: 305,
      totalQuota: 500,
      revenue: 19575000,
      status: 'PUBLISHED',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard Event Organizer</h1>
          <p className="text-xs text-slate-500">Kelola penjualan tiket, kuota real-time, dan laporan pendapatan Anda</p>
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
          <span className="text-2xl font-black text-slate-900 block">Rp 673,8 Jt</span>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% bulan ini
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tiket Terjual</span>
            <Ticket className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">1.550</span>
          <span className="text-[11px] text-slate-500 font-medium">dari 2.100 total kuota</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Event Aktif</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">2</span>
          <span className="text-[11px] text-slate-500 font-medium">Siap tayang & dijual</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tingkat Okupansi</span>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">73.8%</span>
          <span className="text-[11px] text-indigo-600 font-bold">Rata-rata penjualan</span>
        </div>
      </div>

      {/* Managed Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Daftar Event Anda</h2>
          <span className="text-xs text-slate-400">Menampilkan 2 event</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Event</th>
                <th className="py-3 px-4">Jadwal & Lokasi</th>
                <th className="py-3 px-4">Penjualan Tiket</th>
                <th className="py-3 px-4">Pendapatan Bruto</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((evt) => {
                const percentage = Math.round((evt.ticketsSold / evt.totalQuota) * 100);
                return (
                  <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 text-sm">
                      {evt.title}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <div>{evt.date}</div>
                      <div className="text-[11px] text-slate-400">{evt.venue}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{evt.ticketsSold} / {evt.totalQuota}</div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400">{percentage}% terjual</span>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-indigo-600">
                      Rp {evt.revenue.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Tayang Publik
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

