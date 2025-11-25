git add README.md# AI Planner - Aplikasi Jadwal Belajar

Aplikasi untuk merencanakan dan mengelola jadwal belajar Anda.

## Struktur Project

## Teknologi yang Digunakan

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Database**: JSON Server (lokal)
- **UI Components**: Lucide React Icons

## Cara Menjalankan Aplikasi

### 1. Install Dependencies

Pertama, install semua dependencies yang diperlukan:

```bash
npm install
```

### 2. Jalankan JSON Server

Buka terminal pertama dan jalankan JSON Server:

```bash
npm run server
```

JSON Server akan berjalan di `http://localhost:3001`

### 3. Jalankan Aplikasi React

Buka terminal kedua dan jalankan aplikasi React:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang ditampilkan di terminal)

## Struktur Database (db.json)

Database lokal menggunakan file `db.json` dengan struktur:

```json
{
  "users": {
    "username": {
      "nama": "Nama User",
      "email": "email@example.com",
      "nomor": "628xxx",
      "password": "password",
      "jenisKelamin": "Laki-laki/Perempuan",
      "createdAt": 1700000000000
    }
  },
  "schedules": {
    "username": [
      {
        "id": "unique-id",
        "kegiatan": "Nama Kegiatan",
        "tanggal": "2024-01-01",
        "waktuMulai": "08:00",
        "waktuSelesai": "09:00",
        "lokasi": "Lokasi",
        "prioritas": "Tinggi/Sedang/Rendah",
        "catatan": "Catatan tambahan",
        "status": "Belum Dilaksanakan/Sedang Berlangsung/Selesai",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "chats": {},
  "chatHistory": {}
}
```

## Akun Default

Untuk login pertama kali, gunakan akun default:

- **Username**: Admin
- **Password**: admin123

## Fitur Aplikasi

1. **Autentikasi**
   - Login
   - Signup
   - Forgot Password

2. **Dashboard**
   - Statistik jadwal
   - Kegiatan hari ini
   - Aktivitas terbaru

3. **Kelola Jadwal**
   - Tambah jadwal baru
   - Edit jadwal
   - Hapus jadwal
   - Filter berdasarkan status
   - Pencarian jadwal

4. **Profil**
   - Edit informasi pribadi
   - Ubah password
   - Pengaturan notifikasi
   - Hapus akun

## Catatan Penting

- Pastikan JSON Server berjalan sebelum menggunakan aplikasi
- Data disimpan di file `db.json` secara lokal
- Jika ingin reset data, edit file `db.json` secara manual

## Troubleshooting

### JSON Server tidak berjalan
Pastikan port 3001 tidak digunakan oleh aplikasi lain.

### Data tidak tersimpan
Periksa apakah JSON Server berjalan dengan benar di terminal.

### Error saat login
Pastikan username dan password sesuai dengan data di `db.json`.
