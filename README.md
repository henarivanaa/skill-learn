# SkillLearn

Platform belajar singkat untuk siswa dan mahasiswa. Materi dibuka hanya setelah registrasi dan login. Web, mobile, dan server memakai API yang sama.

## Isi proyek

- `server` — Node.js, Express, MongoDB
- `web` — React
- `mobile` — React Native dengan Expo
- `docs` — jawaban soal 1–3, dokumentasi pengumpulan, dan catatan penggunaan AI

Halaman yang tersedia di web dan mobile:

1. Daftar (`/daftar` dan `/register` di web, `/register` di mobile)
2. Masuk (`/login`)
3. Beranda
4. Detail materi

Fitur tambahan pada beranda dan detail: cari materi, saring bidang, simpan favorit, riwayat belajar, serta kuis yang dinilai di server.

## Menjalankan di komputer sendiri

Gunakan Node.js 18 atau lebih baru. Di mesin ini:

```bash
nvm use 22
```

### 1. Database

Dengan Docker:

```bash
docker compose up -d
```

Salin konfigurasi server bila file `.env` belum ada:

```bash
cp server/.env.example server/.env
```

Nilai lokalnya:

```bash
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/skilllearn
JWT_SECRET=ganti-dengan-rahasia-panjang
```

### 2. API

```bash
cd server
npm install
npm run dev
```

API berjalan di `http://localhost:4000`. Saat koleksi materi masih kosong, server mengisi 12 materi dan akun contoh.

Akun contoh:

- email: `demo@skilllearn.id`
- kata sandi: `demo1234`

Reset materi:

```bash
npm run seed
```

### 3. Web

Terminal baru:

```bash
cd web
npm install
npm run dev
```

Buka `http://localhost:5173`.

### 4. Mobile

Terminal baru:

```bash
cd mobile
npm install
npx expo start
```

Pindai kode QR dengan Expo Go. Ponsel dan komputer harus satu jaringan. Aplikasi memakai alamat komputer pada port `4000`. Untuk publikasikan URL sendiri, isi `EXPO_PUBLIC_API_URL` di `mobile/.env`.

Versi web mobile, untuk pemeriksaan cepat:

```bash
npx expo start --web
```

## Deploy yang kamu kerjakan sendiri

1. Buat cluster MongoDB Atlas dan salin connection string.
2. Deploy folder `server` ke Render atau Railway.
   - `MONGODB_URI`
   - `JWT_SECRET` rahasia yang panjang
   - `PORT` biasanya diisi platform
3. Deploy folder `web` ke Vercel.
   - `VITE_API_URL` = URL API tanpa garis miring di akhir, misalnya `https://skilllearn-api.onrender.com`
4. Untuk Expo Go terhadap API yang sudah online, isi `EXPO_PUBLIC_API_URL` dengan URL yang sama, lalu jalankan `npx expo start` dan lampirkan QR.

Uji `GET /api/health` setelah API online. Harus membalas `{ "ok": true, "service": "skilllearn-api" }`.

## Yang dikumpulkan

- Jawaban soal 1–3 pada lembar jawaban. Draf ada di `docs/jawaban-soal-1-3.md`.
- Dokumentasi, tautan, dan tangkapan layar: `docs/dokumentasi-skilllearn.md`.
- Deklarasi AI sesuai ketentuan Integrated: `docs/deklarasi-ai.md`, dipindahkan ke formulir resmi kampus.
- Kode sumber web, server, dan mobile. Jangan ikutkan `node_modules` di dalam zip. Dosen menjalankan `npm install` di tiap folder.
