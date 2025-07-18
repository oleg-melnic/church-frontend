import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import next/image for optimization
import { useTranslations } from 'next-intl';

const GalleryPreview: React.FC = () => {
  const t = useTranslations('GalleryPreview');

  const images = [
    "/images/lumina-invierii-2025.jpg",
    "/images/pasha.png",
    "/images/scoala1.png",
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {t('title') || 'Галерея'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={t('imageAlt', { index: index + 1 }) || `Галерея ${index + 1}`}
              width={300} // Adjust based on actual image dimensions
              height={192} // Matches the current height (h-48 = 192px)
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/gallery"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            {t('viewAllPhotos') || 'Посмотреть все фото →'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;