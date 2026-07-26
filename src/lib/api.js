// Base URL untuk semua request ke backend Express kita sendiri.
// - Lokal: diisi dari .env (VITE_API_URL=http://localhost:3000)
// - Vercel (satu domain): dikosongin, jadi fetch pakai path relatif ('/api/...')
// Catatan: fetch ke API pihak ketiga (PubChem) TIDAK lewat sini.
export const API_URL = import.meta.env.VITE_API_URL ?? 'https://renik-notes.vercel.app/';
