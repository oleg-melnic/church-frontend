import React from "react";
import { useTranslations } from 'next-intl';

const IntroSection: React.FC = () => {
  const t = useTranslations('IntroSection');

  return (
    <section className="flex flex-col gap-6 items-center text-center">
      <h2 className="text-4xl text-slate-800 max-md:text-3xl max-sm:text-3xl">
        {t('title')}
      </h2>
      <div className="text-base max-w-[800px] text-slate-600 text-left space-y-4">
        <p
          dangerouslySetInnerHTML={{
            __html: t('paragraph1', { strong: (chunk: string) => `<strong>${chunk}</strong>` }),
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
