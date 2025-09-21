"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { fetchBarangList } from "../../utils/api";

export default function Products() {
  type Product = {
    id: string | number;
    nama_barang: string;
    deskripsi: string;
    gambar_url?: string;
    harga_formatted: string;
    link_tiktokshop?: string;
    link_shopee?: string;
  };

  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchBarangList();
        console.log('Products data:', data); // Debug log
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleImageError = (productId: string | number) => {
    setImageErrors(prev => new Set(prev).add(String(productId)));
  };

  const getImageSrc = (product: Product) => {
    const hasError = imageErrors.has(String(product.id));
    if (hasError || !product.gambar_url) {
      return "/Auto Celan Official Logo.png";
    }
    
    // Pastikan URL gambar adalah URL lengkap
    if (product.gambar_url.startsWith('http')) {
      return product.gambar_url;
    }
    
    // Jika relatif, tambahkan base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return `${baseUrl}${product.gambar_url.startsWith('/') ? '' : '/'}${product.gambar_url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Koleksi Produk Perawatan Kendaraan
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight">
              Produk AutoClean
              <br />
              <span className="bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                Kualitas Premium
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-red-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Temukan produk perawatan kendaraan terbaik untuk menjaga kendaraan Anda 
              tetap bersih, berkilau, dan terawat optimal.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Produk Kami
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Koleksi Produk
              <span className="text-red-600"> AutoClean</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dapatkan produk perawatan kendaraan berkualitas tinggi yang telah dipercaya oleh ribuan pelanggan
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {products.length === 0 ? (
              <div className="col-span-3 text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-gray-500">Produk akan segera tersedia</p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={String(product.id)}
                  name={product.nama_barang}
                  price={product.harga_formatted}
                  image={getImageSrc(product)}
                  whatsappNumber="62895406210356"
                  tiktokShopUrl={product.link_tiktokshop}
                  shopeeUrl={product.link_shopee}
                  onClick={() => handleProductClick(product)}
                  showOrderButton={false}
                />
              ))
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="group relative bg-gradient-to-br from-red-50 to-red-100 p-8 lg:p-12 rounded-3xl border border-red-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 max-w-4xl mx-auto">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-200 rounded-full -mt-10 -mr-10 opacity-50"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Butuh Bantuan Memilih Produk?
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  Tim ahli kami siap membantu Anda memilih produk yang tepat sesuai kebutuhan dan jenis kendaraan Anda. 
                  Konsultasi gratis!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://wa.me/62895406210356?text=Halo,%20saya%20butuh%20bantuan%20memilih%20produk%20AutoClean"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                    </svg>
                    Konsultasi via WhatsApp
                  </a>
                  <Link
                    href="/"
                    className="flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-200 border border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                    </svg>
                    Kembali ke Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
