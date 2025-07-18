import React from 'react';
import Image from 'next/image'; // Импортируем next/image
import { CheckIcon } from '../components/Icons';
import { useTranslations } from 'next-intl';

export function SundaySchoolSection() {
  const t = useTranslations('About');

  return (
    <section className="flex justify-center py-16 bg-white">
      <div className="flex gap-12 px-4 max-w-screen-xl max-md:flex-col">
        <article className="flex flex-col max-w-[600px]">
          <h2 className="mb-4 text-3xl text-slate-800">
            {t('sundaySchoolTitle') || 'Воскресная школа'}
          </h2>
          <p className="mb-4 text-base text-slate-600">
            {t('sundaySchoolDescription') ||
              'Под руководством матушки Аллы наша воскресная школа стала местом духовного возрастания для детей всех возрастов.'}
          </p>
          <ul className="flex flex-col gap-4">
            <li className="flex gap-3 items-center">
              <CheckIcon className="w-[14px] h-[16px]" />
              <span className="text-base text-slate-600">
                {t('sundaySchoolStat1') || 'Более 30 учеников'}
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <CheckIcon className="w-[14px] h-[16px]" />
              <span className="text-base text-slate-600">
                {t('sundaySchoolStat2') || 'Победы в епархиальных конкурсах'}
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <CheckIcon className="w-[14px] h-[16px]" />
              <span className="text-base text-slate-600">
                {t('sundaySchoolStat3') || 'Регулярные паломничества'}
              </span>
            </li>
          </ul>
        </article>
        <div className="grid grid-cols-2 gap-4 max-w-[600px] max-sm:grid-cols-1">
          <Image
            src="/images/scoala1.png" // Абсолютный путь
            alt="Sunday School Activity"
            width={300} // Указываем ширину
            height={292} // Указываем высоту
            className="w-full h-[292px] rounded-[8px] object-cover"
          />
          <Image
            src="/images/scoala2.png"
            alt="Sunday School Activity"
            width={300}
            height={292}
            className="w-full h-[292px] rounded-[8px] object-cover"
          />
          <Image
            src="/images/scoala3.png"
            alt="Sunday School Activity"
            width={300}
            height={292}
            className="w-full h-[292px] rounded-[8px] object-cover"
          />
          <Image
            src="/images/scoala4.png"
            alt="Sunday School Activity"
            width={300}
            height={292}
            className="w-full h-[292px] rounded-[8px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default SundaySchoolSection;