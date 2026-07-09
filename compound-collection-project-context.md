# Compound Collection — Project Context

Dokumen ini rangkuman keputusan project buat dipaste sebagai konteks di chat baru.
(Nama app belum final — ganti sesukamu. Buat portofolio, nama yang enak dibaca membantu.)

## Tujuan Project

Bikin **compound collection app** (dari nol) sebagai project belajar dengan 3 tujuan utama:
1. Belajar **auth/login** (konsep baru)
2. Belajar **React hooks baru**: `useContext` + `useReducer`
3. Belajar **deploy** (target: Render)

Ini project lanjutan setelah book tracker (React + Node/Express + PostgreSQL) dan Dota match tracker (vanilla JS). Fondasi yang udah dikuasai: CRUD dasar, interaktivitas, event handling, `useState`, `useEffect`, migrasi vanilla JS → React.

**Kenapa domain kimia, bukan notes app biasa:** skeleton teknisnya identik (CRUD + auth + hooks + deploy), jadi tujuan belajar 100% utuh. Tapi domainnya bikin app ini jadi *differentiator* — nyambung ke background chemistry + rencana S2 chemoinformatics. Framing portofolio: "kimiawan yang bisa ngoding, arah chemoinformatics", bukan "notes app ke sekian".

## Filosofi Belajar (penting)

- **Kode manual + minta dijelasin step-by-step** buat hal BARU: auth (hashing, JWT, middleware, protected routes), `useContext`/`useReducer`, query compounds yang terikat `user_id`, dan (nanti di v2) integrasi PubChem lewat backend + caching.
- **Boleh dipercepat/generate** buat hal yang udah dikuasai: boilerplate setup (Express skeleton, config Tailwind, koneksi PostgreSQL), styling, CRUD interaktivitas dasar yang polanya sama kayak book tracker.
- Prinsip: pakai AI buat mempercepat hal yang udah dikuasai fundamentalnya, BUKAN buat ngeloncatin fundamental yang belum dipegang.

**Kasus khusus — integrasi SmilesDrawer ke React:** ini di tengah-tengah. Render SMILES dasar boleh digenerate, TAPI pola integrasinya layak dipahami, bukan cuma paste. SmilesDrawer itu library imperatif (dia gambar langsung ke elemen canvas/SVG). Di React kita nggak manipulasi DOM langsung, jadi polanya: `useRef` buat pegang elemen + `useEffect` buat panggil `draw()` tiap `smiles` berubah. Ini justru momen belajar hooks yang bagus (pola "escape hatch" useEffect + useRef buat library imperatif) — nyambung ke tujuan #2.

## Tech Stack

- Frontend: **React (Vite)** — bukan Next.js (disimpan buat nanti setelah hooks dikuasai; app ini "app di balik login" jadi Vite lebih pas)
- Backend: **Node/Express**
- Database: **PostgreSQL**
- Styling: **Tailwind CSS**
- Render struktur 2D: **SmilesDrawer** (client-side, nol API)
- Markdown rendering (buat field `notes`): **react-markdown** (Level 1 — bold, italic, heading, list)
- Data enrichment: **PubChem PUG REST** (v2 — dipanggil dari backend, di-cache)
- Deploy: **Render** (Railway udah nggak ada free tier lagi per 2026)

## Catatan Teknis Penting

### SmilesDrawer (render struktur — MVP)
- Status (dicek): npm `smiles-drawer`, versi ~2.3.0, masih aktif dirawat. MIT license.
- **Dependency-free, jalan sepenuhnya client-side** — nol komunikasi server, nol rate limit. Jejak komputasi kecil, aman buat laptop mid-range (bisa render ribuan struktur per halaman).
- Bisa output ke **canvas atau SVG**. Buat React, pakai `SvgDrawer` + `useRef` ke elemen `<svg>`.
- Alternatif lebih berat: **RDKit.js** (WASM, rendering lebih kanonik + fitur kimia lebih lengkap, tapi load lebih berat). BELUM diverifikasi statusnya — cek terpisah kalau nanti butuh presisi lebih. Buat MVP, SmilesDrawer cukup.

### PubChem PUG REST (enrichment — v2)
- Rate limit: **maks 5 request/detik, maks 400 request/menit, maks 300 detik running-time/menit**. Ada throttling dinamis (batas bisa turun saat server ramai; info di HTTP header). **Nggak ada API key** buat naikin limit.
- **Panggil dari backend Express, JANGAN dari browser.** Tiga alasan:
  1. Rate limit gampang dikontrol di server.
  2. CORS — PubChem belum tentu ngasih header yang ngizinin fetch langsung dari browser; proxy lewat backend nyelametin dari CORS error.
  3. Bisa **cache hasil di Postgres** → senyawa yang sama nggak nembak PubChem berulang.
