'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import AuthGuard from "../../../../../components/AuthGuard";
import { fetchBarang, updateBarang } from "../../../../../utils/api";

function EditProductContent() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<{
    nama_barang: string;
    deskripsi: string;
    gambar: string | File;
    harga: string;
    link_shopee: string;
    link_tiktokshop: string;
  }>({
    nama_barang: '',
    deskripsi: '',
    gambar: '',
    harga: '',
    link_shopee: '',
    link_tiktokshop: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Pembersih Eksterior',
    'Perawatan Mesin',
    'Aksesori'
  ];

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchBarang(Number(productId));
        setProduct(data);
        setFormData({
          nama_barang: data.nama_barang || '',
          deskripsi: data.deskripsi || '',
          gambar: data.gambar_url || '',
          harga: data.harga ? data.harga.toString() : '',
          link_shopee: data.link_shopee || '',
          link_tiktokshop: data.link_tiktokshop || ''
        });
      } catch (err) {
        router.push('/admin/products');
      }
      setInitialLoading(false);
    }
    loadProduct();
  }, [productId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama_barang.trim()) {
      newErrors.nama_barang = 'Nama produk wajib diisi';
    }
    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi produk wajib diisi';
    }
    if (
      (typeof formData.gambar === 'string' && !formData.gambar.trim()) ||
      (!formData.gambar)
    ) {
      newErrors.gambar = 'URL gambar wajib diisi';
    }
    if (!formData.harga.trim()) {
      newErrors.harga = 'Harga wajib diisi';
    } else if (isNaN(Number(formData.harga)) || Number(formData.harga) <= 0) {
      newErrors.harga = 'Harga harus berupa angka positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('nama_barang', formData.nama_barang);
      data.append('deskripsi', formData.deskripsi);
      data.append('harga', formData.harga);
      data.append('link_shopee', formData.link_shopee);
      data.append('link_tiktokshop', formData.link_tiktokshop);
      // Only send gambar if user selects a new file
      if (formData.gambar && typeof formData.gambar !== 'string') {
        data.append('gambar', formData.gambar);
      }
      await updateBarang(Number(productId), data);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // product is now from state

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/Auto Celan Official Logo 1 x 1.png"
                alt="AutoClean Official Logo"
                width={48}
                height={48}
                priority
                className="h-12 w-12 object-contain"
              />
              <span className="ml-4 text-2xl font-bold text-gray-900">Edit Produk</span>
            </div>
            <div className="flex items-center">
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
            <li className="text-gray-900">Edit: {product?.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1>
            <p className="text-gray-600 mt-1">Perbarui informasi produk</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Preview */}
            {product && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Preview Produk Saat Ini</h3>
                <div className="flex items-center space-x-4">
                  {product.gambar_url ? (
                    <Image
                      src={product.gambar_url.startsWith('http') ? product.gambar_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${product.gambar_url}`}
                      alt={product.nama_barang || 'Product Image'}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  ) : null}
                  <div>
                    <h4 className="font-medium text-gray-900">{product.nama_barang}</h4>
                    <p className="text-sm font-semibold text-red-600">Rp {product.harga ? parseInt(product.harga).toLocaleString('id-ID') : '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nama Produk */}
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

            {/* Price and Stock */}
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

            {/* Image URL */}
            <div>
              <label htmlFor="gambar" className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Produk (PNG/JPG) *
              </label>
              <input
                type="file"
                id="gambar"
                name="gambar"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  setFormData(prev => ({ ...prev, gambar: file || '' }));
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.gambar ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.gambar && <p className="mt-1 text-sm text-red-600">{errors.gambar}</p>}
              <p className="mt-1 text-sm text-gray-500">
                Pilih file gambar baru jika ingin mengganti gambar produk.
              </p>
            </div>

            {/* Contact & Links */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Link Produk</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                  'Update Produk'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function EditProduct() {
  return (
    <AuthGuard>
      <EditProductContent />
    </AuthGuard>
  );
}
