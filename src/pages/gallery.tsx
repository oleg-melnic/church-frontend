"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import axios from 'axios';
import GalleryFilter from '../sections/GalleryFilter';
import GallerySection from '../sections/GallerySection';

interface Album {
  id: number;
  name: string;
  images: { id: number; url: string; caption: string; type: string }[];
}

const Gallery: React.FC = () => {
  const t = useTranslations('Gallery'); // Используем пространство имён Gallery
  const tSection = useTranslations('GallerySection'); // Добавляем пространство имён GallerySection
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState(tSection('filterAll')); // Используем filterAll из GallerySection
  const [activeTypeFilter, setActiveTypeFilter] = useState(tSection('filterAll')); // Используем filterAll из GallerySection
  const [albums, setAlbums] = useState<string[]>([tSection('filterAll')]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/gallery/albums', {
          params: { locale },
        });
        const albumNames = response.data.map((album: Album) => album.name);
        setAlbums([tSection('filterAll'), ...albumNames]);
      } catch (err: any) {
        console.error('Ошибка загрузки альбомов:', err.message);
      }
    };
    fetchAlbums();
  }, [tSection, locale]);

  return (
    <main className="flex flex-col px-20 py-24 flex-[grow] max-md:p-8 max-sm:p-5">
      <div className="flex flex-col items-center mb-12">
        <h2 className="my-8 text-3xl text-center text-gray-900">
          {t('title')}
        </h2>
        <p className="text-base text-center text-gray-600 max-w-[649px]">
          {t('description')}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <GalleryFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          albums={albums}
        />
        {/* <div className="flex flex-wrap gap-4 justify-center mb-8">
          {[tSection('filterAll'), t('filterPhotos'), t('filterVideos')].map((type, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                activeTypeFilter === type
                  ? 'bg-amber-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-amber-200'
              }`}
              onClick={() => setActiveTypeFilter(type)}
            >
              {type}
            </button>
          ))}
        </div> */}
      </div>
      <GallerySection activeFilter={activeFilter} activeTypeFilter={activeTypeFilter} />
    </main>
  );
};

export default Gallery;

export async function getServerSideProps({ locale }: { locale: string }) {
  console.log('getServerSideProps locale:', locale);

  let messages;
  try {
    if (locale === 'ru') {
      messages = (await import('../../messages/ru.json')).default;
    } else if (locale === 'ro') {
      messages = (await import('../../messages/ro.json')).default;
    } else {
      messages = (await import('../../messages/ru.json')).default;
    }
  } catch (error) {
    console.error('Ошибка загрузки переводов:', error);
    messages = {};
  }

  return {
    props: {
      messages,
      locale: locale || 'ru',
    },
  };
}
