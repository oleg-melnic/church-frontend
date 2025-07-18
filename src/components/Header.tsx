"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { ChurchIcon } from './SvgIcons';
import Button from './Button';

const Header: React.FC = () => {
  const t = useTranslations('Header');
  const router = useRouter();
  const locale = router.locale || 'ru'; // Запасное значение 'ru'
  const { asPath } = router;

  const switchLocale = (newLocale: string) => {
    router.push(asPath, asPath, { locale: newLocale });
  };

  return (
    <header className="fixed inset-x-0 top-0 h-20 bg-white bg-opacity-90 shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-[100] max-sm:h-[60px]">
      <div className="flex justify-between items-center px-4 py-0 mx-auto my-0 max-w-screen-xl h-full">
        <div className="flex gap-3 items-center">
          <ChurchIcon />
          <h1 className="text-xl text-gray-800 max-md:text-lg">
            <Link href="/">{t('churchName') || 'Церковь св. Георгия Победоносца'}</Link>
          </h1>
        </div>
        <nav className="flex gap-8 items-center max-md:gap-5 max-sm:hidden">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/news"
                className={`text-base no-underline ${
                  router.pathname === '/news'
                    ? 'text-amber-700 font-semibold'
                    : 'text-gray-700 hover:text-amber-600'
                }`}
              >
                {t('news') || 'Новости'}
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className={`text-base no-underline ${
                  router.pathname === '/gallery'
                    ? 'text-amber-700 font-semibold'
                    : 'text-gray-700 hover:text-amber-600'
                }`}
              >
                {t('gallery') || 'Галерея'}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`text-base no-underline ${
                  router.pathname === '/about'
                    ? 'text-amber-700 font-semibold'
                    : 'text-gray-700 hover:text-amber-600'
                }`}
              >
                {t('about') || 'О нас'}
              </Link>
            </li>
            <li>
              <Link
                href="/note"
                className={`text-base no-underline ${
                  router.pathname === '/note'
                    ? 'text-amber-700 font-semibold'
                    : 'text-gray-700 hover:text-amber-600'
                }`}
              >
                {t('notes') || 'Записки'}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`text-base no-underline ${
                  router.pathname === '/contact'
                    ? 'text-amber-700 font-semibold'
                    : 'text-gray-700 hover:text-amber-600'
                }`}
              >
                {t('contact') || 'Контакты'}
              </Link>
            </li>
            <li>
              <Link href="/donation">
                <Button variant="primary">{t('donate') || 'Пожертвовать'}</Button>
              </Link>
            </li>
            <li className="flex gap-2">
              <button
                onClick={() => switchLocale('ru')}
                className={`px-2 py-1 text-sm rounded-md ${
                  locale === 'ru' ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => switchLocale('ro')}
                className={`px-2 py-1 text-sm rounded-md ${
                  locale === 'ro' ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                RO
              </button>
            </li>
          </ul>
        </nav>
        <button className="hidden max-sm:block" aria-label="Меню">
          <div
            dangerouslySetInnerHTML={{
              __html:
                "<svg xmlns='http://www.w3.org/2000/svg' class='w-[24px] h-[24px]' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' fill='none'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M4 6h16M4 12h16M4 18h16'></path></svg>",
            }}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
