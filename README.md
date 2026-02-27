# Sukses-Makmur 
``` mermaid
graph TD
    A[Selamat Datang di Toko Sukses Makmur] -- >[Sedang Mencari Barang Apa Hari Ini?]
    B[Barang Dipilih] --> C{Cek Stok di Supabase}
    C -- Ada --> D[Hitung Total & AI Audit]
    C -- Habis --> E[Notifikasi Stok Kosong]
    
    D --> F[Terimakasih Sudah Berbelanja di Tempat Kami]
    E --> F[Selesai]

    style A fill:#f9f,stroke:#333,stroke-width:2px```
