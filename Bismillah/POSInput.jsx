import React, { useState, useMemo } from 'react';
import { useAuth } from './AuthContext';

// ========== DATA DUMMY PRODUK ==========
const produkData = [
  { id: 1, nama: 'Beras Premium 5kg', harga: 75000, kategori: 'Sembako', stok: 50, emoji: '🌾' },
  { id: 2, nama: 'Minyak Goreng 2L', harga: 36000, kategori: 'Sembako', stok: 80, emoji: '🫗' },
  { id: 3, nama: 'Gula Pasir 1kg', harga: 18000, kategori: 'Sembako', stok: 120, emoji: '🍚' },
  { id: 4, nama: 'Tepung Terigu 1kg', harga: 14000, kategori: 'Sembako', stok: 90, emoji: '🌿' },
  { id: 5, nama: 'Telur Ayam 1kg', harga: 28000, kategori: 'Sembako', stok: 60, emoji: '🥚' },
  { id: 6, nama: 'Susu UHT 1L', harga: 19000, kategori: 'Minuman', stok: 45, emoji: '🥛' },
  { id: 7, nama: 'Kopi Bubuk 250g', harga: 25000, kategori: 'Minuman', stok: 35, emoji: '☕' },
  { id: 8, nama: 'Teh Celup 25pcs', harga: 12000, kategori: 'Minuman', stok: 70, emoji: '🍵' },
  { id: 9, nama: 'Mie Instan (5pcs)', harga: 15000, kategori: 'Makanan', stok: 200, emoji: '🍜' },
  { id: 10, nama: 'Sabun Mandi', harga: 8500, kategori: 'Kebersihan', stok: 90, emoji: '🧼' },
  { id: 11, nama: 'Sampo 170ml', harga: 22000, kategori: 'Kebersihan', stok: 55, emoji: '🧴' },
  { id: 12, nama: 'Deterjen 800g', harga: 16000, kategori: 'Kebersihan', stok: 65, emoji: '🫧' },
  { id: 13, nama: 'Sarden Kaleng', harga: 14500, kategori: 'Makanan', stok: 40, emoji: '🐟' },
  { id: 14, nama: 'Keju Slice 10pcs', harga: 32000, kategori: 'Makanan', stok: 25, emoji: '🧀' },
  { id: 15, nama: 'Air Mineral 600ml', harga: 4000, kategori: 'Minuman', stok: 300, emoji: '💧' },
  { id: 16, nama: 'Roti Tawar', harga: 16000, kategori: 'Makanan', stok: 30, emoji: '🍞' },
];

const kategoriFilter = ['Semua', 'Sembako', 'Minuman', 'Makanan', 'Kebersihan'];

const formatRupiah = (num) => 'Rp ' + num.toLocaleString('id-ID');

