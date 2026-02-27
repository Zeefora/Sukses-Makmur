# Sukses-Makmur 
``` mermaid
graph TD
    A[Selamat Datang di Toko Sukses Makmur]
    B[Sedang Mencari Barang Apa Hari Ini?] 
    C[Barang Dipilih] --> D{Cek Stok di Supabase}
    D -- Ada --> E[Hitung Total & AI Audit]
    D -- Habis --> F[Notifikasi Stok Kosong]
    
    E --> G[Terimakasih Sudah Berbelanja di Tempat Kami]
    G --> F[Selesai]

    style A fill:#f9f,stroke:#333,stroke-width:2px```
