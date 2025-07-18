import type { AppProps } from 'next/app';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './../styles/globals.css';
import './../styles/Header.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = router.locale || 'ru'; // Запасное значение 'ru'

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={pageProps.messages}
      timeZone="Europe/Chisinau"
    >
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}