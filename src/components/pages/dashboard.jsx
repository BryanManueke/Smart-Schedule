import React, { useState, useEffect } from 'react';
import { schedulesAPI } from '../../config/api';
import Jadwal from './Jadwal';
import Profile from './Profile';
import { StatCard, NavGroup, Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState, Button, Badge } from '../ui';
import { LoadingScreen } from '../ui/LoadingSpinner';
import { Calendar } from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [totalSchedules, setTotalSchedules] = useState(0);
  const [remindersCount, setRemindersCount] = useState(0);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem('username');
      if (!u) {
        if (typeof window !== 'undefined') window.location.href = '/login';
        return;
      }
      setCurrentUser(u);

      const loadData = async () => {
        try {
          const items = await schedulesAPI.getByUser(u);
          const schedules = items || [];

          setTotalSchedules(schedules.length);

          const reminders = schedules.filter((s) => !s.status || s.status !== 'Selesai').length;
          setRemindersCount(reminders);

          const today = new Date().toISOString().split('T')[0];
          const todayItems = schedules.filter((s) => (s.tanggal || s.date || '').startsWith ? (s.tanggal || s.date || '').startsWith(today) : (s.tanggal || s.date) === today);
          setTodaySchedules(todayItems);

          const scheduleActivities = schedules
            .map((s) => ({
              type: 'schedule',
              title: s.kegiatan || s.title || 'Jadwal baru',
              date: s.createdAt || s.date || '',
              id: s.id,
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          setRecentActivities(scheduleActivities.slice(0, 6));
        } catch (e) {
          console.warn('Dashboard data load error:', e);
        }
      };

      loadData();
      const interval = setInterval(loadData, 3000);
      return () => clearInterval(interval);
    } catch (e) {
      console.warn('Dashboard init error:', e);
    }
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'jadwal', label: 'Jadwal', icon: '📅' },
    { id: 'profil', label: 'Profil', icon: '👤' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-lg">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-100">Selamat datang kembali 👋</p>
                  <h1 className="mt-1 text-3xl font-bold">
                    Welcome back {user.username}!
                  </h1>
                  <p className="mt-2 text-sm text-indigo-100">
                    Smart Schedule siap membantu Anda mengatur jadwal dan meningkatkan produktivitas hari ini.
                  </p>
                </div>
                <button
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-md transition hover:bg-indigo-50"
                  onClick={() => setActiveMenu('jadwal')}
                >
                  <span>➕</span>
                  <span>Tambah Jadwal Baru</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <StatCard
                icon="📊"
                label="Total Kegiatan"
                value={totalSchedules}
                helper={totalSchedules > 0 ? `+${Math.max(0, Math.floor(totalSchedules * 0.1))} dari minggu lalu` : '-'}
                variant="primary"
              />
              <StatCard
                icon="✅"
                label="Selesai Hari Ini"
                value={`${todaySchedules.filter((s) => s.status === 'Selesai').length}/${todaySchedules.length || 0}`}
                helper={
                  todaySchedules.length
                    ? `${Math.round(
                      (todaySchedules.filter((s) => s.status === 'Selesai').length / todaySchedules.length) * 100,
                    )}% completion rate`
                    : 'Belum ada'
                }
                variant="success"
              />
              <StatCard icon="⏰" label="Reminder Aktif" value={remindersCount} helper="Notifikasi WhatsApp" variant="warning" />
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <CardTitle>Kegiatan Hari Ini</CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveMenu('jadwal')}>
                    Lihat Semua →
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedules.length === 0 ? (
                    <EmptyState
                      icon="📭"
                      title="Tidak ada kegiatan hari ini"
                      description="Mulai tambahkan jadwal untuk hari ini"
                    />
                  ) : (
                    todaySchedules.map((s) => {
                      const start = s.waktu || s.waktuMulai || s.time || '';
                      const duration = s.duration || s.durasi || '';
                      const title = s.kegiatan || s.title || 'Tanpa judul';
                      const category = s.kategori || '';
                      const status = s.status || 'Belum Dilaksanakan';

                      return (
                        <div key={s.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:flex-row">
                          <div className="w-full md:w-40">
                            <p className="text-lg font-semibold text-slate-900">{start || 'Waktu TBD'}</p>
                            <p className="text-xs text-slate-500">{duration || 'Durasi tidak ditentukan'}</p>
                          </div>
                          <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                              <span
                                className={`h-3 w-3 rounded-full ${(s.prioritas || '').toLowerCase() === 'tinggi'
                                    ? 'bg-rose-500'
                                    : (s.prioritas || '').toLowerCase() === 'rendah'
                                      ? 'bg-emerald-500'
                                      : 'bg-amber-500'
                                  }`}
                              />
                              <p className="text-sm font-medium capitalize text-slate-500">{s.prioritas || 'sedang'}</p>
                            </div>
                            <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
                            {category && <p className="text-sm text-slate-500">Kategori: {category}</p>}
                            <Badge variant={status === 'Selesai' ? 'success' : status === 'Sedang Berlangsung' ? 'primary' : 'warning'}>
                              {status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveMenu('jadwal')}>
                    Lihat Semua →
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentActivities.length === 0 ? (
                  <EmptyState
                    icon="📭"
                    title="Tidak ada aktivitas terbaru"
                    description="Aktivitas Anda akan muncul di sini"
                  />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {recentActivities.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 shadow-sm"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 text-lg">
                          📅
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-slate-900">{act.title}</h4>
                          <p className="text-xs text-slate-500">Kegiatan baru</p>
                          <span className="text-xs text-slate-400">
                            {act.date ? new Date(act.date).toLocaleString('id-ID') : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'jadwal':
        return <Jadwal />;
      case 'profil':
        return <Profile />;
      default:
        return <div className="text-slate-500">Pilih menu di sidebar.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-white/10 bg-slate-900/60 p-6 backdrop-blur xl:flex">
        <div className="mb-10 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl">
            <Calendar className="h-6 w-6 text-white" />
          </span>
          <div>
            <p className="text-sm text-slate-400">Smart Schedule</p>
            <p className="text-lg font-semibold text-white">Productivity</p>
          </div>
        </div>

        <NavGroup
          items={menuItems}
          activeItem={activeMenu}
          onItemClick={(id) => setActiveMenu(id)}
        />

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/30 text-lg font-semibold text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.username}</p>
              <p className="text-xs text-slate-400">Premium User</p>
            </div>
          </div>
          <button
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            onClick={onLogout}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-100/70 p-6 sm:p-10">
        <div className="mx-auto max-w-6xl">
          {/* Mobile Menu */}
          <div className="mb-6 flex gap-3 xl:hidden">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold ${activeMenu === item.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                onClick={() => setActiveMenu(item.id)}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;