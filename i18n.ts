import { getRequestConfig } from 'next-intl/server';

export const locales = ['ru', 'ro'] as const; // Поддерживаемые языки
export const defaultLocale = 'ru'; // Язык по умолчанию

export default getRequestConfig(async ({ locale }) => {
  // Валидация locale (опционально)
  if (!locales.includes(locale as any)) {
    // Можно throw new Error или redirect, но для простоты вернём default
    locale = defaultLocale;
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default  // Путь к вашим переводам (ru.json, ro.json)
  };
});