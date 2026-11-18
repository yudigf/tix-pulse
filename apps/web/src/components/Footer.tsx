import Link from 'next/link';
import { Ticket, ShieldCheck, Zap, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                <Ticket className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Tix<span className="text-indigo-400">Pulse</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Platform tiket generasi baru dengan arsitektur anti-double booking, seat locking real-time, dan verifikasi e-ticket offline.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Kategori Event</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors">Konser & Musik</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Wisata & Alam Bebas</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Seminar & Workshop</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Turnamen Olahraga</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Event Organizer</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/organizer" className="hover:text-white transition-colors">Dashboard EO</Link></li>
              <li><Link href="/organizer/create-event" className="hover:text-white transition-colors">Buat Event Baru</Link></li>
              <li><Link href="/organizer" className="hover:text-white transition-colors">Scanner Gate Masuk</Link></li>
              <li><a href="http://localhost:3000/api/docs" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">Swagger API Docs ↗</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Keamanan Transaksi</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Tiket Resmi Terverifikasi</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Seat Lock Atomic Engine</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Headphones className="w-4 h-4 text-indigo-400" />
                <span>Bantuan Pengguna 24/7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 TixPulse Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Server Core: <span className="text-emerald-400 font-mono">http://localhost:3000</span></span>
            <span>Prisma Studio: <span className="text-indigo-400 font-mono">http://localhost:5555</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

