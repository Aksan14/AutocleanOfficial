import Image from 'next/image';
import Link from 'next/link';
import { BASE_URL } from '../utils/api';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  whatsappNumber: string;
  tiktokShopUrl?: string;
  shopeeUrl?: string;
}

export default function ProductCard({
  id,
  name,
  description,
  image,
  price,
  whatsappNumber,
  tiktokShopUrl,
  shopeeUrl
}: ProductCardProps) {
  // Nomor WhatsApp dari response
  const whatsappMessage = `Halo, saya tertarik dengan produk ${name}. Bisakah saya mendapatkan informasi lebih lanjut?`;
  // Format nomor WA: hilangkan spasi dan karakter non-digit
  const waNumberClean = whatsappNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${waNumberClean}?text=${encodeURIComponent(whatsappMessage)}`;

  // Perbaiki gambar: jika path relatif, tambahkan BASE_URL
  let imageUrl = image;
  if (image && image.startsWith("/uploads")) {
    imageUrl = `${BASE_URL}${image}`;
  }

  // Link Shopee/TikTok selalu ambil dari response barang
  const tiktokUrl = tiktokShopUrl;
  const shopeeUrlFinal = shopeeUrl;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 w-full">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-3 text-sm">{description}</p>
        <p className="text-2xl font-bold text-red-600 mb-4">{price}</p>
        <div className="space-y-3">
          {/* WhatsApp Order Button */}
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
            </svg>
            Pesan via WhatsApp
          </Link>
          <div className="flex space-x-2 mt-2">
            {tiktokUrl && (
              <Link
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800"
                title="TikTok Shop"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.5 3v12.25a2.25 2.25 0 1 0 2.25-2.25h-1.25V3h-1z" />
                  <path d="M15 3v7.25a4.25 4.25 0 1 1-4.25 4.25h1.25A3 3 0 1 0 15 10.25V3h-1z" />
                </svg>
              </Link>
            )}
            {shopeeUrlFinal && (
              <Link
                href={shopeeUrlFinal}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600"
                title="Shopee"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 7V6a4 4 0 0 1 8 0v1h8v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7h0zm2-1a2 2 0 1 1 4 0v1H6V6z" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
