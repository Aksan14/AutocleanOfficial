"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ProductCard from "../../components/ProductCard";

const products = [
  {
    id: "1",
    name: "Vehicle Shampoo",
    description: "Pembersih mobil dengan formula khusus untuk hasil yang optimal dan aman untuk cat kendaraan",
    image: "/Vehicle Shampoo Feed 1.png",
    price: "Rp 45.000",
    whatsappNumber: "6281234567890",
    tiktokShopUrl: "https://shop.tiktok.com/autoclean-vehicle-shampoo",
    shopeeUrl: "https://shopee.co.id/autoclean-vehicle-shampoo"
  },
  {
    id: "2", 
    name: "Engine Degreaser",
    description: "Pembersih mesin yang efektif menghilangkan kotoran dan lemak membandel pada mesin kendaraan",
    image: "/Engine Degreaser Feed 1.png",
    price: "Rp 55.000",
    whatsappNumber: "6281234567890",
    tiktokShopUrl: "https://shop.tiktok.com/autoclean-engine-degreaser",
    shopeeUrl: "https://shopee.co.id/autoclean-engine-degreaser"
  },
  {
    id: "3",
    name: "Body Shine",
    description: "Produk untuk memberikan kilau maksimal pada body kendaraan dan perlindungan jangka panjang",
    image: "/Body Shine Feed 1.png", 
    price: "Rp 65.000",
    whatsappNumber: "6281234567890",
    tiktokShopUrl: "https://shop.tiktok.com/autoclean-body-shine",
    shopeeUrl: "https://shopee.co.id/autoclean-body-shine"
  },
  {
    id: "4",
    name: "Super Black",
    description: "Perawatan khusus untuk bagian hitam kendaraan seperti bumper dan trim plastik",
    image: "/Super Black Feed 2.png",
    price: "Rp 50.000", 
    whatsappNumber: "6281234567890",
    tiktokShopUrl: "https://shop.tiktok.com/autoclean-super-black",
    shopeeUrl: "https://shopee.co.id/autoclean-super-black"
  },
  {
    id: "5",
    name: "Tire Shine",
    description: "Pembersih dan pengkilap ban untuk tampilan yang selalu fresh dan berkilau",
    image: "/Tire Shine Feed 1.png",
    price: "Rp 40.000",
    whatsappNumber: "6281234567890", 
    tiktokShopUrl: "https://shop.tiktok.com/autoclean-tire-shine",
    shopeeUrl: "https://shopee.co.id/autoclean-tire-shine"
  }
];

export default function Products() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts = activeFilter === "all" ? products : products.filter(product => {
    // Add filter logic here if needed
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src="/Auto Celan Official Logo.png"
                  alt="AutoClean Official Logo"
                  width={180}
                  height={54}
                  priority
                  className="h-12 w-auto transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              <Link 
                href="/" 
                className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
                Home
              </Link>
              <Link 
                href="/products" 
                className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd"/>
                </svg>
                Produk
              </Link>
              <Link 
                href="/admin" 
                className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Admin
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200 mt-4">
              <nav className="space-y-2 pt-4">
                <Link 
                  href="/" 
                  className="flex items-center px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                  </svg>
                  Home
                </Link>
                <Link 
                  href="/products" 
                  className="flex items-center px-4 py-3 bg-red-100 text-red-700 rounded-lg font-medium"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd"/>
                  </svg>
                  Produk
                </Link>
                <Link 
                  href="/admin" 
                  className="flex items-center px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Admin
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
              Koleksi Produk AutoClean
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-red-100">
              Temukan produk perawatan kendaraan terbaik untuk menjaga kendaraan Anda tetap prima
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium">Formula Berkualitas</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium">Aman untuk Kendaraan</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium">Hasil Maksimal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter/Category Section */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { id: "all", label: "Semua Produk", icon: "🏷️" },
                { id: "exterior", label: "Pembersih Eksterior", icon: "🚗" },
                { id: "engine", label: "Perawatan Mesin", icon: "⚙️" },
                { id: "accessories", label: "Aksesori", icon: "✨" }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="transform transition-all duration-300 group-hover:scale-105">
                  <ProductCard {...product} />
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto border border-gray-100">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Butuh Bantuan Memilih Produk?
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                  Tim ahli kami siap membantu Anda memilih produk yang tepat sesuai kebutuhan dan jenis kendaraan Anda. 
                  Konsultasi gratis!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/6281234567890?text=Halo,%20saya%20butuh%20bantuan%20memilih%20produk%20AutoClean"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                  </svg>
                  Konsultasi via WhatsApp
                </a>
                <Link
                  href="/"
                  className="flex items-center justify-center px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all duration-200 border border-gray-300"
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
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Image
                src="/Auto Celan Official Logo.png"
                alt="AutoClean Logo"
                width={200}
                height={60}
                className="h-12 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-400 max-w-md">
                AutoClean Official adalah solusi terpercaya untuk perawatan kendaraan Anda.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Produk</Link></li>
                <li><Link href="/admin" className="text-gray-400 hover:text-white transition-colors">Admin</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">WhatsApp: +62 812-3456-7890</li>
                <li className="text-gray-400">Email: info@autoclean.id</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AutoClean Official. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
