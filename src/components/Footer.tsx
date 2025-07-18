import React from 'react';
import Link from 'next/link'; // Импортируем Link для локализованных маршрутов
import { VkIcon, TelegramIcon, YoutubeIcon } from './SvgIcons';
import { useTranslations } from 'next-intl';
import { FacebookIcon } from './SocialIcons';

const Footer: React.FC = () => {
  const t = useTranslations('Footer');

  // Массив для ссылок на социальные сети
  const socialLinks = [
    {
      href: 'https://www.facebook.com/profile.php?id=61562180212368', // Замени на реальную ссылку, если есть
      ariaLabel: 'Facebook',
      icon: <FacebookIcon color={'white'} size={25} />,
    },
    {
      href: 'https://t.me/prot_oleg_melnic', // Замени на реальную ссылку, если есть
      ariaLabel: t('socialMediaTelegram') || 'Telegram',
      icon: <TelegramIcon />,
    },
    {
      href: 'https://www.youtube.com/@omelnic',
      ariaLabel: t('socialMediaYoutube') || 'YouTube',
      icon: <YoutubeIcon />,
    },
  ];

  // Массив для быстрых ссылок
  const quickLinks = [
    {
      label: t('serviceSchedule') || 'Расписание богослужений',
      href: '/schedule',
    },
    {
      label: t('submitNote') || 'Подать записку',
      href: '/note',
    },
    {
      label: t('makeDonation') || 'Сделать пожертвование',
      href: '/donation',
    },
  ];

  return (
    <footer className="px-0 pt-12 pb-0 bg-gray-900">
      <div className="flex justify-between px-4 py-0 mx-auto my-0 mb-8 max-w-screen-xl max-sm:flex-col max-sm:gap-8 max-sm:text-center">
        <div>
          <h3 className="mb-5 text-xl text-white">{t('contacts') || 'Контакты'}</h3>
          <address className="not-italic">
            <p className="mb-3 text-base text-white">{t('address') || 'Адрес: ул. Щусева, 100'}</p>
            <p className="mb-3 text-base text-white">{t('city') || 'г. Новые Анены, Р. Молдова'}</p>
            <p className="mb-3 text-base text-white">{t('phone1') || '+(373) 676-29-020'}</p>
            <p className="mb-3 text-base text-white">{t('phone2') || '+(373) 676-29-022'}</p>
            <p className="mb-3 text-base text-white">{t('email') || 'oleg.melnic@gmail.com'}</p>
          </address>
        </div>
        <div>
          <h3 className="mb-5 text-xl text-white">{t('socialMedia') || 'Социальные сети'}</h3>
          <div className="flex gap-4 max-sm:justify-center">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.href} aria-label={link.ariaLabel}>
                {link.icon}
              </a>
            ))}
          </div>
        </div>
        <nav>
          <h3 className="mb-5 text-xl text-white">{t('quickLinks') || 'Быстрые ссылки'}</h3>
          <div className="flex flex-col gap-2">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-base text-white no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div className="px-0 py-9 text-base text-center text-gray-400 border-t border-solid border-t-gray-800 max-sm:px-0 max-sm:py-5">
        {t('copyright') || '© 2025 Храм св. Георгия Победоносца. Все права защищены.'}
      </div>
    </footer>
  );
};

export default Footer;