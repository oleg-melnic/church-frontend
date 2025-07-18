import ruMessages from './../messages/ru.json';
import roMessages from './../messages/ro.json';

export async function getStaticProps({ locale }: { locale: string }) {
  console.log('getStaticProps locale:', locale);

  const messages = locale === 'ro' ? roMessages : ruMessages;

  const props = {
    props: {
      messages,
      locale: locale || 'ru',
    },
  };
  console.log('getStaticProps props:', props);
  return props;
}