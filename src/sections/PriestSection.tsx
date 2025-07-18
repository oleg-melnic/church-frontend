import React from 'react';
import Image from 'next/image'; // Импортируем next/image
import { EmailIcon } from '../components/Icons';
import { useTranslations } from 'next-intl';

export function PriestSection() {
  const t = useTranslations('About');

  // Формируем локализованную ссылку mailto
  const emailSubject = encodeURIComponent(t('priestEmailSubject') || 'Сообщение с сайта');
  const emailBody = encodeURIComponent(t('priestEmailBody') || 'Здравствуйте, Отец Олег! Я пишу с сайта церкви Святого Георгия Победоносца.');

  return (
    <section className="flex justify-center py-16 bg-white">
      <div className="flex gap-12 px-4 max-w-screen-xl max-md:flex-col">
        <Image
          src="/images/oleg.jpg" // Абсолютный путь
          alt="Church Priest"
          width={600} // Указываем ширину
          height={600} // Указываем высоту
          className="rounded-[8px] shadow-[0px_8px_10px_0px_rgba(0,0,0,0.10),0px_20px_25px_0px_rgba(0,0,0,0.10)] max-lg:w-full max-lg:h-auto"
          priority // Опционально: приоритет для LCP
        />
        <article className="flex flex-col justify-center max-w-[600px]">
          <h2 className="mb-4 text-3xl text-slate-800">
            {t('priestTitle') || 'Настоятель храма'}
          </h2>
          <p className="mb-4 text-base text-slate-600">
            {t('priestDescription1') ||
              'Протоиерей Олег Мельник возглавляет наш приход с 2010 года. Под его духовным руководством храм стал местом молитвы, утешения и вдохновения для многих жителей района.'}
          </p>
          <p className="mb-4 text-base text-slate-600">
            {t('priestDescription2') ||
              'Отец Олег окончил Одесскую духовную семинарию, а также магистратуру Государственного университета Молдовы по специальности «История и культура религий».'}
          </p>
          <p className="mb-4 text-base text-slate-600">
            {t('priestDescription3') ||
              'С 2007 года он несёт пастырское служение, окормляя паству с любовью, терпением и верностью православной традиции.'}
          </p>
          <div className="flex gap-4 items-center">
            <EmailIcon className="w-[16px] h-[16px]" />
            <a
              href={`mailto:${t('priestEmail') || 'oleg.melnic@gmail.com'}?subject=${emailSubject}&body=${emailBody}`}
              className="text-base text-slate-600 hover:underline hover:text-amber-700"
            >
              {t('priestEmail') || 'oleg.melnic@gmail.com'}
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

export default PriestSection;