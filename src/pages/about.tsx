"use client";

import React from 'react';
import HeroSec from '../sections/HeroSec';
import { HistorySection } from '../sections/HistorySection';
import { PriestSection } from '../sections/PriestSection';
import { SundaySchoolSection } from '../sections/SundaySchoolSection';
import { ConstructionSection } from '../sections/ConstructionSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { useTranslations } from 'next-intl';

const About: React.FC = () => {
  const t = useTranslations('About');

  return (
    <div>
      <HeroSec />
      <HistorySection />
      <PriestSection />
      <SundaySchoolSection />
      <ConstructionSection />
      <TestimonialsSection />
    </div>
  );
};

export default About;

export async function getStaticProps({ locale }: { locale: string }) {
  console.log('getStaticProps locale:', locale); // Логируем locale

  let messages;
  if (locale === 'ru') {
    messages = (await import('../../messages/ru.json')).default;
  } else if (locale === 'ro') {
    messages = (await import('../../messages/ro.json')).default;
  } else {
    messages = (await import('../../messages/ru.json')).default;
  }

  const props = {
    props: {
      messages,
      locale: locale || 'ru',
    },
  };
  console.log('getStaticProps props:', props); // Логируем возвращаемые props
  return props;
}