// Helper: ambil inisial dari nama
const getInitials = (name) => {
  if (!name) return 'KS';
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const POSInput = ({ onLogout }) => {
  const { currentUser, logout } = useAuth();
  const [keranjang, setKeranjang] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKategori, setActiveKategori] = useState('Semua');
  const [metodeBayar, setMetodeBayar] = useState('tunai');
  const [zakatEnabled, setZakatEnabled] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cashAmount, setCashAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Nama dan inisial kasir dari user yang login
  const kasirName = currentUser?.namaVendor || 'Kasir';
  const kasirInitials = getInitials(kasirName);

  // Filter produk
  const filteredProduk = useMemo(() => {
    return produkData.filter(p => {
      const matchSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase());
      const matchKategori = activeKategori === 'Semua' || p.kategori === activeKategori;
      return matchSearch && matchKategori;
    });
  }, [searchQuery, activeKategori]);

  // Cart operations
  const addToCart = (produk) => {
    setKeranjang(prev => {
      const existing = prev.find(item => item.id === produk.id);
      if (existing) {
        if (existing.qty >= produk.stok) return prev;
        return prev.map(item => item.id === produk.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...produk, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setKeranjang(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty <= 0) return prev.filter(i => i.id !== id);
      const produk = produkData.find(p => p.id === id);
      if (newQty > produk.stok) return prev;
      return prev.map(i => i.id === id ? { ...i, qty: newQty } : i);
    });
  };

  const removeItem = (id) => setKeranjang(prev => prev.filter(i => i.id !== id));
  const clearCart = () => { setKeranjang([]); setShowCheckout(false); };

  // Calculations
  const subtotal = keranjang.reduce((sum, item) => sum + item.harga * item.qty, 0);
  const zakatAmount = zakatEnabled ? Math.round(subtotal * 0.025) : 0;
  const grandTotal = subtotal + zakatAmount;
  const totalItems = keranjang.reduce((sum, item) => sum + item.qty, 0);
  const kembalian = cashAmount ? parseInt(cashAmount.replace(/\D/g, '')) - grandTotal : 0;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Bismillah, transaksi berhasil!\n\nTotal: ${formatRupiah(grandTotal)}\nMetode: ${metodeBayar.toUpperCase()}\nZakat: ${formatRupiah(zakatAmount)}\nKasir: ${kasirName}\n\nBarakallahu fiikum.`);
      clearCart();
    }, 2000);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    else logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      {/* ==================== TOP NAVBAR ==================== */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-sm font-bold text-emerald-950">SM</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                Sukses <span className="text-amber-400">Makmur</span>
              </h1>
              <p className="text-[10px] text-emerald-400/60 uppercase tracking-widest font-medium -mt-0.5">POS Syariah</p>
            </div>
          </div>

          {/* Center — Audit Syariah Badge */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Audit Syariah</span>
            <span className="text-[10px] text-emerald-400/50">✓ Terverifikasi</span>
          </div>

          {/* Right — User & Logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-white/60">Kasir: <span className="text-white font-medium">{kasirName}</span></p>
              <p className="text-[10px] text-white/30">Shift Pagi — {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:scale-110 transition-transform duration-200"
              >
                {kasirInitials}
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-12 z-50 w-56 backdrop-blur-xl bg-slate-800/95 border border-white/10 rounded-2xl shadow-2xl p-2 animate-[fadeIn_0.2s_ease-out]">
                    {/* User Info */}
                    <div className="px-3 py-2.5 border-b border-white/5 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{kasirName}</p>
                      <p className="text-[11px] text-white/40 truncate">{currentUser?.email}</p>
                    </div>
                    {/* Logout Button */}
                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      Keluar (Logout)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ==================== MAIN LAYOUT ==================== */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-4 flex flex-col lg:flex-row gap-4 h-[calc(100vh-4rem)]">

        {/* ========== LEFT — PRODUCT GRID ========== */}
        <div className="flex-[3] flex flex-col min-h-0">
          {/* Search & Filter Bar */}
          <div className="mb-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                id="pos-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-transparent transition-all"
                placeholder="Cari produk... (ketik nama barang)"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {kategoriFilter.map(k => (
                <button
                  key={k}
                  onClick={() => setActiveKategori(k)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${activeKategori === k
                      ? 'bg-amber-500 text-emerald-950 shadow-lg shadow-amber-500/20 scale-105'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                    }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProduk.map(produk => {
                const inCart = keranjang.find(i => i.id === produk.id);
                return (
                  <button
                    key={produk.id}
                    id={`produk-${produk.id}`}
                    onClick={() => addToCart(produk)}
                    className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${inCart
                        ? 'bg-amber-500/10 border-amber-500/30 shadow-lg shadow-amber-500/5'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                      }`}
                  >
                    {/* Qty Badge */}
                    {inCart && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-emerald-950 text-xs font-bold flex items-center justify-center shadow-lg animate-[bounceIn_0.3s]">
                        {inCart.qty}
                      </div>
                    )}

                    {/* Emoji Icon */}
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                      {produk.emoji}
                    </div>

                    {/* Info */}
                    <h3 className="text-sm font-semibold text-white/90 leading-tight mb-1 line-clamp-2">{produk.nama}</h3>
                    <p className="text-base font-bold text-amber-400">{formatRupiah(produk.harga)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-white/30 uppercase tracking-wider">{produk.kategori}</span>
                      <span className={`text-[10px] font-medium ${produk.stok > 20 ? 'text-emerald-400/60' : 'text-red-400/60'}`}>
                        Stok: {produk.stok}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredProduk.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-white/20">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-sm">Produk tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>

        {/* ========== RIGHT — TRANSACTION SUMMARY ========== */}
        <div className="flex-[2] lg:max-w-md flex flex-col min-h-0">
          <div className="flex-1 flex flex-col backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Keranjang</h2>
                  <p className="text-xs text-white/40">{totalItems} item • {keranjang.length} produk</p>
                </div>
                {keranjang.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-400/60 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                  >
                    Kosongkan
                  </button>
                )}
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {keranjang.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/20">
                  <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <p className="text-sm font-medium">Keranjang kosong</p>
                  <p className="text-xs text-white/15 mt-1">Klik produk untuk menambahkan</p>
                </div>
              ) : (
                keranjang.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.nama}</p>
                      <p className="text-xs text-amber-400/80">{formatRupiah(item.harga)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-sm transition-colors"
                      >−</button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-emerald-500/20 flex items-center justify-center text-sm transition-colors"
                      >+</button>
                    </div>
                    <p className="text-sm font-bold text-white/80 w-24 text-right">{formatRupiah(item.harga * item.qty)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* ========== CHECKOUT SECTION ========== */}
            {keranjang.length > 0 && (
              <div className="border-t border-white/5 p-4 space-y-3 bg-slate-900/50">

                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span className="font-semibold">{formatRupiah(subtotal)}</span>
                </div>

                {/* Zakat Calculator */}
                <div className={`rounded-xl p-3 transition-all duration-300 ${zakatEnabled ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5 border border-white/5'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🕌</span>
                      <div>
                        <p className="text-xs font-semibold text-emerald-400">Zakat Perdagangan (2.5%)</p>
                        <p className="text-[10px] text-white/30">Dihitung otomatis dari subtotal</p>
                      </div>
                    </div>
                    <button
                      id="zakat-toggle"
                      onClick={() => setZakatEnabled(!zakatEnabled)}
                      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${zakatEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${zakatEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                  {zakatEnabled && (
                    <div className="mt-2 pt-2 border-t border-emerald-500/10 flex justify-between items-center">
                      <span className="text-xs text-emerald-300/60">Infaq Zakat</span>
                      <span className="text-sm font-bold text-emerald-400">+ {formatRupiah(zakatAmount)}</span>
                    </div>
                  )}
                </div>

                {/* Metode Pembayaran — Debit/Kredit */}
                <div>
                  <p className="text-xs text-white/40 mb-2 font-medium">Metode Pembayaran</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'tunai', label: 'Tunai', icon: '💵', type: 'Debit' },
                      { id: 'qris', label: 'QRIS', icon: '📱', type: 'Debit' },
                      { id: 'debit', label: 'Kartu', icon: '💳', type: 'Kredit' },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setMetodeBayar(m.id)}
                        className={`p-3 rounded-xl text-center transition-all duration-200 ${metodeBayar === m.id
                            ? 'bg-amber-500/15 border-2 border-amber-500/40 scale-105'
                            : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                          }`}
                      >
                        <span className="text-lg block">{m.icon}</span>
                        <span className="text-xs font-semibold block mt-1">{m.label}</span>
                        <span className={`text-[10px] block mt-0.5 px-2 py-0.5 rounded-full inline-block ${m.type === 'Debit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>{m.type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cash input for Tunai */}
                {metodeBayar === 'tunai' && (
                  <div className="animate-[fadeIn_0.3s_ease-out]">
                    <label className="text-xs text-white/40 mb-1.5 block font-medium">Uang Diterima</label>
                    <input
                      id="cash-amount"
                      type="text"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-bold text-right focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all"
                      placeholder="0"
                    />
                    {cashAmount && parseInt(cashAmount) >= grandTotal && (
                      <div className="mt-2 flex justify-between items-center p-2 rounded-lg bg-emerald-500/10">
                        <span className="text-xs text-emerald-300/60">Kembalian</span>
                        <span className="text-sm font-bold text-emerald-400">{formatRupiah(kembalian)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Grand Total */}
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-sm font-semibold text-white/70">GRAND TOTAL</span>
                  <span className="text-2xl font-black text-amber-400">{formatRupiah(grandTotal)}</span>
                </div>

                {/* Syariah Audit Badge (inline) */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-[11px] text-emerald-400/70 font-medium">Transaksi ini sesuai standar audit syariah — bebas riba</span>
                </div>

                {/* Pay Button */}
                <button
                  id="checkout-btn"
                  onClick={handleCheckout}
                  disabled={isProcessing || (metodeBayar === 'tunai' && (!cashAmount || parseInt(cashAmount) < grandTotal))}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-emerald-500/20"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      Memproses Transaksi...
                    </span>
                  ) : (
                    `Bayar ${formatRupiah(grandTotal)}`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default POSInput;
