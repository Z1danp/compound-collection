# Mekanisme Filter Tag — Compound Collection

## Komponen yang Terlibat

```
Collection (parent)
  ├── FilterBar     (UI filter, dropdown + chip)
  └── CompoundList  (UI render card)
```

Data mengalir **atas → bawah** (props), aksi mengalir **bawah → atas** (callback).

---

## 1. Sumber Data — `Collection.jsx`

### State yang relevan

```js
const [tags, setTags] = useState([]); // [{id: 1, name: "Aromatic"}, ...]
const [compoundTags, setCompoundTags] = useState([]); // [{compound_id: 1, tag_id: 2}, ...]
const [selectedTags, setSelectedTags] = useState([]); // [1, 3] → id tag yang dicentang
```

### Kenapa perlu `compoundTags`?

Relasi compound ↔ tag itu **many-to-many**. Satu compound bisa punya banyak tag, satu tag bisa dipakai banyak compound. Data dari API dikirim sebagai tabel jembatan (`compoundTags`).

---

## 2. Menggabungkan Data — `compoundsWithTags`

Hasil akhir: setiap compound punya property `.tags` yang isinya **array of string** (nama tag).

```js
// Step 1: lookup tag id → tag name
const tagNameById = {};
for (const tag of tags) {
  tagNameById[tag.id] = tag.name;
}
// { 1: "Aromatic", 2: "Alkane", 3: "Amine" }

// Step 2: lookup compound → [tagId, tagId, ...]
const tagIdsByCompoundId = {};
for (const ct of compoundTags) {
  if (!tagIdsByCompoundId[ct.compound_id]) {
    tagIdsByCompoundId[ct.compound_id] = [];
  }
  tagIdsByCompoundId[ct.compound_id].push(ct.tag_id);
}
// { 1: [1, 3], 2: [2] }

// Step 3: gabung ke compounds
const compoundsWithTags = compounds.map((compound) => {
  const tagIds = tagIdsByCompoundId[compound.id] || [];
  const tagNames = tagIds.map((tagId) => tagNameById[tagId]);
  return { ...compound, tags: tagNames };
});
// [{ id: 1, name: "Caffeine", tags: ["Aromatic", "Amine"] }, ...]
```

---

## 3. Logika Filter — `Collection.jsx`

```js
const filteredCompounds =
  selectedTags.length === 0
    ? compoundsWithTags
    : compoundsWithTags.filter((c) =>
        selectedTags.every((tagId) => c.tags.includes(tagNameById[tagId]))
      );
```

### `.some()` vs `.every()`

| Method     | Logika                              | Contoh                                                                              |
| ---------- | ----------------------------------- | ----------------------------------------------------------------------------------- |
| `.some()`  | OR — cukup punya **salah satu** tag | Centang Aromatic & Amine → muncul semua compound yang punya Aromatic **ATAU** Amine |
| `.every()` | AND — harus punya **semua** tag     | Centang Aromatic & Amine → hanya compound yang punya Aromatic **DAN** Amine         |

### Kenapa `selectedTags.length === 0` di awal?

Default behavior: kalau belum ada tag dicentang, **semua compound muncul**. User lihat semua dulu, baru filter.

### Kenapa pakai `tagNameById[tagId]`?

`c.tags` itu array of **string** (`"Aromatic"`), sedangkan `selectedTags` itu array of **number/ID** (`1`). Harus dikonversi dulu supaya bisa dibandingkan.

---

## 4. Komponen Filter — `FilterBar.jsx`

### Props

```js
function FilterBar({ tags, selectedTags, onTagsChange }) { ... }
```

| Prop           | Tipe           | Arah           | Kegunaan                                        |
| -------------- | -------------- | -------------- | ----------------------------------------------- |
| `tags`         | `[{id, name}]` | Parent → Child | Data semua tag untuk dropdown                   |
| `selectedTags` | `[id]`         | Parent → Child | Tag mana yang lagi aktif (buat chip + checkbox) |
| `onTagsChange` | callback       | Child → Parent | Dipanggil saat user centang/uncentang           |

### Lifting State Up

State `selectedTags` disimpan di **parent (Collection)**, bukan di FilterBar. Kenapa?

→ Karena **Collection** butuh data itu untuk memfilter `compoundsWithTags`. Kalau state cuma ada di FilterBar, Collection gak bisa akses.

---

## 5. Flow Lengkap (User Klik Checkbox)

```
User klik checkbox "Aromatic" di dropdown
       │
       ▼
toggleTag(tagId) di FilterBar
       │
       ▼
onTagsChange([...selectedTags, "Aromatic"])    → callback ke Collection
       │
       ▼
Collection: setSelectedTags([...])              → state berubah
       │
       ▼
React re-render Collection
       │
       ├── FilterBar  nerima selectedTags baru  → chip "Aromatic" muncul
       └── CompoundList nerima filteredCompounds → hanya card dg tag Aromatic
```

---

## 6. Diagram Arsitektur

```
┌──────────────────────────────────────────────────┐
│  COLLECTION (parent)                              │
│                                                   │
│  State: compounds, tags, compoundTags,            │
│         selectedTags ◄── LIFTING STATE UP         │
│                                                   │
│  Computed:                                        │
│  • tagNameById         (id → name)               │
│  • tagIdsByCompoundId  (compound → [tagId])       │
│  • compoundsWithTags   (compound + tags[])        │
│  • filteredCompounds   (filter by selectedTags)   │
│                                                   │
│  ┌───────────────┐     ┌───────────────────┐      │
│  │  FilterBar    │     │  CompoundList     │      │
│  │               │     │                   │      │
│  │ Props:        │     │ Props:            │      │
│  │  tags         │     │  compounds        │      │
│  │  selectedTags │     │  (sudah difilter) │      │
│  │  onTagsChange │     │                   │      │
│  │        ▲      │     └───────────────────┘      │
│  │        │      │                                │
│  │  callback ke  │                                │
│  │  Collection   │                                │
│  └───────────────┘                                │
└──────────────────────────────────────────────────┘
```

---

## 7. Ringkasan Konsep

| Konsep                | Penjelasan                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| **Lifting State Up**  | Naikin state ke parent terdekat yang dipakai bersama oleh beberapa child                          |
| **One-way data flow** | Data mengalir dari parent → child via props                                                       |
| **Inverse data flow** | Child komunikasi ke parent via callback (misal `onTagsChange`)                                    |
| **Lookup table**      | Ubah array jadi object `{id: value}` biar akses O(1)                                              |
| **Computed value**    | `compoundsWithTags` dan `filteredCompounds` bukan state, tapi hasil komputasi dari state yang ada |
