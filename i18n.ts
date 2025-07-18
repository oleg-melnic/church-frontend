import { getRequestConfig } from 'next-intl/server';

export const locales = ['ru', 'ro'] as const; // Поддерживаемые языки
export const defaultLocale = 'ru'; // Язык по умолчанию

export default getRequestConfig(async ({ locale }) => {
  // Валидация locale (опционально)
  if (!locales.includes(locale as any)) {
    locale = defaultLocale; // Исправляем на валидный
  }

  const messages = (await import(`./messages/${locale}.json`)).default;

  return {
    locale,  // Добавьте это — обязательно для RequestConfig
    messages
  };
});