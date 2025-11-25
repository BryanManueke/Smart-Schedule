import React, { useState } from 'react';
import { normalizePhone } from '../../utils/phone';

function LupaPassword() {
  const [account, setAccount] = useState('');
  const [country, setCountry] = useState('62');
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotif('');

    try {
      const raw = (account || '').trim();
      const combined = raw.startsWith('+') ? raw.slice(1) : raw;
      const norm = normalizePhone(combined);
      console.log('[ForgotPassword] requesting server reset for phone=', norm);

      const serverUrl =
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:4000/api/operator/reset-password'
          : `${window.location.protocol}//${window.location.hostname}/api/operator/reset-password`;

      const resp = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomor: norm }),
      });

      const json = await resp.json();
      if (!resp.ok) {
        console.warn('[ForgotPassword] server responded error', json);
        setNotif('User dengan nomor tersebut tidak ditemukan.');
        setLoading(false);
        setTimeout(() => setNotif(''), 3000);
        return;
      }

      setNotif('Password berhasil direset! Silakan cek WhatsApp Anda.');
    } catch (err) {
      console.error('Reset error:', err);
      setNotif('Gagal reset password!');
    }

    setLoading(false);
    setTimeout(() => setNotif(''), 3000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4">
      {notif && (
        <div className="fixed top-6 right-6 z-50 rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-2xl">
          {notif}
        </div>
      )}

      <div className="w-full max-w-lg rounded-2xl bg-white p-10 shadow-2xl ring-1 ring-slate-100">
        <div className="mb-6">
          <a href="/" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
            ← Back to log in
          </a>
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Forgot your password?</h2>
        <p className="mt-2 text-base text-slate-500">
          Masukkan nomor WhatsApp yang terdaftar. Kami akan mengirimkan password baru (6 digit) melalui WhatsApp.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Nomor WhatsApp</label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="mr-2 text-slate-500">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.25v-.5A4.75 4.75 0 019.25 14h5.5a4.75 4.75 0 014.75 4.75v.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value.replace(/[^0-9+]/g, ''))}
                placeholder="628xxxxxxxxxx"
                className="w-full bg-transparent text-base text-slate-800 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Country</label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="mr-3 inline-flex items-center">
                <img src="https://flagcdn.com/id.svg" alt="ID" className="h-6 w-10 rounded-md object-cover" />
              </span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-transparent text-base text-slate-800 outline-none"
              >
                <option value="62">Indonesia (+62)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Processing...' : 'Recover password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LupaPassword;