'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import AuthGuard from "../../../components/AuthGuard";
import { fetchBarangList, deleteBarang, BASE_URL } from "../../../utils/api";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'danger' | 'warning';
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            <svg className={`w-6 h-6 ${type === 'danger' ? 'text-red-600' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-500 mb-6">{message}</p>
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            Ya, {type === 'danger' ? 'Hapus' : 'Lanjutkan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Tambahkan tipe Barang sesuai API
interface Barang {
  id: number;
  nama_barang: string;
  deskripsi: string;
  gambar: string;
  gambar_url: string;
  harga: number;
  harga_formatted: string;
  link_shopee: string;
  link_tiktokshop: string;
  created_at: string;
  updated_at: string;
}

function ProductsManagementContent() {
  const router = useRouter();
  const [products, setProducts] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    productId: number | null;
    productName: string;
  }>({
    isOpen: false,
    productId: null,
    productName: ""
  });
  const [imageModal, setImageModal] = useState<{open: boolean, src: string, alt: string}>({open: false, src: '', alt: ''});

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchBarangList();
        setProducts(data);
      } catch (err) {
        // TODO: handle error
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
    router.push("/admin/login");
  };

  const handleDeleteProduct = (productId: number, productName: string) => {
    setConfirmModal({
      isOpen: true,
      productId,
      productName
    });
  };

  const confirmDeleteProduct = async () => {
    if (!confirmModal.productId) return;
    setLoading(true);
    try {
      await deleteBarang(confirmModal.productId);
      setProducts(products.filter(p => p.id !== confirmModal.productId));
    } catch (err) {
      // TODO: handle error
    }
    setConfirmModal({ isOpen: false, productId: null, productName: "" });
    setLoading(false);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
              <span className="ml-4 text-2xl font-bold text-gray-900">Kelola Produk</span>
            </div>
            <div className="flex items-center">
              <Link
                href="/admin/settings"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors mr-2"
              >
                Pengaturan
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Produk</h1>
            <p className="text-gray-600">Tambah, edit, atau hapus produk AutoClean</p>
          </div>
          <Link
            href="/admin/products/add"
            className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Tambah Produk
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Cari Produk
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan nama atau deskripsi..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredProducts.length} Produk Ditemukan
            </h2>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2a2 2 0 012 2v1M9 7h6" />
              </svg>
              <p className="text-gray-500 text-lg">Tidak ada produk ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Gambar</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Produk</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Harga</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 align-top">
                      <td className="py-4 text-center w-20">
                        <button onClick={() => setImageModal({open: true, src: `${BASE_URL}${product.gambar_url}`, alt: product.nama_barang})}>
                          <img src={`${BASE_URL}${product.gambar_url}`} alt={product.nama_barang} className="w-12 h-12 object-cover rounded hover:scale-105 transition mx-auto" />
                        </button>
                      </td>
                      <td className="py-4 w-64">
                        <div className="flex flex-col justify-start h-full">
                          <div className="text-sm font-medium text-gray-900 mb-1">{product.nama_barang}</div>
                          <div className="text-sm text-gray-500 whitespace-pre-line break-words">
                            {product.deskripsi}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right w-32">
                        <div className="text-sm font-semibold text-gray-900">
                          {product.harga_formatted ? product.harga_formatted : `Rp ${Number(product.harga).toLocaleString('id-ID')}`}
                        </div>
                      </td>
                      <td className="py-4 text-center w-24">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.nama_barang)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, productId: null, productName: "" })}
        onConfirm={confirmDeleteProduct}
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus produk "${confirmModal.productName}"? Tindakan ini tidak dapat dibatalkan.`}
        type="danger"
      />

      {/* Image Modal */}
      {imageModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setImageModal({open: false, src: '', alt: ''})}>
          <div className="bg-white rounded-lg p-4 max-w-lg w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img src={imageModal.src} alt={imageModal.alt} className="max-h-[60vh] w-auto object-contain rounded mb-4" />
            <div className="text-lg font-bold mb-2">{imageModal.alt}</div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg" onClick={() => setImageModal({open: false, src: '', alt: ''})}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsManagement() {
  return (
    <AuthGuard>
      <ProductsManagementContent />
    </AuthGuard>
  );
}
