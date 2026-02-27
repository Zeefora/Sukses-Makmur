# Sukses-Makmur 
``` mermaid
graph TD
    Start([Mulai Aplikasi]) --> Login{Login Kasir}
    Login -- Gagal --> Login
    Login -- Berhasil --> Dashboard[Dashboard Utama]
    
    Dashboard --> MenuPOS[Menu Kasir / POS]
    Dashboard --> MenuStok[Manajemen Stok/Inventori]
    Dashboard --> MenuLaporan[Laporan Penjualan]
    
    MenuPOS --> Scan[Input/Scan Barcode Barang]
    Scan --> Cart[Tambah ke Keranjang]
    Cart --> Check{Selesai Belanja?}
    
    Check -- Belum --> Scan
    Check -- Ya --> Total[Hitung Total & Pajak]
    
    Total --> Payment[Pilih Metode Pembayaran]
    Payment --> PayMethod{Tunai / QRIS / Debit}
    
    PayMethod --> Process[Proses Transaksi di DB]
    Process --> Sync[Sinkronisasi Stok Supabase]
    Sync --> Receipt[Cetak Struk Belanja]
    Receipt --> Finish([Selesai / Transaksi Baru])
    
    MenuStok --> StockUpdate[Update Data Produk]
    StockUpdate --> Sync
    
    style Start fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style Finish fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style Login fill:#fef3c7,stroke:#d97706,stroke-width:2px
    style PayMethod fill:#fef3c7,stroke:#d97706,stroke-width:2px
    style Dashboard fill:#e0f2fe,stroke:#0ea5e9,stroke-width:2px
    style Sync fill:#dcfce7,stroke:#16a34a,stroke-width:2p```
