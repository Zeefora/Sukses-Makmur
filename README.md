# Sukses-Makmur 
``` mermaid graph TD
    A[Mulai: Pengembangan Fitur Baru] --> B{Ada Perubahan Kode?}
    B -- Ya --> C[git add .<br/>'Staging Area']
    B -- Tidak --> A
    
    C --> D[git commit -m 'Pesan Perubahan'<br/>'Local Repository']
    D --> E[git push origin nama-branch]
    
    E --> F[Buka GitHub: Create Pull Request]
    F --> G{Review & Testing}
    
    G -- Perbaikan Diperlukan --> A
    G -- Disetujui --> H[Merge Pull Request ke Main]
    
    H --> I[Update Lokal: git pull origin main]
    I --> J[Selesai]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style H fill:#059669,stroke:#fff,stroke-width:2px,color:#fff
    style J fill:#f9f,stroke:#333,stroke-width:2px
    style G fill:#fef3c7,stroke:#d97706,stroke-width:2px```
