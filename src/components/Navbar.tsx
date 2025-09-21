"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/Auto Celan Official Logo.png"
                alt="AutoClean Official"
                width={120}
                height={48}
                priority
                className="h-7 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-6">
              <Link 
                href="/" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 relative"
              >
                Beranda
              </Link>
              <Link 
                href="/#about" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 relative"
              >
                Tentang
              </Link>
              <Link 
                href="/#vision" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 relative"
              >
                Visi Misi
              </Link>
              <Link 
                href="/products" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 relative"
              >
                Produk
              </Link>
              <Link 
                href="/#contact" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 relative"
              >
                Kontak
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="border-t border-gray-100 bg-white/98 backdrop-blur-sm">
              <nav className="px-4 py-4 space-y-2">
                <Link 
                  href="/" 
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:bg-red-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Beranda
                </Link>
                <Link 
                  href="/#about" 
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:bg-red-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tentang
                </Link>
                <Link 
                  href="/#vision" 
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:bg-red-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Visi Misi
                </Link>
                <Link 
                  href="/products" 
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:bg-red-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Produk
                </Link>
                <Link 
                  href="/#contact" 
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:bg-red-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kontak
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}