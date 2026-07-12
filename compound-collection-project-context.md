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

- **Kode manual + minta dijelasin step-by-step** buat hal BARU: auth (hashing, JWT, middleware, protected routes), `useContext`/`useReducer`, query compounds yang terikat `user_id`, **query dengan JOIN** (many-to-many tags via join table — pola baru dari CRUD satu-tabel), dan (nanti di v2) integrasi PubChem lewat backend + caching.
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

### Sistem tag (many-to-many)
- Tag DISIMPAN ternormalisasi: tabel `tags` (satu baris per tag unik milik user) + tabel penghubung `compound_tags`. Satu compound bisa banyak tag, satu tag bisa dipakai banyak compound → relasi many-to-many.
- Kenapa ternormalisasi, bukan kolom `TEXT[]`: karena target fiturnya **tag-picker ala Notion** — user ngetik, disaranin tag yang udah dia pakai, atau bikin baru. Pola ini butuh tag jadi entity nyata (biar ada sumber kebenaran tunggal, nggak ada duplikat typo kayak "aromatic"/"Aromatic"/"aromatik" numpuk jadi tag beda, dan bisa rename sekali-kena-semua).
- Query saran tag (autocomplete prefix): `SELECT id, name FROM tags WHERE user_id = $1 AND name ILIKE $2 || '%'`.
- Alur assign: user pilih tag yang disaranin → insert ke `compound_tags` pakai `tag_id` yang ada. User ngetik baru → insert ke `tags` dulu (`INSERT ... ON CONFLICT (user_id, name) DO NOTHING RETURNING id` biar aman), baru insert ke `compound_tags`.

### Markdown (field `notes`)
- react-markdown itu renderer, bukan editor/uploader. Dia cuma render string markdown jadi HTML.
- Dipakai buat field `notes` (catatan bebas per senyawa), bukan pusat app.

## Scope Bertahap (MVP-first)

### MVP (v1) — target "selesai & bisa di-deploy"
- Register & login (hash password pakai bcrypt, JWT)
- Protected routes (halaman koleksi cuma bisa diakses kalau login)
- CRUD compounds dasar: create, read, update, delete (terikat `user_id`)
- Field per senyawa: `name`, `smiles`, `notes` (markdown), + tag
- Render struktur 2D dari SMILES pakai **SmilesDrawer** (client-side)
- Markdown rendering biasa (bold, italic, heading, list) buat `notes` pakai react-markdown
- Fitur favorite (`is_favorite`)
- **Tag: bikin & assign tag ke compound** (schema ternormalisasi + join table). Input tag versi sederhana dulu (ketik nama tag, assign).
- Auth state pakai `useContext` + `useReducer`
- **Deploy ke Render**

### v2 — setelah MVP live
- **Tag-picker Notion-style**: autocomplete yang nyaranin tag user yang udah ada saat ngetik (query `ILIKE` prefix), pilih-atau-bikin-baru. Butuh form state lebih kompleks (multi-select + create-on-the-fly) → latihan `useReducer` lanjutan.
  - *Catatan: penempatan v1-vs-v2 masih bisa digeser. Schema-nya udah siap buat dua-duanya; ini soal kapan UI autocomplete-nya dibangun.*
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
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabel compounds: tiap senyawa terikat ke satu user
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

-- Tabel tags: satu baris per tag unik milik user
CREATE TABLE tags (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(50) NOT NULL,
    UNIQUE (user_id, name)
);

-- Tabel penghubung: relasi many-to-many compound <-> tag
CREATE TABLE compound_tags (
    compound_id     INTEGER NOT NULL REFERENCES compounds(id) ON DELETE CASCADE,
    tag_id          INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (compound_id, tag_id)
);

