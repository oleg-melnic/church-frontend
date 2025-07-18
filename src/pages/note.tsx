"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Correct import for App Router
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useTranslations } from 'next-intl';
import DonationCards from '../sections/DonationCards';
import PrayerNoteInfo from '../sections/PrayerNoteInfo';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

const Donation: React.FC = () => {
  const t = useTranslations('PrayerNoteInfo');
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (router.query?.success === 'true') {
      setSuccessMessage(t('successMessage') || 'Оплата успешно завершена! Спасибо за вашу поддержку.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } else if (router.query?.canceled === 'true') {
      setSuccessMessage(t('canceledMessage') || 'Оплата была отменена. Пожалуйста, попробуйте снова.');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [router.query, t]);

  return (
    <Elements stripe={stripePromise}>
      <main className="flex flex-col gap-16 px-20 py-32 flex-grow max-md:px-10 max-sm:px-5">
        {successMessage && (
          <div className="text-center py-4 bg-green-100 text-green-800 rounded-lg">
            {successMessage}
          </div>
        )}
        <section className="flex flex-col gap-6 items-center text-center">
          <h2 className="text-4xl text-slate-800 max-md:text-3xl max-sm:text-3xl">
            {t('title') || 'Церковные записки'}
          </h2>
          <PrayerNoteInfo />
        </section>
        <DonationCards />
      </main>
    </Elements>
  );
};

export default Donation;

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