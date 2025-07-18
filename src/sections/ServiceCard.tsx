import React from "react";

interface ServiceCardProps {
  day: string;
  schedule: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ day, schedule }) => {
  return (
    <article className="p-6 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] w-[400px] max-md:w-full max-md:max-w-[500px]">
      <h3 className="mb-2 text-base text-black">{day}</h3>
      {schedule.map((item, index) => (
        <p key={index} className="mt-2 text-base text-black">
          {item}
        </p>
      ))}
    </article>
  );
};

export default ServiceCard;
