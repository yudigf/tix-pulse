'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ticket, Mail, Lock, User, Phone, Building2, ArrowRight, UserCheck, LogOut } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'BUYER' | 'ORGANIZER'>('BUYER');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alreadyUser, setAlreadyUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tixpulse_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          setAlreadyUser(user);
          const redirectTarget = user.role === 'ORGANIZER' || user.role === 'SUPER_ADMIN' ? '/organizer' : '/';
          router.replace(redirectTarget);
          return;
        } catch {
          // invalid stored json
        }
      }
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleLogoutAndSwitch = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tixpulse_token');
      localStorage.removeItem('tixpulse_user');
      window.dispatchEvent(new Event('auth-change'));
      setAlreadyUser(null);
      setIsCheckingAuth(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName,
          phoneNumber,
          role,
          ...(role === 'ORGANIZER' && { organizerName }),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }

      localStorage.setItem('tixpulse_token', data.accessToken);
      localStorage.setItem('tixpulse_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-change'));

      if (role === 'ORGANIZER') {
        router.push('/organizer');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  if (alreadyUser) {
    const targetUrl = alreadyUser.role === 'ORGANIZER' || alreadyUser.role === 'SUPER_ADMIN' ? '/organizer' : '/';
    const targetLabel = alreadyUser.role === 'ORGANIZER' || alreadyUser.role === 'SUPER_ADMIN' ? 'Dashboard EO' : 'Katalog Tiket';

    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
            <UserCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Anda Sudah Terdaftar & Masuk</h2>
            <p className="text-xs text-slate-500">
              Saat ini Anda login sebagai <strong>{alreadyUser.fullName}</strong> ({alreadyUser.role}).
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            Mengalihkan Anda secara otomatis ke <strong>{targetLabel}</strong>...
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href={targetUrl}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Lanjut ke {targetLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleLogoutAndSwitch}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Ganti Akun Lain (Keluar)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckingAuth) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center text-xs text-slate-400">
        Memeriksa sesi login...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-slate-900">Buat Akun TixPulse</h1>
        <p className="text-xs text-slate-500">Pilih jenis akun yang sesuai dengan kebutuhan Anda</p>
      </div>

      {/* Role Picker */}
      <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setRole('BUYER')}
          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            role === 'BUYER' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          Pembeli Tiket
        </button>

        <button
          type="button"
          onClick={() => setRole('ORGANIZER')}
          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            role === 'ORGANIZER' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Event Organizer
        </button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Nama Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          {role === 'ORGANIZER' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Event Organizer / Promoter</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: SoundPulse Live"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nomor Telepon / WhatsApp</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="081234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Kata Sandi (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-bold text-indigo-600 hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
