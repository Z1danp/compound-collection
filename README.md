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

- 📝 **Catatan (Notes)**
  - Kolom catatan (`notes`) fleksibel untuk menyimpan informasi sifat fisik, mekanisme reaksi, ketersediaan di lab, atau ringkasan literatur dalam bentuk teks.
  - Fitur **Favorite (`is_favorite`)** untuk menyematkan (*pin*) senyawa penting ke bagian atas daftar.

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
```

---

## 🗄️ Skema Database (PostgreSQL)

Aplikasi ini menggunakan skema relasional yang terstruktur dan ternormalisasi:

```sql
-- Tabel Users (Mendukung akun terdaftar & akun guest)
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    is_guest        BOOLEAN NOT NULL DEFAULT false,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabel Compounds
CREATE TABLE compounds (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    smiles          TEXT NOT NULL,
    notes           TEXT,
    is_favorite     BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabel Tags (Unik per user)
CREATE TABLE tags (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(50) NOT NULL,
    UNIQUE (user_id, name)
);

-- Tabel Penghubung Many-to-Many
CREATE TABLE compound_tags (
    compound_id     INTEGER NOT NULL REFERENCES compounds(id) ON DELETE CASCADE,
    tag_id          INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (compound_id, tag_id)
);

CREATE INDEX idx_compounds_user_id ON compounds(user_id);
CREATE INDEX idx_compound_tags_tag_id ON compound_tags(tag_id);
```

---
