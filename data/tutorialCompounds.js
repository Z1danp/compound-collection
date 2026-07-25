// Senyawa contoh yang di-seed ke tiap user baru (register & guest) sebagai
// pengenalan cara menulis SMILES. Setelah di-seed, ini jadi baris compounds
// biasa milik user, jadi bebas diedit / dihapus seperti compound lainnya.
export const TUTORIAL_COMPOUNDS = [
  {
    name: 'Atom & Hidrogen Implisit',
    smiles: 'CCO', // Etanol — C & O ditulis langsung, semua H implisit
    notes:
      'Atom dari "organic subset" (B, C, N, O, P, S, F, Cl, Br, I) bisa ditulis langsung dengan simbolnya tanpa kurung siku, dan valensinya diisi otomatis dengan H implisit. Atom di luar subset ini, atau yang butuh spesifikasi khusus (muatan, isotop, jumlah H eksplisit), harus ditulis dalam kurung siku, misal [nH], [NH4+], [13C]. Karena H ditambahkan otomatis untuk memenuhi valensi normal (C=4, N=3, O=2), C saja sudah berarti metana (CH4), dan CCO ini adalah etanol dengan seluruh H-nya implisit.',
  },
  {
    name: 'Ikatan & Percabangan',
    smiles: 'CC(=O)CO', // Asam asetat — ada ikatan rangkap = DAN cabang ()
    notes:
      'Ikatan tunggal adalah default sehingga tidak perlu ditulis (boleh pakai - tapi biasanya diomit). Rangkap dua ditulis =, rangkap tiga #, dan aromatik implisit di antara atom huruf kecil atau eksplisit :. Percabangan dari rantai utama pakai kurung () dan bisa nested, misalnya CC(C)C = isobutana. Contoh CC(=O)CO = Hydroxyacetone menunjukkan ikatan rangkap = sekaligus cabang () dalam satu molekul.',
  },
  {
    name: 'Cincin & Aromatisitas',
    smiles: 'c1ccccc1', // Benzena — cincin (angka) + aromatik (huruf kecil)
    notes:
      'Titik buka-tutup cincin ditandai angka yang sama di dua atom yang terhubung, misalnya C1CCCCC1 = sikloheksana (atom C pertama dan terakhir berlabel 1 dianggap terikat). Atom aromatik ditulis huruf kecil (c, n, o, s), berbeda dari versi Kekule yang pakai huruf besar dengan ikatan rangkap bergantian. Benzena bisa ditulis c1ccccc1 (aromatik) atau C1=CC=CC=C1 (Kekule) — keduanya valid dan setara.',
  },
  {
    name: 'Stereokimia',
    smiles: 'C[C@@H](C(=O)O)N', // L-Alanina — kiralitas @@
    notes:
      'Stereokimia dipakai kalau relevan. Kiralitas ditulis dalam bracket atom: @ berarti berlawanan arah jarum jam dan @@ searah jarum jam, misalnya [C@H]. Geometri E/Z pada ikatan rangkap ditandai / dan \\. Contoh C[C@@H](C(=O)O)N = L-alanina memakai @@ untuk konfigurasi pada karbon kiralnya.',
  },
  {
    name: 'Muatan & Isotop',
    smiles: '[Na+].[Cl-]', // Natrium klorida — dua muatan + dan -
    notes:
      'Muatan listrik ditulis dalam kurung siku dengan tanda + atau -, misalnya ion natrium [Na+] dan ion oksida [O-2]. Isotop ditulis dengan nomor massa di depan lambang atom dalam kurung siku, misalnya karbon-13 [13C]. Contoh [Na+].[Cl-] = natrium klorida memakai tanda titik . untuk memisahkan dua ion yang tidak terikat kovalen, masing-masing dengan muatannya.',
  },
];
