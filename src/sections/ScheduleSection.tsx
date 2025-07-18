import React from 'react';

const ScheduleSection: React.FC = () => {
  const schedule = [
    { time: "8:00", event: "Воскресная литургия" },
    { time: "11:00", event: "Крестный ход" },
    { time: "12:00", event: "Праздничная трапеза" },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Расписание богослужений
        </h2>
        <ul className="space-y-4">
          {schedule.map((item, index) => (
            <li key={index} className="flex items-center gap-4">
              <span className="text-amber-700 font-semibold">{item.time}</span>
              <span className="text-gray-700">{item.event}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ScheduleSection;
