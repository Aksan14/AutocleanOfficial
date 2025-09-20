import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/Auto Celan Official Logo.png"
                alt="AutoClean Official Logo"
                width={200}
                height={60}
                priority
                className="h-12 w-auto"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-900 hover:text-red-600 font-medium transition-colors">
                Home
              </a>
              <a href="#about" className="text-gray-900 hover:text-red-600 font-medium transition-colors">
                Tentang Kami
              </a>
              <a href="#vision" className="text-gray-900 hover:text-red-600 font-medium transition-colors">
                Visi & Misi
              </a>
              <Link 
                href="/products" 
                className="text-gray-900 hover:text-red-600 font-medium transition-colors"
              >
                Produk
              </Link>
              <a href="#contact" className="text-gray-900 hover:text-red-600 font-medium transition-colors">
                Kontak
              </a>
              <Link 
                href="/admin" 
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Image
              src="/Auto Celan Official Logo.png"
              alt="AutoClean Official Logo"
              width={300}
              height={100}
              className="mx-auto mb-8 brightness-0 invert"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AutoClean Official
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Solusi Terbaik untuk Perawatan Kendaraan Anda
          </p>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Produk pembersih berkualitas tinggi untuk menjaga kendaraan Anda tetap bersih dan berkilau
          </p>
          <Link
            href="/products"
            className="bg-white text-red-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-colors duration-200"
          >
            Lihat Produk Kami
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tentang AutoClean Official
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                AutoClean Official adalah perusahaan yang bergerak di bidang produk perawatan kendaraan 
                dengan komitmen untuk memberikan solusi pembersihan terbaik bagi kendaraan Anda.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Dengan pengalaman bertahun-tahun dalam industri otomotif, kami memahami kebutuhan 
                perawatan kendaraan yang tepat dan efektif. Produk-produk kami diformulasikan khusus 
                untuk memberikan hasil optimal sambil tetap aman untuk kendaraan Anda.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-red-600 mb-2">5+</h3>
                  <p className="text-gray-600">Tahun Pengalaman</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-red-600 mb-2">1000+</h3>
                  <p className="text-gray-600">Pelanggan Puas</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/Auto Celan Official Logo 1 x 1.png"
                alt="AutoClean Products"
                width={500}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section id="vision" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visi & Misi Kami
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Visi */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi</h3>
              </div>
              <p className="text-gray-600 text-center">
                Menjadi brand perawatan kendaraan terdepan di Indonesia yang dipercaya oleh 
                jutaan pengguna dengan menyediakan produk berkualitas tinggi dan inovatif.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li>• Mengembangkan produk perawatan kendaraan yang aman dan efektif</li>
                <li>• Memberikan pelayanan terbaik kepada seluruh pelanggan</li>
                <li>• Melakukan inovasi berkelanjutan dalam teknologi pembersihan</li>
                <li>• Membangun kepercayaan melalui kualitas produk yang konsisten</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami siap membantu kebutuhan perawatan kendaraan Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* WhatsApp */}
            <div className="text-center p-8 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat langsung dengan tim kami</p>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
              >
                +62 812-3456-7890
              </a>
            </div>

            {/* Email */}
            <div className="text-center p-8 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">Kirim pertanyaan via email</p>
              <a
                href="mailto:info@autoclean.id"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
              >
                info@autoclean.id
              </a>
            </div>

            {/* Lokasi */}
            <div className="text-center p-8 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lokasi</h3>
              <p className="text-gray-600 mb-4">Kunjungi toko kami</p>
              <p className="text-red-600 font-medium">
                Jakarta Selatan<br />
                Indonesia
              </p>
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
                Dengan produk berkualitas tinggi dan layanan terbaik.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">Tentang Kami</a></li>
                <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Produk</Link></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Belanja Online</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <span>TikTok Shop</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <span>Shopee</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/6281234567890" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <span>WhatsApp</span>
                  </a>
                </li>
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