- Pisahkan konsep: **render (SmilesDrawer) = client-side, nol API** vs **enrich (PubChem) = backend + cache**. Jangan ketuker.

### Markdown (field `notes`)
- react-markdown itu renderer, bukan editor/uploader. Dia cuma render string markdown jadi HTML.
- Dipakai buat field `notes` (catatan bebas per senyawa), bukan pusat app.

## Scope Bertahap (MVP-first)

### MVP (v1) — target "selesai & bisa di-deploy"
- Register & login (hash password pakai bcrypt, JWT)
- Protected routes (halaman koleksi cuma bisa diakses kalau login)
- CRUD compounds dasar: create, read, update, delete (terikat `user_id`)
- Field per senyawa: `name`, `smiles`, `notes` (markdown), `tags`
- Render struktur 2D dari SMILES pakai **SmilesDrawer** (client-side)
- Markdown rendering biasa (bold, italic, heading, list) buat `notes` pakai react-markdown
- Fitur favorite (`is_favorite`)
- Auth state pakai `useContext` + `useReducer`
- **Deploy ke Render**

### v2 — setelah MVP live
- Enrichment PubChem lewat backend + cache Postgres (ketik nama/CID → auto-isi rumus, berat molekul, SMILES kanonik). Tambah kolom via `ALTER TABLE` (latihan migrasi).
- Filter & search koleksi (by tag, by nama)
- LaTeX / syntax highlighting di `notes` (opsional): `remark-math` + `rehype-katex`, `rehype-highlight`

### v3 — kalau masih semangat
- Similarity search (PubChem `fastsimilarity_2d`)
- Export koleksi (CSV/JSON)

## Database Schema (SUDAH FINAL — MVP)

```sql
-- Tabel users: nyimpen akun buat login (IDENTIK dengan notes app — auth domain-agnostic)
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabel compounds: tiap senyawa terikat ke satu user
CREATE TABLE compounds (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    smiles      TEXT NOT NULL,
    notes       TEXT,
    tags        TEXT[] NOT NULL DEFAULT '{}',
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index buat mempercepat query "ambil compounds milik user tertentu"
CREATE INDEX idx_compounds_user_id ON compounds(user_id);
```

Catatan schema:
- `users` harus dibuat DULUAN sebelum `compounds` (karena `compounds` REFERENCES `users`).
- Relasi one-to-many: satu user punya banyak compounds, tiap compound satu pemilik (`user_id` foreign key).
- `ON DELETE CASCADE`: hapus user → compounds-nya ikut kehapus.
- **`smiles` pakai `TEXT` bukan `VARCHAR(255)`** — SMILES molekul kompleks gampang lewat 255 karakter. `name` boleh VARCHAR(255) karena punya batas wajar.
- **`content` (notes app) → pecah jadi `smiles` (mesin) + `notes` (manusia).** `smiles` NOT NULL (render adalah inti app); `notes` nullable.
- **`tags TEXT[]`** dipilih daripada tabel `tags` + join table: cukup buat koleksi personal, sekalian belajar array Postgres. Filter: `WHERE 'aromatic' = ANY(tags)` atau `tags @> ARRAY['aromatic']`. Kalau nanti butuh agregasi tag lintas user / rename global → normalisasi ke tabel terpisah. Kalau filter tag sering dipakai → tambah GIN index: `CREATE INDEX idx_compounds_tags ON compounds USING GIN (tags);`
- Kolom enrichment PubChem (`molecular_formula`, `molecular_weight`, `canonical_smiles`, `pubchem_cid`) SENGAJA belum ada di MVP — ditambah di v2 via `ALTER TABLE` (latihan migrasi).
- `updated_at` TIDAK auto-update. `DEFAULT NOW()` cuma jalan saat INSERT. Pas UPDATE, set manual: `UPDATE compounds SET notes = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3;` (catat `user_id` di WHERE — jangan sampai user bisa update senyawa milik orang lain).
- Query ambil compounds user (favorite di atas): `SELECT * FROM compounds WHERE user_id = $1 ORDER BY is_favorite DESC, updated_at DESC;`

## Langkah Berikutnya

Sudah selesai: desain database (schema final di atas).

**Berikutnya: auth flow.** Mulai dari konsep hashing password dulu (kenapa nggak boleh simpan password polos, gimana bcrypt kerja) SEBELUM nulis kode — biar paham *kenapa*-nya, bukan cuma *gimana*-nya. Lalu: JWT (token disimpan di mana, dikirim gimana, verify gimana), middleware auth di Express, protected routes di React, dan auth state pakai `useContext` + `useReducer` (handle state: loading / authenticated / unauthenticated + race condition saat cek login pertama kali).
