import { getRequestConfig } from 'next-intl/server';

export const locales = ['ru', 'ro'] as const; // Поддерживаемые языки
export const defaultLocale = 'ru'; // Язык по умолчанию

export default getRequestConfig(async ({ locale }) => {
  let resolvedLocale = locale || defaultLocale;

  if (!locales.includes(resolvedLocale as typeof locales[number])) {
    resolvedLocale = defaultLocale;
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  };
});