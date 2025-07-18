import React from "react";
import { CalendarIcon } from "./../components/SvgIcons";
import { useTranslations } from 'next-intl';

const QuoteCalendarSection: React.FC = () => {
  const t = useTranslations('QuoteCalendarSection');

  // Construct the events array using the flat key-value structure
  const events = [
    { date: t('event1') || 'Пасха — 20 апреля 2025' },
    { date: t('event2') || 'Престольный праздник — 6 мая 2025' },
  ];

  return (
    <section className="px-0 py-16">
      <div className="px-4 py-0 mx-auto my-0 max-w-screen-xl max-sm:px-5 max-sm:py-0">
        <article className="p-8 mb-8 bg-amber-50 rounded-lg">
          <h3 className="mb-4 text-xl text-black">
            {t('quoteTitle') || 'Цитата дня'}
          </h3>
          <blockquote className="text-base italic text-gray-700">
            {t('quote') || '"Блаженны милостивые, ибо они помилованы будут." (Мф. 5:7)'}
          </blockquote>
        </article>
        <article className="p-8 mb-8 bg-amber-50 rounded-lg">
          <h3 className="mb-4 text-xl text-black">
            {t('calendarTitle') || 'Календарь событий'}
          </h3>
          <div className="flex flex-col gap-2">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex gap-3 items-center text-base text-black"
              >
                <CalendarIcon />
                <span>{event.date}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default QuoteCalendarSection;