# Dokumentasi SkillLearn

Mata kuliah: COSC6014036 Specialized Platform Development  
Aplikasi: SkillLearn  
Pengguna: siswa dan mahasiswa yang belajar keterampilan praktis di luar kelas formal

## Ringkasan

SkillLearn menyediakan materi artikel, video tutorial, kuis, dan latihan praktik pada empat bidang: pemrograman, desain grafis, digital marketing, dan teknologi. Pengguna wajib daftar dan masuk sebelum membuka materi. Setelah masuk, pengguna dapat menyimpan favorit dan melihat riwayat belajar.

## Alur aplikasi

1. Pengguna membuka aplikasi web atau mobile.
2. Jika belum punya akun, pengguna mengisi nama, email, dan kata sandi di halaman daftar.
3. Server menyimpan kata sandi dalam bentuk hash, lalu mengembalikan token.
4. Jika sudah punya akun, pengguna masuk lewat halaman login.
5. Beranda meminta daftar materi dan riwayat. Permintaan tanpa token ditolak.
6. Pengguna dapat mencari, menyaring bidang, atau menampilkan favorit saja.
7. Membuka sebuah materi menulis riwayat belajar.
8. Pada detail, pengguna dapat menyimpan atau menghapus favorit.
9. Kuis dikirim ke server. Server menghitung skor. Kunci jawaban tidak dikirim bersama soal.
10. Keluar menghapus token di peramban atau di penyimpanan ponsel.

Akun contoh untuk dosen:

- email: `demo@skilllearn.id`
- kata sandi: `demo1234`

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Web | React, React Router, Vite |
| Mobile | React Native, Expo, Expo Router |
| Server | Node.js, Express |
| Database | MongoDB, Mongoose |
| Autentikasi | JWT, bcrypt |

Web dan mobile tidak memiliki basis data sendiri. Keduanya memanggil API yang sama.

## Halaman

1. Daftar
2. Masuk
3. Beranda
4. Detail materi

Beranda memuat pencarian, saringan bidang, blok lanjutkan belajar, dan kartu materi. Detail menyesuaikan isi dengan jenis materi: teks, pemutar video, langkah latihan, atau soal kuis.

## Tautan yang diisi setelah deploy

- Figma: `tempel tautan setelah file dibagikan`
- Gambar layar untuk Figma: `docs/figma-frames/` (delapan file PNG, web dan mobile)
- Web: `BELUM DIISI`
- API health: `BELUM DIISI`
- Expo Go QR: `BELUM DIISI`
- Kode sumber atau zip: `BELUM DIISI`

Figma belum bisa diterbitkan dari lingkungan pengerjaan ini. Buat delapan frame dengan sistem visual di bawah, lalu tempel tautannya di sini dan di lembar jawaban. Delapan frame: daftar, masuk, beranda, dan detail, masing-masing untuk web dan mobile.

Warna:

- kertas `#f3efe6`
- kartu `#fffdf8`
- teks `#1f1a17`
- hijau `#145c45`
- aksen tombol `#b85c38`
- garis kartu menurut jenis: artikel hijau, video biru `#1d4e89`, kuis cokelat `#8a4b08`, latihan merah `#8c2f39`

## Menjalankan kode

Lihat `README.md` di folder `skilllearn`. Node.js 18 atau lebih baru diperlukan. MongoDB lokal dapat dijalankan dengan `docker compose up -d`.

## Tangkapan layar

Simpan tangkapan layar halaman daftar, masuk, beranda, dan detail untuk web dan mobile di folder `docs/screenshots`, lalu sematkan pada dokumen Word atau PDF yang dikumpulkan.
