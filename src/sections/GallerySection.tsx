"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import axios from 'axios';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

interface Album {
  id: number;
  name: string;
  images: Image[];
}

interface Image {
  id: number;
  url: string;
  caption: string;
  type: 'photo' | 'video';
}

const GallerySection: React.FC<{ activeFilter: string; activeTypeFilter: string }> = ({ activeFilter, activeTypeFilter }) => {
  const t = useTranslations('GallerySection');
  const locale = useLocale();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/gallery/albums', {
          params: { locale },
        });
        console.log('Fetched albums:', response.data);
        setAlbums(response.data);
      } catch (err: any) {
        console.error(t('errorLoadingAlbums'), err.message);
      }
    };
    fetchAlbums();
  }, [t, locale]);

  useEffect(() => {
    console.log('Active filter:', activeFilter);
    console.log('Active type filter:', activeTypeFilter);
    console.log('Albums:', albums);

    let images: Image[] = [];
    if (activeFilter === t('filterAll')) {
      images = albums.flatMap((album) => album.images);
      console.log('Filtering by "All", images:', images);
    } else {
      const filteredAlbum = albums.find((album) => album.name === activeFilter);
      images = filteredAlbum?.images || [];
      console.log(`Filtering by album "${activeFilter}", filtered album:`, filteredAlbum, 'images:', images);
    }

    if (activeTypeFilter !== t('filterAll')) {
      images = images.filter((image) => image.type === activeTypeFilter.toLowerCase());
      console.log(`Filtering by type "${activeTypeFilter}", images:`, images);
    }

    setFilteredImages(images);
    console.log('Filtered images set to:', images);
  }, [activeFilter, activeTypeFilter, albums, t]);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
    setIsSlideshowPlaying(false);
  };

  const toggleSlideshow = () => {
    setIsSlideshowPlaying(prev => !prev);
  };

  // Обработчик клика по фону модального окна
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="relative cursor-pointer group"
            onClick={() => openModal(index)}
          >
            {image.type === 'photo' ? (
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
                onError={(e) => console.error('Image load error:', image.url, e)}
              />
            ) : (
              <video
                src={image.url}
                className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
                muted
                loop
                autoPlay
                onError={(e) => console.error('Video load error:', image.url, e)}
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center">
              <p className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {image.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={handleBackdropClick} // Добавляем обработчик клика по фону
        >
          <div className="relative w-full max-w-3xl p-4 z-[60]">
            <button
              className="absolute top-4 right-4 text-white text-2xl z-[70]"
              onClick={closeModal}
            >
              ×
            </button>
            <button
              className="absolute top-4 right-16 text-white text-lg bg-amber-700 px-4 py-2 rounded-lg z-[70]"
              onClick={toggleSlideshow}
            >
              {isSlideshowPlaying ? t('pauseButton') : t('playButton')}
            </button>
            {isSlideshowPlaying ? (
              <Slide
                autoplay={isSlideshowPlaying} // Управляем воспроизведением через autoplay
                duration={3000}
                transitionDuration={500}
                infinite={true}
                defaultIndex={selectedImageIndex}
              >
                {filteredImages.map((image) => (
                  <div key={image.id} className="each-slide-effect">
                    {image.type === 'photo' ? (
                      <div
                        style={{
                          backgroundImage: `url(${image.url})`,
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          height: '70vh',
                          width: '100%',
                        }}
                      >
                        <div className="text-center text-white mt-2">{image.caption}</div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-[70vh] w-full">
                        <video
                          src={image.url}
                          className="max-h-full max-w-full rounded-lg"
                          controls
                          autoPlay
                          loop
                        />
                        <div className="text-center text-white mt-2">{image.caption}</div>
                      </div>
                    )}
                  </div>
                ))}
              </Slide>
            ) : (
              <div>
                {filteredImages[selectedImageIndex].type === 'photo' ? (
                  <img
                    src={filteredImages[selectedImageIndex].url}
                    alt={filteredImages[selectedImageIndex].caption}
                    className="w-full h-[70vh] object-contain rounded-lg"
                  />
                ) : (
                  <video
                    src={filteredImages[selectedImageIndex].url}
                    className="w-full h-[70vh] object-contain rounded-lg"
                    controls
                    autoPlay
                    loop
                  />
                )}
                <div className="text-center text-white mt-2">
                  {filteredImages[selectedImageIndex].caption}
                </div>
              </div>
            )}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-[70]"
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev === 0 ? filteredImages.length - 1 : prev! - 1
                )
              }
            >
              {'<'}
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-[70]"
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev === filteredImages.length - 1 ? 0 : prev! + 1
                )
              }
            >
              {'>'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection;