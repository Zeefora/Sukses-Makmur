# Sukses-Makmur 
``` mermaid
graph TD
    A[Barang Dipilih] --> B{Cek Stok di Supabase}
    B -- Ada --> C[Hitung Total & AI Audit]
    B -- Habis --> D[Notifikasi Stok Kosong]
    
    C --> D[Terimakasih Sudah Berbelanja di Tempat Kami]
    D --> E[Terimakasih Sudah Berbelanja di Tempat Kami]
    
    E --> F[Selesai]

    style A fill:#f9f,stroke:#333,stroke-width:2px```
