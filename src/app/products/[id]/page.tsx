"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { fetchBarangList } from "../../../utils/api";

export default function ProductDetail() {
  type Product = {
    id: string | number;
    nama_barang: string;
    deskripsi: string;
    gambar_url?: string;
    harga_formatted: string;
    link_tiktokshop?: string;
    link_shopee?: string;
  };

  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [orderForm, setOrderForm] = useState({
    nama: '',
    telepon: '',
    alamat: '',
    jumlah: 1,
    catatan: ''
  });

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await fetchBarangList();
        const foundProduct = data.find((item: Product) => String(item.id) === params.id);
        if (foundProduct) {
          setProduct(foundProduct);
        }
      } catch (err) {
        console.error('Error loading product:', err);
      }
      setLoading(false);
    }
    loadProduct();
  }, [params.id]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // Generate WhatsApp message
    const message = `
🛒 *PESANAN AUTOCLEAN OFFICIAL*

📋 *Detail Pesanan:*
• Produk: ${product.nama_barang}
• Harga: ${product.harga_formatted}
• Jumlah: ${orderForm.jumlah}
• Total: Rp ${(parseInt(product.harga_formatted.replace(/[^\d]/g, '')) * orderForm.jumlah).toLocaleString('id-ID')}

👤 *Data Pelanggan:*
• Nama: ${orderForm.nama}
• Telepon: ${orderForm.telepon}
• Alamat: ${orderForm.alamat}

📝 *Catatan:*
${orderForm.catatan || 'Tidak ada catatan'}

---
Terima kasih telah memesan di AutoClean Official!
    `.trim();

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/62895406210356?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Reset form
    setShowOrderForm(false);
    setOrderForm({
      nama: '',
      telepon: '',
      alamat: '',
      jumlah: 1,
      catatan: ''
    });
  };

  const handleFormChange = (field: string, value: string | number) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getImageSrc = () => {
    if (imageError || !product?.gambar_url) {
      return "/Auto Celan Official Logo.png";
    }
    
    if (product.gambar_url.startsWith('http')) {
      return product.gambar_url;
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return `${baseUrl}${product.gambar_url.startsWith('/') ? '' : '/'}${product.gambar_url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading detail produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produk tidak ditemukan</h1>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              Kembali ke Produk
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Product Detail Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  <Link href="/products" className="ml-1 text-sm font-medium text-gray-700 hover:text-red-600 md:ml-2">
                    Produk
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{product.nama_barang}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square relative bg-gray-100 rounded-3xl overflow-hidden">
                <Image
                  src={getImageSrc()}
                  alt={product.nama_barang}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={() => setImageError(true)}
                  priority
                />
              </div>
              
              {/* Platform Links */}
              <div className="flex space-x-4 justify-center">
                {product.link_tiktokshop && (
                  <Link
                    href={product.link_tiktokshop}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-xl transition-colors shadow-lg"
                  >
                    <Image
                      src="/tiktok-shop.png"
                      alt="TikTok Shop"
                      width={24}
                      height={24}
                      className="mr-3"
                    />
                    Beli di TikTok Shop
                  </Link>
                )}
                {product.link_shopee && (
                  <Link
                    href={product.link_shopee}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors shadow-lg"
                  >
                    <Image
                      src="/shopee.png"
                      alt="Shopee"
                      width={24}
                      height={24}
                      className="mr-3"
                    />
                    Beli di Shopee
                  </Link>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.nama_barang}
                </h1>
                <div className="text-4xl font-bold text-red-600 mb-6">
                  {product.harga_formatted}
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi Produk</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words hyphens-auto max-w-full overflow-hidden">
                  <p className="break-all">
                    {product.deskripsi}
                  </p>
                </div>
              </div>

              {/* Order Button */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center text-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  Pesan via WhatsApp
                </button>

                <Link
                  href="/products"
                  className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                  </svg>
                  Lihat Produk Lainnya
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowOrderForm(false);
            }
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-3xl">
              <button
                onClick={() => setShowOrderForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h3 className="text-2xl font-bold mb-2">Form Pemesanan</h3>
              <p className="text-red-100 text-sm">Lengkapi data untuk melanjutkan pemesanan</p>
            </div>

            {/* Product Info */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={getImageSrc()}
                    alt={product.nama_barang}
                    fill
                    className="object-cover"
                    sizes="64px"
                    onError={() => setImageError(true)}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{product.nama_barang}</h4>
                  <p className="text-red-600 font-semibold">{product.harga_formatted}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={orderForm.nama}
                  onChange={(e) => handleFormChange('nama', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  required
                  value={orderForm.telepon}
                  onChange={(e) => handleFormChange('telepon', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap *
                </label>
                <textarea
                  required
                  value={orderForm.alamat}
                  onChange={(e) => handleFormChange('alamat', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                  placeholder="Masukkan alamat lengkap untuk pengiriman"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah *
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handleFormChange('jumlah', Math.max(1, orderForm.jumlah - 1))}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={orderForm.jumlah}
                    onChange={(e) => handleFormChange('jumlah', parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleFormChange('jumlah', orderForm.jumlah + 1)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={orderForm.catatan}
                  onChange={(e) => handleFormChange('catatan', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                  placeholder="Catatan tambahan untuk pesanan"
                />
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total Harga:</span>
                  <span className="text-xl font-bold text-red-600">
                    Rp {(parseInt(product.harga_formatted.replace(/[^\d]/g, '')) * orderForm.jumlah).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                Kirim Pesanan ke WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}