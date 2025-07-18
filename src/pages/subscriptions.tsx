"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { useRouter } from 'next/router';

const SubscriptionsPage: React.FC = () => {
  const t = useTranslations('Subscriptions');
  const router = useRouter();
  const { email } = router.query;
  const [preferences, setPreferences] = useState({
    news: true,
    schedule: true,
    gallery: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  useEffect(() => {
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('invalidEmail'));
      return;
    }
  }, [email, t]);

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (typeof email !== 'string') return;

    try {
      await axios.put('http://localhost:3003/api/subscriptions/update', {
        email,
        preferences: {
          news: preferences.news,
          schedule: preferences.schedule,
          gallery: preferences.gallery,
        },
      });
      setSuccess(t('updateSuccess'));
    } catch (err: any) {
      setError(err.response?.data?.message || t('updateError'));
    }
  };

  const handleUnsubscribe = async () => {
    setError(null);
    setSuccess(null);

    if (typeof email !== 'string') return;

    try {
      await axios.delete(`http://localhost:3003/api/subscriptions/unsubscribe?email=${email}`);
      setSuccess(t('unsubscribeSuccess'));
      setIsUnsubscribed(true);
    } catch (err: any) {
      setError(err.response?.data?.message || t('unsubscribeError'));
    }
  };

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return <div className="text-center py-16">{t('invalidEmail')}</div>;
  }

  if (isUnsubscribed) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-4">{t('title')}</h2>
        <p className="text-green-500">{success}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">{t('title')}</h2>
      <p className="mb-4">{t('manageSubscriptions', { email })}</p>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.news}
              onChange={() => handlePreferenceChange('news')}
              className="h-4 w-4"
            />
            {t('subscribeToNews')}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.schedule}
              onChange={() => handlePreferenceChange('schedule')}
              className="h-4 w-4"
            />
            {t('subscribeToSchedule')}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.gallery}
              onChange={() => handlePreferenceChange('gallery')}
              className="h-4 w-4"
            />
            {t('subscribeToGallery')}
          </label>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
        >
          {t('updateButton')}
        </button>
        <button
          type="button"
          onClick={handleUnsubscribe}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          {t('unsubscribeButton')}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
};

export default SubscriptionsPage;

export async function getServerSideProps({ locale }: { locale: string }) {
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