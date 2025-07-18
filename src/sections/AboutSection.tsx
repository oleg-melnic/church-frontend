import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import next/image for optimization
import { useTranslations } from 'next-intl';

const AboutSection: React.FC = () => {
  const t = useTranslations('About');

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-center">
        {/* Текстовая часть */}
        <div className="lg:w-1/2">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('aboutSectionTitle') || 'О нашем храме'}
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            {t('aboutSectionDescription') ||
              'Храм святого великомученика Георгия Победоносца является центром духовной жизни нашего района. Построенный в традициях русского православного зодчества, он всегда остаётся открытым для всех, кто ищет Бога и нуждается в утешении.'}
          </p>
          <Link
            href="/about"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            {t('aboutSectionLearnMore') || 'Узнать больше'}
          </Link>
        </div>

        {/* Изображение */}
        <div className="lg:w-1/2">
          <Image
            src="/biserica-big2.png" // Updated path to match project structure
            alt={t('churchName') || 'Церковь Святого Георгия Победоносца'}
            width={600} // Adjust based on actual image dimensions
            height={400} // Adjust based on actual image dimensions
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;