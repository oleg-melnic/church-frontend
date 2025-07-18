import React from 'react';
import Image from 'next/image'; // Импортируем next/image
import { PaintbrushIcon, HeartIcon } from '../components/Icons';
import { useTranslations } from 'next-intl';

interface ConstructionArticle {
  title: string;
  detail: string;
  description: string;
  icon: React.ReactNode;
}

export function ConstructionSection() {
  const t = useTranslations('About');

  // Массив данных для статей
  const articles: ConstructionArticle[] = [
    {
      title: t('currentStage') || 'Текущий этап',
      detail: t('currentStageDetails') || 'Зимняя церковь (нижняя)',
      description:
        t('currentStageDescription') ||
        'Завершено строительство зимнего храма собора, и начаты работы по возведению стен летнего храма',
      icon: <PaintbrushIcon className="w-[18px] h-[16px]" />,
    },
    {
      title: t('futureStage') || 'Будущий этап',
      detail: t('futureStageDetails') || 'Начало строительства верхней церкви (летней)',
      description:
        t('futureStageDescription') ||
        'Кладка стен и возведение купола, который увенчает собор и станет его духовной вершиной',
      icon: <PaintbrushIcon className="w-[18px] h-[16px]" />,
    },
    {
      title: t('fundraising') || 'Сбор средств',
      detail: t('fundraisingDetails') || '10% от необходимой суммы',
      description: t('fundraisingThanks') || 'Благодарим всех жертвователей за помощь',
      icon: <HeartIcon className="w-[16px] h-[16px]" />,
    },
  ];

  return (
    <section className="flex justify-center py-16 bg-slate-50">
      <div className="px-4 max-w-screen-xl">
        <h2 className="mb-12 text-3xl text-center text-slate-800">
          {t('constructionTitle') || 'Строительство собора'}
        </h2>
        <div className="flex gap-8 max-md:flex-col">
          <div className="flex flex-col gap-6 max-w-[608px]">
            {articles.map((article, index) => (
              <article key={index} className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-xl text-slate-800">{article.title}</h3>
                <div className="flex gap-2 items-center mb-2">
                  {article.icon}
                  <span className="text-base text-amber-700">{article.detail}</span>
                </div>
                <p className="text-base text-slate-600">{article.description}</p>
              </article>
            ))}
          </div>
          <Image
            src="/images/church-now.png" // Абсолютный путь
            alt="Church Construction"
            width={608} // Указываем ширину
            height={608} // Указываем высоту
            className="rounded-[8px] shadow-[0px_8px_10px_0px_rgba(0,0,0,0.10),0px_20px_25px_0px_rgba(0,0,0,0.10)] max-lg:w-full max-lg:h-auto"
            priority // Опционально: приоритет для LCP
          />
        </div>
      </div>
    </section>
  );
}

export default ConstructionSection;