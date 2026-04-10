import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Register = ({ onNavigateLogin, onRegisterSuccess }) => {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [formData, setFormData] = useState({
    namaVendor: '',
    email: '',
    telepon: '',
    alamat: '',
    kategori: '',
    password: '',
    konfirmasiPassword: '',
    setujuSyarat: false,
  });

  const kategoriList = [
    'Sembako', 'Elektronik', 'Pakaian', 'Makanan & Minuman',
    'Alat Tulis', 'Peralatan Rumah', 'Kosmetik Halal', 'Lainnya'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setAuthError('');
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.namaVendor.trim()) newErrors.namaVendor = 'Nama vendor wajib diisi';
    else if (formData.namaVendor.trim().length < 3) newErrors.namaVendor = 'Nama vendor minimal 3 karakter';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email tidak valid';
    if (!formData.telepon.trim()) newErrors.telepon = 'Nomor telepon wajib diisi';
    else if (!/^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(formData.telepon.replace(/[\s-]/g, ''))) newErrors.telepon = 'Format nomor telepon tidak valid';
    if (!formData.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi';
    if (!formData.kategori) newErrors.kategori = 'Pilih kategori usaha';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    else if (formData.password.length < 8) newErrors.password = 'Password minimal 8 karakter';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Password harus memiliki huruf besar, huruf kecil, dan angka';
    if (!formData.konfirmasiPassword) newErrors.konfirmasiPassword = 'Konfirmasi password wajib diisi';
    else if (formData.password !== formData.konfirmasiPassword) newErrors.konfirmasiPassword = 'Password tidak cocok';
    if (!formData.setujuSyarat) newErrors.setujuSyarat = 'Anda harus menyetujui syarat & ketentuan';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!validateStep2()) return;
    setIsLoading(true);

    setTimeout(() => {
      const result = register(formData);
      setIsLoading(false);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setAuthError(result.error);
      }
    }, 2000);
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { level: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 2) return { level: 1, label: 'Lemah', color: 'bg-red-500' };
    if (score <= 4) return { level: 2, label: 'Sedang', color: 'bg-amber-500' };
    return { level: 3, label: 'Kuat', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleBackToLogin = () => {
    if (onNavigateLogin) onNavigateLogin();
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-amber-900">
        <div className="text-center animate-[fadeIn_0.6s_ease-out] max-w-md px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mb-6">
            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Alhamdulillah!</h2>
          <p className="text-emerald-200/70 mb-2">Pendaftaran vendor berhasil.</p>
          <p className="text-sm text-emerald-300/50 mb-8">Silakan login dengan email dan password yang telah Anda daftarkan. Barakallahu fiikum.</p>
          <button
            onClick={handleBackToLogin}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-amber-500/25"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  const InputField = ({ label, field, type = 'text', placeholder, icon, isPassword }) => (
    <div>
      <label className="block text-sm font-medium text-emerald-200/80 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={`register-${field}`}
          type={isPassword ? (field === 'password' ? (showPassword ? 'text' : 'password') : (showConfirm ? 'text' : 'password')) : type}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          className={`w-full pl-11 ${isPassword ? 'pr-12' : 'pr-4'} py-3 rounded-xl bg-white/5 border ${errors[field] ? 'border-red-400/60' : 'border-white/10'} text-white placeholder-emerald-300/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all duration-300`}
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => field === 'password' ? setShowPassword(!showPassword) : setShowConfirm(!showConfirm)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400/50 hover:text-amber-400 transition-colors"
          >
            {(field === 'password' ? showPassword : showConfirm) ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </button>
        )}
      </div>
      {errors[field] && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-amber-900 py-8 px-4">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M30 0L60 30L30 60L0 30z M30 8L8 30l22 22 22-22z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 w-full max-w-lg animate-[fadeIn_0.8s_ease-out]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-2xl shadow-amber-500/30 mb-3 transform hover:scale-105 transition-transform duration-300">
            <span className="text-2xl font-bold text-emerald-950">SM</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Daftar Vendor Baru</h1>
          <p className="text-emerald-300/60 text-sm mt-1">Bergabunglah dengan Toko Sukses Makmur</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {[
            { num: 1, label: 'Data Vendor' },
            { num: 2, label: 'Keamanan Akun' },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              {i > 0 && (
                <div className={`h-0.5 w-12 rounded transition-all duration-500 ${step >= s.num ? 'bg-amber-400' : 'bg-white/10'}`} />
              )}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step > s.num ? 'bg-emerald-500 text-white' :
                    step === s.num ? 'bg-amber-500 text-emerald-950 scale-110 shadow-lg shadow-amber-500/30' :
                      'bg-white/10 text-white/40'
                  }`}>
                  {step > s.num ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : s.num}
                </div>
                <span className={`text-xs font-medium hidden sm:block transition-colors ${step === s.num ? 'text-amber-400' : 'text-white/40'}`}>
                  {s.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">

          {/* Auth Error Banner */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-300">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Vendor Data */}
            {step === 1 && (
              <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                <InputField
                  label="Nama Vendor / Toko"
                  field="namaVendor"
                  placeholder="Toko Berkah Jaya"
                  icon={<svg className="w-5 h-5 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>}
                />
                <InputField
                  label="Email Bisnis"
                  field="email"
                  type="email"
                  placeholder="vendor@email.com"
                  icon={<svg className="w-5 h-5 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                />
                <InputField
                  label="Nomor Telepon"
                  field="telepon"
                  placeholder="081234567890"
                  icon={<svg className="w-5 h-5 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
                />

                {/* Kategori Usaha */}
                <div>
                  <label className="block text-sm font-medium text-emerald-200/80 mb-1.5">Kategori Usaha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6z" /></svg>
                    </div>
                    <select
                      id="register-kategori"
                      value={formData.kategori}
                      onChange={(e) => handleChange('kategori', e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border ${errors.kategori ? 'border-red-400/60' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all duration-300 appearance-none`}
                    >
                      <option value="" className="bg-emerald-900">Pilih kategori...</option>
                      {kategoriList.map(k => (
                        <option key={k} value={k} className="bg-emerald-900">{k}</option>
                      ))}
                    </select>
                  </div>
                  {errors.kategori && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      {errors.kategori}
                    </p>
                  )}
                </div>

                {/* Alamat */}
                <div>
                  <label className="block text-sm font-medium text-emerald-200/80 mb-1.5">Alamat Lengkap</label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none">
                      <svg className="w-5 h-5 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    </div>
                    <textarea
                      id="register-alamat"
                      value={formData.alamat}
                      onChange={(e) => handleChange('alamat', e.target.value)}
                      rows={2}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border ${errors.alamat ? 'border-red-400/60' : 'border-white/10'} text-white placeholder-emerald-300/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all duration-300 resize-none`}
                      placeholder="Jl. Raya Berkah No. 123, Jakarta"
                    />
                  </div>
                  {errors.alamat && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      {errors.alamat}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-amber-500/25 mt-2"
                >
                  Lanjut ke Keamanan Akun →
                </button>
              </div>
            )}

            {/* Step 2: Account Security */}
            {step === 2 && (
              <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                <InputField
                  label="Password"
                  field="password"
                  placeholder="Minimal 8 karakter"
                  isPassword
                  icon={<svg className="w-5 h-5 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>}
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strength.level === 1 ? 'text-red-400' : strength.level === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      Kekuatan: {strength.label}
                    </p>
                  </div>
                )}

                <InputField
                  label="Konfirmasi Password"
                  field="konfirmasiPassword"
                  placeholder="Ulangi password Anda"
                  isPassword
                  icon={<svg className="w-5 h-5 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
                />

                {/* Terms & Conditions */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group mt-4">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={formData.setujuSyarat}
                        onChange={(e) => handleChange('setujuSyarat', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${formData.setujuSyarat ? 'bg-amber-500 border-amber-500' : 'border-white/20 group-hover:border-amber-400/50'}`}>
                        {formData.setujuSyarat && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-emerald-200/60 leading-relaxed">
                      Saya menyetujui <button type="button" className="text-amber-400 hover:underline">Syarat & Ketentuan</button> serta berkomitmen menjalankan bisnis sesuai prinsip syariah
                    </span>
                  </label>
                  {errors.setujuSyarat && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1 ml-8">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      {errors.setujuSyarat}
                    </p>
                  )}
                </div>

                {/* Button Group */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all duration-200"
                  >
                    ← Kembali
                  </button>
                  <button
                    id="register-submit"
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-emerald-500/25"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        Mendaftar...
                      </span>
                    ) : (
                      'Daftar Sekarang'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-emerald-300/50">
            Sudah punya akun?{' '}
            <button
              onClick={handleBackToLogin}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors hover:underline"
            >
              Masuk di sini
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-emerald-300/30 mt-4">
          © 2026 Toko Sukses Makmur — Berdagang dengan Berkah
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
};

export default Register;