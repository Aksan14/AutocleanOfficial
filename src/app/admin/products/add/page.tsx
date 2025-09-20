'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import AuthGuard from "../../../../components/AuthGuard";
import { createBarang } from '../../../../utils/api';


function AddProductContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_barang: '',
    deskripsi: '',
    link_shopee: '',
    link_tiktokshop: '',
    gambar: null as File | null,
    harga: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, gambar: file }));
    if (errors['gambar']) {
      setErrors(prev => ({ ...prev, gambar: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama_barang.trim()) {
      newErrors.nama_barang = 'Nama produk wajib diisi';
    }
    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi produk wajib diisi';
    }
    if (!formData.harga.trim()) {
      newErrors.harga = 'Harga wajib diisi';
    } else if (isNaN(Number(formData.harga)) || Number(formData.harga) <= 0) {
      newErrors.harga = 'Harga harus berupa angka positif';
    }
    if (!formData.gambar) {
      newErrors.gambar = 'Gambar wajib diupload';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('nama_barang', formData.nama_barang);
      fd.append('deskripsi', formData.deskripsi);
      fd.append('link_shopee', formData.link_shopee);
      fd.append('link_tiktokshop', formData.link_tiktokshop);
      fd.append('harga', formData.harga);
      if (formData.gambar) fd.append('gambar', formData.gambar);

      const res = await createBarang(fd);
      setSuccessMsg(res.message || 'Produk berhasil ditambahkan!');
      
      // Redirect to products list
      setTimeout(() => {
        router.push('/admin/products');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menambah produk');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/admin" className="flex items-center">
              <Image
                src="/Auto Celan Official Logo.png"
                alt="AutoClean Official Logo"
                width={200}
                height={60}
                priority
                className="h-12 w-auto"
              />
              <span className="ml-4 text-2xl font-bold text-gray-900">Tambah Produk</span>
            </Link>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/admin" className="text-gray-500 hover:text-gray-700">Dashboard</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/admin/products" className="text-gray-500 hover:text-gray-700">Produk</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900">Tambah Produk</li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
            <p className="text-gray-600 mt-1">Lengkapi form di bawah untuk menambah produk baru</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nama_barang" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  id="nama_barang"
                  name="nama_barang"
                  value={formData.nama_barang}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.nama_barang ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: Vehicle Shampoo Premium"
                />
                {errors.nama_barang && <p className="mt-1 text-sm text-red-600">{errors.nama_barang}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Produk *
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.deskripsi ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Deskripsikan produk, kegunaan, dan keunggulannya..."
              />
              {errors.deskripsi && <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>}
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-2">
                  Harga (Rp) *
                </label>
                <input
                  type="number"
                  id="harga"
                  name="harga"
                  value={formData.harga}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.harga ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="45000"
                />
                {errors.harga && <p className="mt-1 text-sm text-red-600">{errors.harga}</p>}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="gambar" className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Produk *
              </label>
              <input
                type="file"
                id="gambar"
                name="gambar"
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.gambar ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.gambar && <p className="mt-1 text-sm text-red-600">{errors.gambar}</p>}
            </div>

            {/* Contact & Links */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Kontak & Link</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="link_tiktokshop" className="block text-sm font-medium text-gray-700 mb-2">
                    Link TikTok Shop (opsional)
                  </label>
                  <input
                    type="url"
                    id="link_tiktokshop"
                    name="link_tiktokshop"
                    value={formData.link_tiktokshop}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="https://shop.tiktok.com/..."
                  />
                </div>

                <div>
                  <label htmlFor="link_shopee" className="block text-sm font-medium text-gray-700 mb-2">
                    Link Shopee (opsional)
                  </label>
                  <input
                    type="url"
                    id="link_shopee"
                    name="link_shopee"
                    value={formData.link_shopee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="https://shopee.co.id/..."
                  />
                </div>
              </div>
            </div>

            {/* Success/Error Message */}
            {(successMsg || errorMsg) && (
              <div className={`p-4 rounded-lg ${successMsg ? 'bg-green-50' : 'bg-red-50'} border`}>
                <p className={`text-sm ${successMsg ? 'text-green-800' : 'text-red-800'}`}>
                  {successMsg || errorMsg}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t pt-6 flex items-center justify-between">
              <Link
                href="/admin/products"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Produk'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AddProduct() {
  return (
    <AuthGuard>
      <AddProductContent />
    </AuthGuard>
  );
}
