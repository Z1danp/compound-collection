# 🧪 Renik — Chemical Compound Collection App

> **Renik** (Compound Collection) adalah aplikasi web full-stack yang dirancang untuk mencatat, memvisualisasikan, dan mengelola koleksi senyawa kimia secara terstruktur dengan visualisasi struktur 2D real-time.

---

## 🌟 Fitur Utama

- 🔐 **Autentikasi & Akun Tamu (Guest Mode)**
  - Pendaftaran (Register) dan Masuk (Login) aman menggunakan hashing password **bcrypt** dan **JWT** yang disimpan dalam HttpOnly cookies.
  - **Akses Tamu (Guest)**: Cukup 1 kali klik untuk mencoba aplikasi tanpa registrasi. Akun tamu akan dibersihkan secara otomatis setiap hari via cron job.
  - **Protected Routes**: Middleware otorisasi di sisi client (React Router) dan server (Express).

- 🧬 **Visualisasi Struktur Kimia 2D Real-time**
  - Render otomatis struktur molekul 2D secara *client-side* dari notasi **SMILES** menggunakan **SmilesDrawer** (`SvgDrawer`).
  - Nol latency dan tanpa ketergantungan API eksternal untuk proses rendering gambar struktur.

- 🏷️ **Sistem Tag Ternormalisasi & Filter Multi-Tag**
  - Mengorganisir senyawa kimia menggunakan tag custom dengan relasi **many-to-many** (tabel penghubung `compound_tags`).
  - **Filter Bar Interaktif**: Filter senyawa berdasarkan satu atau beberapa tag sekaligus dengan logika filter presisi (`AND` condition via `.every()`).

- 📝 **Catatan Riset Berbasis Markdown**
  - Dukungan sintaks Markdown untuk kolom catatan (`notes`), memudahkan pencatatan sifat fisik, mekanisme reaksi, atau ringkasan literatur.
  - Fitur **Favorite (`is_favorite`)** untuk menyematkan (*pin*) senyawa penting ke bagian atas daftar.

- ⚡ **Arsitektur Modern & Ringan**
  - Dibangun dengan **React 19**, **Vite**, **Tailwind CSS v4**, **Express.js**, dan **PostgreSQL**.
  - Siap dideploy secara serverless di **Vercel**.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Structure Rendering**: [SmilesDrawer 2.4](https://github.com/reimund/smilesDrawer)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend & Database
- **Runtime & Framework**: [Node.js](https://nodejs.org/) (ES Modules) + [Express.js 5](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (`pg` connection pool)
- **Keamanan**: `bcrypt` (password hashing), `jsonwebtoken` (JWT auth), `cookie-parser`, `cors`
- **Otomasi**: `node-cron` & Vercel Cron (`/api/cron/cleanup-guests`)

---

## 📂 Struktur Project

```text
compound-collection/
├── api/
│   └── server.js            # Entry point Express serverless (Vercel)
├── controllers/
│   ├── noteControllers.js   # Logika CRUD compound & manajemen tag
│   └── userControllers.js   # Logika Auth (login, register, guest, me, logout)
├── db/
│   ├── pool.js              # Koneksi PostgreSQL database pool
│   └── schema.sql           # Skema tabel database
├── docs/
│   └── mekanisme-filter-tag.md # Dokumentasi alur & logika filter tag
├── middlewares/
│   └── authMiddleware.js    # Middleware verifikasi token JWT
├── routes/
│   └── renik.js             # Route endpoints API
├── src/
│   ├── assets/              # Aset gambar & icon SVG
│   ├── components/
│   │   ├── auth/            # AuthContext, ProtectedRoute, Login & Regist forms
│   │   ├── collection/      # Main Collection view, Form Add/Edit, FilterBar, List Card
│   │   └── icons/           # Komponen Icon React (Renik logo, Caffeine structure)
│   ├── lib/
│   │   └── api.js           # Fetch wrapper tersentralisasi dengan credentials
│   ├── App.jsx              # Routing aplikasi & Provider setup
│   ├── main.jsx             # Entry point React DOM
│   └── index.css            # Tailwind CSS v4 import
├── vercel.json              # Konfigurasi deployment Vercel
├── vite.config.js           # Konfigurasi Vite
└── package.json
