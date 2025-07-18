import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';  // Импортируйте из i18n.ts

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'  // Или 'always' для префиксов /ru/, /ro/; 'never' для скрытых
});

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)']  // Исключить системные пути
};