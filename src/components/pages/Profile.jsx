import React, { useEffect, useState } from "react";
import { usersAPI, schedulesAPI, chatsAPI } from "../../config/api";
import ConfirmModal from "../ConfirmModal";
import { Input, Textarea, Select, Card, CardHeader, CardTitle, CardDescription, CardContent, TabGroup, Button, LoadingScreen, LoadingOverlay, Badge } from "../ui";

const Profile = () => {
  const [profile, setProfile] = useState({
    nama: "",
    email: "",
    nomor: "",
    jenisKelamin: "",
    password: "",
    bio: "",
    tanggalLahir: "",
    pekerjaan: "",
    lokasi: "",
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [stats, setStats] = useState({
    totalSchedules: 0,
    totalChats: 0,
    memberSince: "",
  });
  const [deleting, setDeleting] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmDeleteFinal, setShowConfirmDeleteFinal] = useState(false);
  const [infoModal, setInfoModal] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      setInfoModal({
        title: "Belum Login",
        message: "Kamu belum login!",
        confirmLabel: "Masuk",
        cancelLabel: "Tutup",
        onConfirm: () => {
          setInfoModal(null);
          window.location.href = "/login";
        },
      });
      return;
    }

    setCurrentUser(username);

    const loadData = async () => {
      try {
        // Load user profile
        const userData = await usersAPI.getByUsername(username);
        if (userData) {
          setProfile(userData);
          setOriginalProfile(userData);

          if (userData.createdAt) {
            const ts = Number(userData.createdAt);
            const date = Number.isNaN(ts) ? new Date(userData.createdAt) : new Date(ts);
            setStats((prev) => ({
              ...prev,
              memberSince: date.toLocaleDateString("id-ID", { year: "numeric", month: "long" }),
            }));
          }
        }

        // Load schedules count
        const schedules = await schedulesAPI.getByUser(username);
        setStats((prev) => ({ ...prev, totalSchedules: schedules ? schedules.length : 0 }));

        // Load chats count
        const chats = await chatsAPI.getByUser(username);
        setStats((prev) => ({ ...prev, totalChats: chats ? chats.length : 0 }));

        setLoading(false);
      } catch (error) {
        console.error("Error loading profile:", error);
        setLoading(false);
      }
    };

    loadData();
    // Poll for updates every 3 seconds
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setHasChanges(JSON.stringify(profile) !== JSON.stringify(originalProfile));
  }, [profile, originalProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentUser) return;

    if (!profile.nama?.trim()) {
      setInfoModal({ title: "Perhatian", message: "⚠️ Nama lengkap harus diisi!" });
      return;
    }

    if (!profile.email?.trim()) {
      setInfoModal({ title: "Perhatian", message: "⚠️ Email harus diisi!" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      setInfoModal({ title: "Perhatian", message: "⚠️ Format email tidak valid!" });
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        ...profile,
        updatedAt: new Date().toISOString(),
      };
      await usersAPI.update(currentUser, updateData);
      setOriginalProfile(updateData);
      setInfoModal({ title: "Sukses", message: "✅ Profil berhasil diperbarui!" });
    } catch (error) {
      console.error(error);
      setInfoModal({ title: "Gagal", message: "❌ Gagal menyimpan profil!" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setHasChanges(false);
  };

  const handleLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      localStorage.removeItem("username");
      window.location.href = "/login";
    }, 600);
  };

  const handleDeleteAccount = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDeleteFirst = () => {
    setShowConfirmDelete(false);
    setShowConfirmDeleteFinal(true);
  };

  const handleConfirmDeleteFinal = async () => {
    setShowConfirmDeleteFinal(false);
    if (!currentUser) {
      setInfoModal({
        title: "Error",
        message: "Tidak dapat menemukan user saat ini. Silakan login terlebih dahulu.",
        onConfirm: () => {
          setInfoModal(null);
          window.location.href = "/login";
        },
      });
      return;
    }

    try {
      setDeleting(true);
      // Delete user data
      await usersAPI.delete(currentUser);

      localStorage.removeItem("username");
      setInfoModal({
        title: "Sukses",
        message: "Akun dan semua data berhasil dihapus.",
        onConfirm: () => {
          setInfoModal(null);
          window.location.href = "/login";
        },
      });
    } catch (err) {
      console.error("Gagal menghapus akun:", err);
      setInfoModal({ title: "Gagal", message: "Gagal menghapus akun. Silakan coba lagi nanti." });
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Memuat data profil..." />;
  }

  const tabs = [
    { id: "personal", label: "Informasi Pribadi", icon: "👤" },
    { id: "account", label: "Keamanan Akun", icon: "🔐" },
    { id: "settings", label: "Pengaturan", icon: "⚙️" },
  ];

  return (
    <div className="space-y-8">
      <ConfirmModal
        open={showConfirmDelete}
        title="Hapus Akun"
        message={`⚠️ PERINGATAN!\n\nMenghapus akun akan menghapus semua data Anda secara permanen termasuk:\n• Semua jadwal\n• Riwayat chat AI\n• Informasi profil\n\nTindakan ini TIDAK DAPAT dibatalkan!\n\nApakah Anda yakin ingin melanjutkan?`}
        confirmLabel="Lanjut"
        cancelLabel="Batal"
        onConfirm={handleConfirmDeleteFirst}
        onCancel={() => setShowConfirmDelete(false)}
      />
      <ConfirmModal
        open={showConfirmDeleteFinal}
        title="Konfirmasi Terakhir"
        message="Konfirmasi sekali lagi: Apakah Anda benar-benar ingin menghapus akun?"
        confirmLabel="Hapus Akun"
        cancelLabel="Batal"
        onConfirm={handleConfirmDeleteFinal}
        onCancel={() => setShowConfirmDeleteFinal(false)}
      />
      {infoModal && (
        <ConfirmModal
          open
          title={infoModal.title}
          message={infoModal.message}
          confirmLabel={infoModal.confirmLabel || "OK"}
          cancelLabel={infoModal.cancelLabel || "Tutup"}
          onConfirm={() => {
            if (infoModal.onConfirm) infoModal.onConfirm();
            setInfoModal(null);
          }}
          onCancel={() => {
            if (infoModal.onCancel) infoModal.onCancel();
            setInfoModal(null);
          }}
        />
      )}

      {(deleting || logoutLoading) && (
        <LoadingOverlay message={deleting ? "Menghapus akun..." : "Keluar..."} />
      )}

      <Card>
        <CardContent>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-600/10 text-3xl font-bold text-indigo-600">
                  {profile.nama?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <Button
                  className="absolute -right-2 bottom-2 h-8 w-8 rounded-full p-0"
                  variant="secondary"
                  title="Keluar"
                  onClick={handleLogout}
                >
                  🚪
                </Button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{profile.nama || "Nama Belum Diatur"}</h1>
                <p className="text-sm text-slate-500">@{currentUser}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="warning">Premium User</Badge>
                  <Badge variant="success">✓ Verified</Badge>
                </div>
              </div>
            </div>

            <div className="grid flex-shrink-0 grid-cols-2 gap-4 text-center sm:w-64">
              <Card variant="filled" padding={true}>
                <p className="text-sm text-slate-500">Jadwal</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalSchedules}</p>
              </Card>
              <Card variant="filled" padding={true}>
                <p className="text-sm text-slate-500">Member Sejak</p>
                <p className="text-lg font-semibold text-slate-900">{stats.memberSince || "2024"}</p>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id)}
      />

      <Card>
        <CardContent>
          {activeTab === "personal" && (
            <>
              <CardHeader>
                <CardTitle>📝 Informasi Pribadi</CardTitle>
                <CardDescription>Kelola data pribadi dan informasi kontak Anda</CardDescription>
              </CardHeader>
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Nama Lengkap" name="nama" value={profile.nama} onChange={handleChange} placeholder="Masukkan nama lengkap" required />
                <Input label="Email" name="email" type="email" value={profile.email} onChange={handleChange} placeholder="nama@email.com" required />
                <Input label="Nomor WhatsApp" name="nomor" value={profile.nomor} onChange={handleChange} placeholder="628xxxxxxxxxx" />
                <Select
                  label="Jenis Kelamin"
                  name="jenisKelamin"
                  value={profile.jenisKelamin}
                  onChange={handleChange}
                  options={[
                    { label: "Pilih jenis kelamin", value: "" },
                    { label: "Laki-laki", value: "Laki-laki" },
                    { label: "Perempuan", value: "Perempuan" },
                  ]}
                />
                <Input label="Tanggal Lahir" name="tanggalLahir" type="date" value={profile.tanggalLahir} onChange={handleChange} />
                <Input label="Pekerjaan" name="pekerjaan" value={profile.pekerjaan} onChange={handleChange} placeholder="Product Manager" />
                <Input label="Lokasi" name="lokasi" value={profile.lokasi} onChange={handleChange} placeholder="Jakarta, Indonesia" />
                <div className="md:col-span-2">
                  <Textarea label="Bio Singkat" name="bio" value={profile.bio} onChange={handleChange} placeholder="Ceritakan tentang dirimu..." />
                </div>
              </div>
            </>
          )}

          {activeTab === "account" && (
            <>
              <CardHeader>
                <CardTitle>🔐 Keamanan Akun</CardTitle>
                <CardDescription>Atur password dan keamanan akun Anda</CardDescription>
              </CardHeader>
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">Password</label>
                  <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={profile.password || ""}
                      onChange={handleChange}
                      className="flex-1 rounded-2xl bg-transparent px-4 py-3 text-slate-800 outline-none"
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      className="px-4 text-sm font-semibold text-indigo-600"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Sembunyikan" : "Tampilkan"}
                    </button>
                  </div>
                </div>

                <Card variant="outlined" className="border-rose-100 bg-rose-50">
                  <CardContent>
                    <h3 className="text-lg font-semibold text-rose-700">Zona Bahaya ⚠️</h3>
                    <p className="mt-2 text-sm text-rose-600">Hati-hati saat menghapus akun. Tindakan ini permanen!</p>
                    <Button
                      variant="danger"
                      className="mt-4 w-full"
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      loading={deleting}
                    >
                      Hapus Akun
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab === "settings" && (
            <>
              <CardHeader>
                <CardTitle>⚙️ Pengaturan</CardTitle>
                <CardDescription>Atur preferensi notifikasi dan tampilan</CardDescription>
              </CardHeader>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-base font-semibold text-slate-900">Notifikasi</h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Email reminder jadwal
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Push notification
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Ringkasan mingguan
                    </label>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-base font-semibold text-slate-900">Tampilan</h3>
                  <label className="mt-4 block text-sm font-semibold text-slate-600">Tema</label>
                  <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none">
                    <option>Modern (default)</option>
                    <option>Minimalis</option>
                    <option>Gelap</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={handleCancel}
          disabled={!hasChanges}
        >
          Reset Perubahan
        </Button>
        <Button
          className="flex-1"
          onClick={handleSave}
          disabled={!hasChanges || saving}
          loading={saving}
        >
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
};

export default Profile;

