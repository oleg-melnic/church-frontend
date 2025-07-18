"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import axios from 'axios';

interface Schedule {
  id: number;
  date: string;
  time: string;
  event: string;
}

const Schedule: React.FC = () => {
  const t = useTranslations('Schedule');
  const locale = useLocale();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/schedule', {
          params: { locale },
        });
        setSchedules(response.data);
      } catch (err: any) {
        console.error('Ошибка загрузки расписания:', err.message);
        setError(t('errorLoadingSchedules'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, [locale, t]);

  if (isLoading) {
    return <div className="text-center py-16">{t('loading')}</div>;
  }

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
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="max-w-4xl mx-auto">
        {schedules.length === 0 ? (
          <p className="text-center text-gray-600">{t('noSchedules')}</p>
        ) : (
          <div className="flex flex-col gap-6">
            {schedules.map(schedule => (
              <div
                key={schedule.id}
                className="p-6 bg-white rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {schedule.event}
                  </h3>
                  <p className="text-base text-gray-600">
                    {schedule.date} в {schedule.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Schedule;

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
