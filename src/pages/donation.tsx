import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import IntroSection from '../sections/IntroSection';
import DonationFormSection from '../sections/DonationFormSection';
import KtitorSection from '../sections/KtitorSection';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

const Donation: React.FC = () => {
  const t = useTranslations('Donation');
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (router.query.success === 'true') {
      setSuccessMessage(t('paymentSuccess'));
      setTimeout(() => setSuccessMessage(null), 5000);
    } else if (router.query.canceled === 'true') {
      setSuccessMessage(t('paymentCanceled'));
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
        <IntroSection />
        <KtitorSection />
        <DonationFormSection />
      </main>
    </Elements>
  );
};

export default Donation;

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