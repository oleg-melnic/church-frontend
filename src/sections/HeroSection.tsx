import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const HeroSection: React.FC = () => {
  const t = useTranslations('Home');

  return (
    <section className="relative mt-20 h-[900px]">
      <img
        src="biserica-big2.png"
        className="object-cover size-full"
        alt="Church Interior"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute left-20 top-2/4 text-white -translate-y-2/4 max-w-[614px] max-md:left-10 max-md:max-w-[500px] max-sm:left-5 max-sm:px-5 max-sm:py-0 max-sm:max-w-full">
        <h2 className="mb-12 text-5xl leading-10 max-md:text-4xl max-md:leading-10 max-sm:text-3xl max-sm:leading-8">
          {t('welcome') || 'Добро пожаловать в церковь святого великомученика Георгия Победоносца'}
        </h2>
        <div className="mt-2">
          <Link
            href="/about"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            {t('learnMore') || 'Узнать больше'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;