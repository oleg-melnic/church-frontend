import React from 'react';
import { useTranslations } from 'next-intl';

interface HistoryCardProps {
  year: string;
  title: string;
  description: string;
}

function HistoryCard({ year, title, description }: HistoryCardProps) {
  return (
    <article className="flex-1 p-6 bg-white rounded-lg shadow-sm">
      <time className="mb-4 text-xl text-amber-700">{year}</time>
      <h3 className="mb-4 text-xl text-slate-800">{title}</h3>
      <p className="text-base text-slate-600">{description}</p>
    </article>
  );
}

export function HistorySection() {
  const t = useTranslations('About');

  // Массив данных для карточек
  const historyItems = [
    {
      year: '2010',
      title: t('history2010Title') || 'Основание общины',
      description:
        t('history2010Description') ||
        'Начало богослужебной жизни в арендованном помещении районной больницы',
    },
    {
      year: '2024',
      title: t('history2024aTitle') || 'Начало служения на новом месте',
      description:
        t('history2024aDescription') ||
        'Первый шаг богослужебной жизни в нашем новом малом храме',
    },
    {
      year: '2024',
      title: t('history2024bTitle') || 'Начало строительства',
      description:
        t('history2024bDescription') ||
        'Освящение и закладка первого камня под главный храм',
    },
    {
      year: '2025',
      title: t('history2025Title') || 'Современность',
      description:
        t('history2025Description') ||
        'Завершено строительство зимнего храма собора, и начаты работы по возведению стен летнего храма',
    },
  ];

  return (
    <section className="flex justify-center py-16 bg-slate-50">
      <div className="px-4 max-w-screen-xl">
        <h2 className="mb-12 text-3xl text-center text-slate-800">
          {t('historyTitle') || 'История прихода'}
        </h2>
        <div className="flex gap-8 max-md:flex-col">
          {historyItems.map((item, index) => (
            <HistoryCard
              key={index}
              year={item.year}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HistorySection;