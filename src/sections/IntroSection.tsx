import React from "react";
import { useTranslations } from 'next-intl';

const IntroSection: React.FC = () => {
  const t = useTranslations('IntroSection');

  // Функция для обработки текста
  const formatParagraph = (text: string, strongFn: (chunk: string) => string) => {
    return text.replace(/\*\*(.*?)\*\*/g, (match, chunk) => strongFn(chunk)); // Заменяем **текст** на <strong>текст</strong>
  };

  const paragraph1 = formatParagraph(t.raw('paragraph1') || '', (chunk) => `<strong>${chunk}</strong>`);

  return (
    <section className="flex flex-col gap-6 items-center text-center">
      <h2 className="text-4xl text-slate-800 max-md:text-3xl max-sm:text-3xl">
        {t('title')}
      </h2>
      <div className="text-base max-w-[800px] text-slate-600 text-left space-y-4">
        <p
          dangerouslySetInnerHTML={{
            __html: paragraph1,
          }}
        />
        <p>{t('paragraph2')}</p>
        <p>{t('paragraph3')}</p>
        <p className="italic">{t('paragraph4')}</p>
      </div>
    </section>
  );
};

export default IntroSection;