import React, { useState, useEffect } from "react";
import { schedulesAPI } from "../../config/api";
import ConfirmModal from "../ConfirmModal";
import { StatCard, SearchInput, Input, Textarea, Select, Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState, Button, IconButton, StatusBadge, PriorityBadge, Modal, ModalFooter, LoadingScreen } from "../ui";

const Jadwal = () => {
  const [schedules, setSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showConfirmDeleteScheduleId, setShowConfirmDeleteScheduleId] = useState(null);
  const [formData, setFormData] = useState({
    kegiatan: "",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    lokasi: "",
    prioritas: "Sedang",
    catatan: "",
    status: "Belum Dilaksanakan",
  });

  useEffect(() => {
    try {
      const u = localStorage.getItem("username");
      if (u) {
        setCurrentUser(u);
      } else {
        window.location.href = "/login";
      }
    } catch (e) {
      console.warn("Gagal membaca localStorage:", e);
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const loadSchedules = async () => {
      try {
        const data = await schedulesAPI.getByUser(currentUser);
        if (data && Array.isArray(data)) {
          const loadedSchedules = data.map(item => ({
            id: item.id,
            ...item,
          }));
          loadedSchedules.sort((a, b) => {
            const dateA = new Date(`${a.tanggal} ${a.waktuMulai || "00:00"}`);
            const dateB = new Date(`${b.tanggal} ${b.waktuMulai || "00:00"}`);
            return dateB - dateA;
          });
          setSchedules(loadedSchedules);
        } else {
          setSchedules([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading schedules:", error);
        setSchedules([]);
        setLoading(false);
      }
    };

    loadSchedules();
    const interval = setInterval(loadSchedules, 2000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const resetForm = () => {
    setFormData({
      kegiatan: "",
      tanggal: new Date().toISOString().split("T")[0],
      waktuMulai: "08:00",
      waktuSelesai: "09:00",
      lokasi: "",
      prioritas: "Sedang",
      catatan: "",
      status: "Belum Dilaksanakan",
    });
    setEditingSchedule(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      kegiatan: schedule.kegiatan || "",
      tanggal: schedule.tanggal || "",
      waktuMulai: schedule.waktuMulai || "08:00",
      waktuSelesai: schedule.waktuSelesai || "09:00",
      lokasi: schedule.lokasi || "",
      prioritas: schedule.prioritas || "Sedang",
      catatan: schedule.catatan || "",
      status: schedule.status || "Belum Dilaksanakan",
    });
    setShowModal(true);
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();

    if (!formData.kegiatan.trim()) {
      alert("Nama kegiatan harus diisi!");
      return;
    }

    const scheduleData = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingSchedule) {
        await schedulesAPI.update(currentUser, editingSchedule.id, scheduleData);
      } else {
        await schedulesAPI.create(currentUser, scheduleData);
      }
      setShowModal(false);
      resetForm();
      const data = await schedulesAPI.getByUser(currentUser);
      setSchedules(data || []);
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Gagal menyimpan jadwal!");
    }
  };

  const handleDeleteSchedule = (scheduleId) => {
    setShowConfirmDeleteScheduleId(scheduleId);
  };

  const confirmDeleteSchedule = async (id) => {
    try {
      await schedulesAPI.delete(currentUser, id);
      setShowConfirmDeleteScheduleId(null);
      const data = await schedulesAPI.getByUser(currentUser);
      setSchedules(data || []);
    } catch (err) {
      console.warn("Failed to remove schedule:", err);
    }
  };

  const handleToggleStatus = async (schedule) => {
    const statusFlow = {
      "Belum Dilaksanakan": "Sedang Berlangsung",
      "Sedang Berlangsung": "Selesai",
      Selesai: "Belum Dilaksanakan",
    };
    const newStatus = statusFlow[schedule.status] || "Belum Dilaksanakan";
    try {
      await schedulesAPI.update(currentUser, schedule.id, {
        status: newStatus,
      });
      const data = await schedulesAPI.getByUser(currentUser);
      setSchedules(data || []);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredSchedules = schedules.filter((s) => {
    const matchSearch =
      s.kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.lokasi && s.lokasi.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = filterStatus === "" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: schedules.length,
    pending: schedules.filter((s) => s.status === "Belum Dilaksanakan").length,
    ongoing: schedules.filter((s) => s.status === "Sedang Berlangsung").length,
    done: schedules.filter((s) => s.status === "Selesai").length,
  };

  if (loading) {
    return <LoadingScreen message="Memuat data jadwal..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header - Matching Dashboard Style */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📅</span>
              <h1 className="text-3xl font-bold">Kelola Jadwal</h1>
            </div>
            <p className="text-sm text-indigo-100">
              Pantau dan atur seluruh kegiatan Anda dengan mudah
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-md transition hover:bg-indigo-50"
          >
            <span>➕</span>
            <span>Tambah Jadwal Baru</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="📊" label="Total Jadwal" value={stats.total} />
        <StatCard icon="⏳" label="Belum Dilaksanakan" value={stats.pending} variant="warning" />
        <StatCard icon="⚡" label="Sedang Berlangsung" value={stats.ongoing} variant="info" />
        <StatCard icon="✅" label="Selesai" value={stats.done} variant="success" />
      </div>

      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <SearchInput
              placeholder="Cari kegiatan atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: "", label: "🔍 Semua Status" },
                { value: "Belum Dilaksanakan", label: "⏳ Belum Dilaksanakan" },
                { value: "Sedang Berlangsung", label: "⚡ Sedang Berlangsung" },
                { value: "Selesai", label: "✅ Selesai" },
              ]}
              className="md:w-auto"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {filteredSchedules.length === 0 ? (
              <EmptyState
                icon="📭"
                title="Belum ada jadwal"
                description="Mulai tambahkan jadwal pertama Anda untuk mengatur kegiatan dengan lebih baik."
                action={
                  <Button onClick={handleOpenAddModal}>
                    ➕ Tambah Jadwal
                  </Button>
                }
                className="col-span-full"
              />
            ) : (
              filteredSchedules.map((schedule) => (
                <Card key={schedule.id} variant="filled" className="transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <PriorityBadge priority={schedule.prioritas || "Sedang"} />
                    <div className="flex gap-2">
                      <IconButton
                        title="Edit"
                        onClick={() => handleOpenEditModal(schedule)}
                      >
                        ✏️
                      </IconButton>
                      <IconButton
                        variant="danger"
                        title="Hapus"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        🗑️
                      </IconButton>
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{schedule.kegiatan}</h3>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{schedule.tanggal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕐</span>
                      <span>
                        {schedule.waktuMulai || "08:00"} - {schedule.waktuSelesai || "09:00"}
                      </span>
                    </div>
                    {schedule.lokasi && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{schedule.lokasi}</span>
                      </div>
                    )}
                  </div>

                  {schedule.catatan && (
                    <div className="mt-4 rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-600">
                      💬 {schedule.catatan}
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                      className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:scale-105 ${schedule.status === "Selesai"
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : schedule.status === "Sedang Berlangsung"
                            ? "bg-indigo-500 text-white hover:bg-indigo-600"
                            : "bg-amber-500 text-white hover:bg-amber-600"
                        }`}
                      onClick={() => handleToggleStatus(schedule)}
                      title="Klik untuk ubah status"
                    >
                      {schedule.status === "Selesai" && "✅ "}
                      {schedule.status === "Sedang Berlangsung" && "⚡ "}
                      {schedule.status === "Belum Dilaksanakan" && "⏳ "}
                      {schedule.status}
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingSchedule ? "✏️ Edit Jadwal" : "➕ Tambah Jadwal Baru"}
        size="md"
      >
        <form className="space-y-4" onSubmit={handleSaveSchedule}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Nama Kegiatan"
                name="kegiatan"
                value={formData.kegiatan}
                onChange={(e) => setFormData({ ...formData, kegiatan: e.target.value })}
                placeholder="Contoh: Meeting tim, Belajar, Olahraga"
                required
              />
            </div>
            <Input label="Tanggal" name="tanggal" type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} />
            <Input label="Waktu Mulai" name="waktuMulai" type="time" value={formData.waktuMulai} onChange={(e) => setFormData({ ...formData, waktuMulai: e.target.value })} />
            <Input label="Waktu Selesai" name="waktuSelesai" type="time" value={formData.waktuSelesai} onChange={(e) => setFormData({ ...formData, waktuSelesai: e.target.value })} />
            <Input label="Lokasi" name="lokasi" value={formData.lokasi} onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} placeholder="Contoh: Zoom, Kantor, Rumah" />
            <Select
              label="Prioritas"
              name="prioritas"
              value={formData.prioritas}
              onChange={(e) => setFormData({ ...formData, prioritas: e.target.value })}
              options={[
                { value: "Tinggi", label: "🔴 Tinggi" },
                { value: "Sedang", label: "🟡 Sedang" },
                { value: "Rendah", label: "🟢 Rendah" },
              ]}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: "Belum Dilaksanakan", label: "⏳ Belum Dilaksanakan" },
                { value: "Sedang Berlangsung", label: "⚡ Sedang Berlangsung" },
                { value: "Selesai", label: "✅ Selesai" },
              ]}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Catatan"
                name="catatan"
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                placeholder="Catatan tambahan"
              />
            </div>
          </div>

          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit">
              {editingSchedule ? "Simpan Perubahan" : "Simpan Jadwal"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      <ConfirmModal
        open={!!showConfirmDeleteScheduleId}
        title="Hapus Jadwal"
        message="Apakah Anda yakin ingin menghapus jadwal ini?"
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={() => confirmDeleteSchedule(showConfirmDeleteScheduleId)}
        onCancel={() => setShowConfirmDeleteScheduleId(null)}
      />
    </div>
  );
};

export default Jadwal;
