'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import AuthGuard from "../../../components/AuthGuard";
import { fetchBarangList, deleteBarang } from "../../../utils/api";

// Helper function to get API URL with proper client-side handling
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log('Environment variable NEXT_PUBLIC_API_URL:', envUrl);
    const finalUrl = envUrl || "http://localhost:8080";
    console.log('Final API URL for images:', finalUrl);
    return finalUrl;
  }
  return "http://localhost:8080";
};

// Test image URL function
const testImageUrl = (url: string) => {
  console.log('Testing image URL:', url);
  if (typeof window !== 'undefined') {
    const img = document.createElement('img');
    img.onload = () => console.log('✅ Image loaded successfully:', url);
    img.onerror = () => console.error('❌ Image failed to load:', url);
    img.src = url;
  }
};

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
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
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

interface ProductFormData {
  nama_barang: string;
  deskripsi: string;
  harga: string;
  link_shopee: string;
  link_tiktokshop: string;
  gambar: File | null;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  mode: 'add' | 'edit';
  initialData?: Barang | null;
  loading: boolean;
}

function ProductModal({ isOpen, onClose, onSubmit, mode, initialData, loading }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    nama_barang: '',
    deskripsi: '',
    harga: '',
    link_shopee: '',
    link_tiktokshop: '',
    gambar: null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      setFormData({
        nama_barang: initialData.nama_barang,
        deskripsi: initialData.deskripsi,
        harga: initialData.harga.toString(),
        link_shopee: initialData.link_shopee || '',
        link_tiktokshop: initialData.link_tiktokshop || '',
        gambar: null
      });
      setPreviewImage(`${getApiUrl()}${initialData.gambar_url}`);
    } else if (isOpen && mode === 'add') {
      setFormData({
        nama_barang: '',
        deskripsi: '',
        harga: '',
        link_shopee: '',
        link_tiktokshop: '',
        gambar: null
      });
      setPreviewImage('');
    }
    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, gambar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (errors.gambar) {
        setErrors(prev => ({ ...prev, gambar: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nama_barang.trim()) {
      newErrors.nama_barang = 'Nama produk harus diisi';
    }
    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi harus diisi';
    }
    if (!formData.harga.trim()) {
      newErrors.harga = 'Harga harus diisi';
    } else if (isNaN(Number(formData.harga)) || Number(formData.harga) <= 0) {
      newErrors.harga = 'Harga harus berupa angka yang valid';
    }
    if (mode === 'add' && !formData.gambar) {
      newErrors.gambar = 'Gambar harus diupload';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'add' ? 'Tambah Produk Baru' : 'Edit Produk'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 ${
                errors.nama_barang ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama produk"
              disabled={loading}
            />
            {errors.nama_barang && (
              <p className="mt-1 text-sm text-red-600">{errors.nama_barang}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi *
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 ${
                errors.deskripsi ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Deskripsikan produk, kegunaan, dan keunggulannya..."
              disabled={loading}
            />
            {errors.deskripsi && (
              <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>
            )}
          </div>

          {/* Harga */}
          <div>
            <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-2">
              Harga *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">Rp</span>
              <input
                type="text"
                id="harga"
                name="harga"
                value={formData.harga}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 ${
                  errors.harga ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
                disabled={loading}
              />
            </div>
            {errors.harga && (
              <p className="mt-1 text-sm text-red-600">{errors.harga}</p>
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="link_shopee" className="block text-sm font-medium text-gray-700 mb-2">
                Link Shopee
              </label>
              <input
                type="url"
                id="link_shopee"
                name="link_shopee"
                value={formData.link_shopee}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                placeholder="https://shopee.co.id/..."
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="link_tiktokshop" className="block text-sm font-medium text-gray-700 mb-2">
                Link TikTok Shop
              </label>
              <input
                type="url"
                id="link_tiktokshop"
                name="link_tiktokshop"
                value={formData.link_tiktokshop}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                placeholder="https://shop.tiktok.com/..."
                disabled={loading}
              />
            </div>
          </div>

          {/* Upload Gambar */}
          <div>
            <label htmlFor="gambar" className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Produk {mode === 'add' && '*'}
            </label>
            <div className="space-y-4">
              {previewImage && (
                <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                id="gambar"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                disabled={loading}
              />
            </div>
            {errors.gambar && (
              <p className="mt-1 text-sm text-red-600">{errors.gambar}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === 'add' ? 'Menyimpan...' : 'Mengupdate...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  {mode === 'add' ? 'Simpan Produk' : 'Update Produk'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Settings Modal Component
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'create' | 'password';
  onTabChange: (tab: 'create' | 'password') => void;
}

function SettingsModal({ isOpen, onClose, activeTab, onTabChange }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pengaturan Admin</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "create" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => onTabChange("create")}
          >
            Buat User Baru
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "password" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => onTabChange("password")}
          >
            Ubah Password
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "create" ? <CreateUserForm /> : <ChangePasswordForm />}
      </div>
    </div>
  );
}

// Create User Form
function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/createusers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.code === 200) {
        setMessage("User berhasil dibuat!");
        setEmail("");
        setPassword("");
      } else {
        setMessage(json.message || "Gagal membuat user");
      }
    } catch {
      setMessage("Gagal membuat user");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Membuat..." : "Buat User"}
      </button>
      {message && <p className="mt-4 text-sm text-center text-green-600">{message}</p>}
    </form>
  );
}

// Change Password Form
function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    // Ambil email dari localStorage
    let email = "";
    if (typeof window !== "undefined") {
      email = window.localStorage.getItem("user") || "";
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/user/changepassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      });
      const json = await res.json();
      if (json.code === 200) {
        setMessage("Password berhasil diubah!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(json.message || "Gagal mengubah password");
      }
    } catch {
      setMessage("Gagal mengubah password");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
        <input
          type="password"
          id="oldPassword"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
          required
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Mengubah..." : "Ubah Password"}
      </button>
      {message && <p className="mt-4 text-sm text-center text-green-600">{message}</p>}
    </form>
  );
}

function ProductsManagementContent() {
  const router = useRouter();
  const [products, setProducts] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  
  // State untuk Product Modal
  const [productModal, setProductModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    product: Barang | null;
    loading: boolean;
  }>({
    isOpen: false,
    mode: 'add',
    product: null,
    loading: false
  });

  // State untuk Settings Modal
  const [settingsModal, setSettingsModal] = useState<{
    isOpen: boolean;
    tab: 'create' | 'password';
  }>({
    isOpen: false,
    tab: 'create'
  });

  useEffect(() => {
    // Set document title on component mount
    document.title = "Auto Clean | Admin Dashboard";
    
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchBarangList();
        setProducts(data);
        
        // Test first image URL for debugging
        if (data && data.length > 0 && data[0].gambar_url) {
          const firstImageUrl = `${getApiUrl()}${data[0].gambar_url}`;
          console.log('Testing first product image URL:', firstImageUrl);
          testImageUrl(firstImageUrl);
        }
      } catch {
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
    } catch {
      // TODO: handle error
    }
    setConfirmModal({ isOpen: false, productId: null, productName: "" });
    setLoading(false);
  };

  // Fungsi untuk handle modal produk
  const openAddProductModal = () => {
    setProductModal({
      isOpen: true,
      mode: 'add',
      product: null,
      loading: false
    });
  };

  const openEditProductModal = (product: Barang) => {
    setProductModal({
      isOpen: true,
      mode: 'edit',
      product,
      loading: false
    });
  };

  const closeProductModal = () => {
    setProductModal({
      isOpen: false,
      mode: 'add',
      product: null,
      loading: false
    });
  };

  // Fungsi untuk submit form
  const handleProductSubmit = async (formData: ProductFormData) => {
    setProductModal(prev => ({ ...prev, loading: true }));
    
    try {
      const submitData = new FormData();
      submitData.append('nama_barang', formData.nama_barang);
      submitData.append('deskripsi', formData.deskripsi);
      submitData.append('harga', formData.harga);
      submitData.append('link_shopee', formData.link_shopee);
      submitData.append('link_tiktokshop', formData.link_tiktokshop);
      
      if (formData.gambar) {
        submitData.append('gambar', formData.gambar);
      }

      let response;
      if (productModal.mode === 'add') {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/barang`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('adminToken')}`,
          },
          body: submitData,
        });
      } else {
        // For update, use ID in URL path instead of body
        const productId = productModal.product!.id;
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/barang/${productId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('adminToken')}`,
          },
          body: submitData,
        });
      }

      const result = await response.json();
      
      if (response.ok && result.code === 200) {
        // Refresh data produk
        const data = await fetchBarangList();
        setProducts(data);
        closeProductModal();
      } else {
        console.error('Failed to save product:', result);
        throw new Error(result.message || 'Gagal menyimpan produk');
      }
    } catch (error) {
      console.error('Error:', error);
      // TODO: Show error message to user
    } finally {
      setProductModal(prev => ({ ...prev, loading: false }));
    }
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-lg border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            {/* Logo and Title */}
            <div className="flex items-center min-w-0 flex-1">
              <div className="bg-red-50 p-1.5 md:p-2 rounded-xl flex-shrink-0">
                <Image
                  src="/Auto Celan Official Logo 1 x 1.png"
                  alt="AutoClean Official Logo"
                  width={32}
                  height={32}
                  priority
                  className="h-8 w-8 md:h-10 md:w-10 object-contain"
                />
              </div>
              <div className="ml-3 md:ml-4 min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">Kelola Produk</h1>
                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Dashboard Admin AutoClean</p>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => setSettingsModal({ isOpen: true, tab: 'create' })}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                </svg>
                Pengaturan
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                </svg>
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  {mobileMenuOpen ? (
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  ) : (
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSettingsModal({ isOpen: true, tab: 'create' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                  </svg>
                  Pengaturan
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border flex-1 lg:mr-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Produk</h2>
              <p className="text-gray-600 mb-4">Kelola semua produk AutoClean dengan mudah dan efisien</p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={openAddProductModal}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Tambah Produk
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Filter & Pencarian</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Produk
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari berdasarkan nama atau deskripsi..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 transition-colors"
                  />
                  <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div className="flex items-end">
                <div className="bg-gray-50 p-4 rounded-lg w-full">
                  <div className="text-sm text-gray-600">Total Produk</div>
                  <div className="text-2xl font-bold text-red-600">{products.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Daftar Produk
                  </h2>
                </div>
                <div className="bg-white px-3 py-1 rounded-full border">
                  <span className="text-sm font-medium text-gray-700">
                    {filteredProducts.length} produk
                  </span>
                </div>
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2a2 2 0 012 2v1M9 7h6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-gray-500 mb-6">Coba ubah kata kunci pencarian atau tambah produk baru</p>
                <button
                  onClick={openAddProductModal}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                  </svg>
                  Tambah Produk Pertama
                </button>
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
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors align-top">
                      <td className="py-6 text-center w-20">
                        <button 
                          onClick={() => setImageModal({open: true, src: `${getApiUrl()}${product.gambar_url}`, alt: product.nama_barang})}
                          className="group"
                        >
                          <div className="relative w-16 h-16 mx-auto rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-red-300 transition-colors">
                            <Image
                              src={`${getApiUrl()}${product.gambar_url}`} 
                              alt={product.nama_barang} 
                              width={64}
                              height={64}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSSSsiuZZpWvZUQTvIIIIJBAPEEgiIQMLj8=..."
                              onError={(e) => {
                                console.error('Image failed to load:', `${getApiUrl()}${product.gambar_url}`);
                                // Remove the failed image and show placeholder
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const container = target.parentElement;
                                if (container && !container.querySelector('.image-placeholder')) {
                                  const placeholder = document.createElement('div');
                                  placeholder.className = 'image-placeholder w-full h-full bg-gray-200 flex items-center justify-center';
                                  placeholder.innerHTML = `
                                    <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                                    </svg>
                                  `;
                                  container.appendChild(placeholder);
                                }
                              }}
                            />
                          </div>
                        </button>
                      </td>
                      <td className="py-6 pr-4 w-64">
                        <div className="flex flex-col justify-start h-full">
                          <div className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{product.nama_barang}</div>
                          <div className="text-sm text-gray-600 whitespace-pre-line break-words line-clamp-3 leading-relaxed">
                            {product.deskripsi}
                          </div>
                          <div className="flex items-center mt-3 space-x-2">
                            {product.link_shopee && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Shopee
                              </span>
                            )}
                            {product.link_tiktokshop && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                TikTok
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-6 text-right w-32">
                        <div className="text-sm font-bold text-gray-900 bg-green-50 px-3 py-2 rounded-lg inline-block">
                          {product.harga_formatted ? product.harga_formatted : `Rp ${Number(product.harga).toLocaleString('id-ID')}`}
                        </div>
                      </td>
                      <td className="py-6 text-center w-24">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => openEditProductModal(product)}
                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit produk"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.nama_barang)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus produk"
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-red-600 p-2 rounded-xl">
                  <Image
                    src="/Auto Celan Official Logo 1 x 1.png"
                    alt="AutoClean Official Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain brightness-0 invert"
                  />
                </div>
                <span className="ml-3 text-xl font-bold text-white">AutoClean Official</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Platform manajemen produk terpercaya untuk AutoClean Official. 
                Kelola semua produk pembersih kendaraan dengan mudah dan efisien.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="https://wa.me/62881082566729" className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Menu Admin</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/admin/products" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group text-sm">
                    <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Kelola Produk
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={openAddProductModal}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group text-sm"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Tambah Produk
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setSettingsModal({ isOpen: true, tab: 'create' })}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group text-sm"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Pengaturan
                  </button>
                </li>
                <li>
                  <Link href="/products" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group text-sm">
                    <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Lihat Website
                  </Link>
                </li>
              </ul>
            </div>

            {/* Admin Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Informasi Admin</h3>
              <ul className="space-y-3">
                <li className="text-gray-300 text-sm">
                  <span className="font-medium text-white">Versi:</span> 2.1.0
                </li>
                <li className="text-gray-300 text-sm">
                  <span className="font-medium text-white">Status:</span> 
                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600 text-white">
                    Online
                  </span>
                </li>
                <li className="text-gray-300 text-sm">
                  <span className="font-medium text-white">Last Update:</span> {new Date().toLocaleDateString('id-ID')}
                </li>
                <li className="text-gray-300 text-sm">
                  <span className="font-medium text-white">Total Produk:</span> {products.length}
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; 2025 Coconut Lab • Crafted with ❤️ by pusatweb
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        </div>
      </footer>

      {/* Product Modal */}
      <ProductModal
        isOpen={productModal.isOpen}
        onClose={closeProductModal}
        onSubmit={handleProductSubmit}
        mode={productModal.mode}
        initialData={productModal.product}
        loading={productModal.loading}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModal.isOpen}
        onClose={() => setSettingsModal({ isOpen: false, tab: 'create' })}
        activeTab={settingsModal.tab}
        onTabChange={(tab) => setSettingsModal(prev => ({ ...prev, tab }))}
      />

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
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setImageModal({open: false, src: '', alt: ''})}>
          <div className="bg-white rounded-lg p-4 max-w-lg w-full flex flex-col items-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={imageModal.src} alt={imageModal.alt} className="max-h-[60vh] w-auto object-contain rounded mb-4" />
            <div className="text-lg font-bold mb-2">{imageModal.alt}</div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" onClick={() => setImageModal({open: false, src: '', alt: ''})}>Tutup</button>
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
