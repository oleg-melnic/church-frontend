"use client";

import React from 'react';
import ContactForm from '../sections/ContactForm';
import ContactCard from '../sections/ContactCards';
import MapSection from '../sections/MapSection';
import { useTranslations } from 'next-intl';

const Contact: React.FC = () => {
  const t = useTranslations('Contact');

  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex justify-center items-center px-20 py-32 w-full max-md:px-10 max-sm:px-5">
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-4xl text-gray-800">
            {t('title') || 'Контакты'}
          </h2>
          <p className="text-base text-gray-600">
            {t('description') || 'Мы всегда рады помочь и ответить на ваши вопросы'}
          </p>
        </div>
      </section>
      <ContactCard />
      <ContactForm />
      <MapSection />
    </div>
  );
};

export default Contact;

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

  const props = {
    props: {
      messages,
      locale: locale || 'ru',
    },
  };
  console.log('getStaticProps props:', props);
  return props;
}