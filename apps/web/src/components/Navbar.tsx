'use client';

import Link from 'next/link';
import { Ticket, Search, User, PlusCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Tix<span className="text-indigo-600">Pulse</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
              Prototype UI
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari konser, tiket wisata, simaksi, atau olahraga..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm rounded-full border border-transparent focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/organizer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            Buat Event
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <User className="w-4 h-4" />
            Masuk
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center text-xs font-semibold px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-300 rounded-lg transition-colors"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}

