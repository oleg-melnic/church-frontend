import React from "react";
import ServiceCard from "./ServiceCard";
import Link from "next/link";
import { useTranslations } from 'next-intl';

const ServiceSchedule: React.FC = () => {
  const t = useTranslations('ScheduleSection');

  // Construct the services array using the flat key-value structure
  const services = [
    {
      day: t('saturday') || 'Суббота',
      schedule: [t('saturdaySchedule') || '17:00 — Всенощное бдение, Таинство исповеди'],
    },
    {
      day: t('sunday') || 'Воскресенье',
      schedule: [t('sundaySchedule') || '8:00 — Утреннее правило, часы и Божественная Литургия'],
    },
  ];

  return (
    <section className="px-0 py-16 bg-gray-50">
      <div className="px-4 py-0 mx-auto my-0 max-w-screen-xl max-sm:px-5 max-sm:py-0">
        <h2 className="mb-10 text-3xl text-center text-gray-800">
          {t('title') || 'Расписание богослужений'}
        </h2>
        <div className="flex gap-6 justify-center mb-8 max-md:flex-col max-md:items-center">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              day={service.day}
              schedule={service.schedule}
            />
          ))}
        </div>
        {/* Uncomment if needed in the future */}
        <div className="text-center mt-8">
          <Link
            href="/schedule"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            {t('fullScheduleLink') || 'Посмотреть полное расписание'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceSchedule;