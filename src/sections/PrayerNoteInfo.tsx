import React from 'react';
import { useTranslations } from 'next-intl';

const PrayerNoteInfo: React.FC = () => {
  const t = useTranslations('DonationCards');

  // Extract the prayer types as an array for rendering
  const prayerTypes = t.raw('prayerTypes') || [
    {
      name: 'Простая записка',
      description: 'имена передаются священнику и поминаются в алтаре во время Литургии.',
    },
    {
      name: 'Проскомидия',
      description: 'имена читаются на особой части Литургии, когда священник вынимает частицы из просфор за живых и усопших, молитвенно соединяя их с Жертвой Христа.',
    },
    {
      name: 'Заказная ектения',
      description: 'имена включаются в особую ектению на Литургии, где вслух произносится прошение за конкретных людей.',
    },
    {
      name: 'Сорокоуст',
      description: 'имя подаётся на 40 Божественных Литургий подряд. Это одна из самых действенных форм молитвенного заступничества за живых или усопших.',
    },
    {
      name: '40 проскомидий',
      description: 'имя поминается на проскомидии перед каждой Литургией в течение 40 дней.',
    },
  ];

  return (
    <div className="text-base max-w-[800px] text-slate-600 text-left space-y-4">
      <p>
        {t('prayerNoteIntro') ||
          'В храме совершается молитва не только за тех, кто присутствует на богослужении, но и за тех, кого мы приносим в молитве через записки. Подать имена своих близких — значит с верой и любовью препоручить их судьбу Богу и Церкви.'}
      </p>
      <p>
        <strong>{t('prayerNoteTypesTitle') || 'Записки бывают двух видов:'}</strong>
        <br />
        — <strong>{t('prayerNoteHealth') || 'О здравии'}</strong>{' '}
        {t('prayerNoteHealthDescription') ||
          '— за живых: о даровании здоровья, помощи, укрепления в вере, исцеления.'}
        <br />
        — <strong>{t('prayerNoteRepose') || 'Об упокоении'}</strong>{' '}
        {t('prayerNoteReposeDescription') ||
          '— за усопших: о прощении грехов, упокоении души и жизни вечной.'}
      </p>
      <p><strong>{t('prayerTypesTitle') || 'Виды молитвенного поминовения:'}</strong></p>
      <ul className="list-disc pl-6 space-y-2">
        {prayerTypes.map((type: { name: string; description: string }, index: number) => (
          <li key={index}>
            <strong>{type.name}</strong> — {type.description}
          </li>
        ))}
      </ul>
      <p>
        {t('prayerNoteSpiritualGift') ||
          '🙏 Подавая записку, вы приносите духовный дар, соединяя свою молитву с молитвой Церкви.'}
      </p>
      <p>
        {t('prayerNoteSubmission') ||
          '📜 Записки можно подать лично в храме или онлайн, выбрав нужный тип поминовения и указав имена крещёных православных христиан.'}
      </p>
    </div>
  );
};

export default PrayerNoteInfo;