CREATE INDEX idx_compounds_user_id ON compounds(user_id);
CREATE INDEX idx_compound_tags_tag_id ON compound_tags(tag_id);
```

Catatan schema:
- **Urutan `CREATE TABLE` penting:** `users` → `compounds` → `tags` → `compound_tags`. Tabel yang di-REFERENCES harus ada duluan. `compound_tags` REFERENCES dua tabel (`compounds` + `tags`), jadi dia paling akhir.
- `ON DELETE CASCADE` di mana-mana: hapus user → compounds, tags, dan baris compound_tags-nya ikut kehapus. Hapus compound/tag → baris di compound_tags ikut kehapus.
- **`smiles` pakai `TEXT` bukan `VARCHAR(255)`** — SMILES molekul kompleks gampang lewat 255 karakter. `name` boleh VARCHAR(255) karena punya batas wajar.
- **`content` (notes app) → pecah jadi `smiles` (mesin, NOT NULL, inti app) + `notes` (manusia, markdown, nullable).**
- **`UNIQUE (user_id, name)` di `tags`** — user yang sama nggak bisa bikin tag "aromatic" dua kali. Ini yang bikin "sarankan tag yang udah ada" aman: database sendiri yang nyegah duplikat, bukan dicek manual di kode.
- **Composite PK `(compound_id, tag_id)` di `compound_tags`** — yang bikin satu baris di tabel penghubung unik itu KOMBINASI compound+tag, bukan salah satunya. Efeknya: pasangan compound-X-tag-Y nggak bisa ke-insert dua kali (tag yang sama nggak nempel dobel ke satu compound). CATATAN: ini nggak nyegah compound bernama sama dibuat dua kali — itu constraint terpisah (`UNIQUE (user_id, name)` di `compounds`) kalau memang mau dilarang.
- **Index & yang otomatis:**
  - `idx_compounds_user_id` → query paling sering: "ambil compound milik user ini" (`WHERE user_id = $1`).
  - `idx_compound_tags_tag_id` → arah "dari tag cari compound" (`WHERE tag_id = $1`). PK `(compound_id, tag_id)` udah otomatis bikin index buat arah sebaliknya (dari compound cari tag), tapi nggak buat arah ini.
  - `PRIMARY KEY` dan `UNIQUE` OTOMATIS bikin index — jadi `users.email`, semua `id`, dan `UNIQUE (user_id, name)` di `tags` nggak perlu index manual lagi.
  - Tradeoff index: bikin SELECT cepat, tapi INSERT/UPDATE/DELETE sedikit lebih lambat (index ikut di-update) + makan storage. Index kolom yang sering dipakai di WHERE/JOIN/ORDER BY, bukan asal semua.
- `updated_at` TIDAK auto-update. `DEFAULT NOW()` cuma jalan saat INSERT. Pas UPDATE, set manual: `UPDATE compounds SET notes = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3;` (catat `user_id` di WHERE — jangan sampai user bisa update senyawa milik orang lain).
- Query ambil compounds user (favorite di atas): `SELECT * FROM compounds WHERE user_id = $1 ORDER BY is_favorite DESC, updated_at DESC;`
- Kolom enrichment PubChem (`molecular_formula`, `molecular_weight`, `canonical_smiles`, `pubchem_cid`) SENGAJA belum ada di MVP — ditambah di v2 via `ALTER TABLE` (latihan migrasi).

## Langkah Berikutnya

Sudah selesai:
- Desain database (schema final di atas).
- **Konsep hashing password (SELESAI dipahami, belum ngoding).** Zidan udah paham secara konsep, nyampe sendiri lewat tanya-jawab (bukan hafalan): (1) kenapa nggak simpan password polos → simpan hasil **fungsi satu arah** (hash); (2) beda encoding vs encryption vs hashing (hashing = satu arah, nggak ada kunci/decrypt); (3) hash **deterministik** → login = bandingin abu-vs-abu, bukan password asli; (4) sisi gelap deterministik → **precomputation / rainbow table**; (5) **salt** (acak per user) mematikan precomputation; (6) salt **nggak rahasia** → disimpan terang-terangan; **bcrypt nyelipin salt di dalam string `password_hash`** makanya schema cukup 1 kolom; (7) **cost factor** (`$2b$12$...`) bikin lambat dengan sengaja → brute-force nggak ekonomis; (8) `bcrypt.compare(plaintext, hashDariDB)` cukup 2 argumen karena bcrypt motong salt+cost sendiri dari string; (9) **bcrypt nggak baca DB** — kodemu yang query DB, bcrypt cuma fungsi terima 2 string.
- Konsep alur **register** (hash + insert, salt lahir di `bcrypt.hash`, nggak baca DB dulu) vs **login** (select `password_hash` dulu → `bcrypt.compare`) juga udah dibahas, plus detail keamanan: pesan error login harus generik (`"email atau password salah"`) buat nutup *user enumeration*.

**Berikutnya (belum dikerjain):**
1. **Nulis kode `register` + `login` pakai bcrypt** (konsep udah matang, tinggal implementasi — Zidan lebih suka coba tulis sendiri dulu lalu direview, sesuai filosofi belajar).
2. **JWT** (token disimpan di mana, dikirim gimana, verify gimana) — titik "nerbitin token" di akhir login adalah awal JWT.
3. Middleware auth di Express, protected routes di React.
4. Auth state pakai `useContext` + `useReducer` (handle state: loading / authenticated / unauthenticated + race condition saat cek login pertama kali).
