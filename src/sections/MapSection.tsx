"use client";

import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

const center = {
  lat: 46.88099379711074, // Широта Анении Ной
  lng: 29.219067613725358, // Долгота Анении Ной
};

const MapSection: React.FC = () => {
  const t = useTranslations('Contact');
  const [selected, setSelected] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined' && window.google && window.google.maps) {
      setIcon({
        url: '/images/church-icon.png',
        scaledSize: new window.google.maps.Size(40, 40),
      });
    }
  }, [isLoaded]);

  // URL для Google Maps с маршрутом до церкви
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}&travelmode=driving`;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {t('mapTitle') || 'Где нас найти'}
        </h2>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          onLoad={() => setIsLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
          >
            {icon && (
              <Marker
                position={center}
                icon={icon}
                onClick={() => setSelected(true)}
              />
            )}
            {selected && (
              <InfoWindow
                position={center}
                onCloseClick={() => setSelected(false)}
              >
                <div>
                  <h3>{t('churchName') || 'Церковь Святого Георгия Победоносца'}</h3>
                  <p>{t('city') || 'Анении Ной'}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
        {/* Кнопка "Проложить маршрут" */}
        <div className="text-center mt-6">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            {t('directions') || 'Проложить маршрут'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default MapSection;