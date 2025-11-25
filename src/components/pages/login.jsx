import React, { useState } from 'react';
import { usersAPI } from '../../config/api';
import { Calendar, Lock, User } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt:', { username, password });

    if (!username.trim() || !password.trim()) {
      setError('Username dan password harus diisi!');
      setLoading(false);
      return;
    }

    try {
      const users = await usersAPI.getAll();
      console.log('Users from API:', users);

      if (!users || Object.keys(users).length === 0) {
        setError('Tidak ada user di database.');
        setLoading(false);
        return;
      }

      let userRecord = null;
      let uid = null;

      // Cari user berdasarkan username key, nama, atau email
      const inputLower = username.toLowerCase().trim();

      for (const [key, data] of Object.entries(users)) {
        const keyMatch = key.toLowerCase() === inputLower;
        const namaMatch = data.nama && data.nama.toLowerCase() === inputLower;
        const emailMatch = data.email && data.email.toLowerCase() === inputLower;

        if (keyMatch || namaMatch || emailMatch) {
          userRecord = data;
          uid = key;
          console.log('User found:', { uid, userRecord });
          break;
        }
      }

      if (!userRecord) {
        setError('Username atau email tidak ditemukan.');
        setLoading(false);
        return;
      }

      // Validasi password
      if (userRecord.password !== password) {
        setError('Password salah!');
        setLoading(false);
        return;
      }

      // Simpan ke localStorage
      localStorage.setItem('username', uid);
      localStorage.setItem('displayName', userRecord.nama || uid);
      localStorage.setItem('role', userRecord.role || 'user');

      console.log('Login success!');

      // Set user state di App.jsx untuk trigger render Dashboard
      if (onLogin) {
        onLogin({
          username: uid,
          displayName: userRecord.nama || uid,
          role: userRecord.role || 'user'
        });
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan saat login: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-4 border border-white/20">
            <Calendar className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Smart Schedule</h1>
          <p className="text-white/70">Kelola jadwal Anda dengan mudah</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Selamat Datang! 👋</h2>
            <p className="text-slate-600">Masuk untuk melanjutkan</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <p className="text-sm text-rose-700 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username atau Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
                  placeholder="Masukkan username atau email"
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
                  placeholder="Masukkan password"
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-slate-600">Ingat saya</span>
              </label>
              <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Memeriksa...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Belum punya akun?{' '}
              <a href="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Daftar sekarang
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-white/50 text-sm mt-6">
          © 2025 Smart Schedule. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
