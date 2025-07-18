"use client";

import React from "react";
import HeroSection from '../sections/HeroSection';
import QuoteCalendarSection from '../sections/QuoteCalendarSection';
import ServiceSchedule from '../sections/ServiceSchedule';
import RecentNews from '../sections/RecentNews';
import GalleryPreview from '../sections/GalleryPreview';
import AboutSection from '../sections/AboutSection';
import { useTranslations } from 'next-intl';

const Home: React.FC = () => {
  const t = useTranslations('Home');

  return (
    <div className="App">
      <HeroSection />
      <ServiceSchedule />
      <RecentNews />
      <GalleryPreview />
      <AboutSection />
      <QuoteCalendarSection />
    </div>
  );
};

export default Home;

export async function getStaticProps({ locale }: { locale: string }) {
  console.log('getStaticProps locale:', locale);

  let messages;
  if (locale === 'ru') {
    messages = (await import('../../messages/ru.json')).default;
  } else if (locale === 'ro') {
    messages = (await import('../../messages/ro.json')).default;
  } else {
    messages = (await import('../../messages/ru.json')).default;
  }

  return {
    props: {
      messages,
      locale: locale || 'ru',
    },
  };
}