import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang={typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'ru' : 'ru'}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
