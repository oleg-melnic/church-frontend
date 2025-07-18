import { createIntl } from 'next-intl';

export const locales = ['ru', 'ro'] as const; // Поддерживаемые языки
export const defaultLocale = 'ru'; // Язык по умолчанию

// Функция для загрузки переводов
export async function getTranslations(locale: string) {
  try {
    return await import(`./messages/${locale}.json`);
  } catch (error) {
    console.error(`Не удалось загрузить переводы для ${locale}:`, error);
    return await import(`./messages/${defaultLocale}.json`); // Fallback на язык по умолчанию
  }
}

// Настройка middleware для обработки языков
export const localeMiddleware = async (request: any) => {
  const { pathname } = request.nextUrl;
  const locale = locales.find((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) || defaultLocale;
  return locale;
};
