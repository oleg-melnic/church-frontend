import React from 'react';
import Image from 'next/image'; // Импортируем next/image
import { useTranslations } from 'next-intl';

interface TestimonialCardProps {
  image: string;
  name: string;
  role: string;
  quote: string;
  altText: string;
}

function TestimonialCard({ image, name, role, quote, altText }: TestimonialCardProps) {
  return (
    <article className="flex-1 p-6 rounded-lg bg-slate-50">
      <div className="flex gap-4 items-center mb-4">
        <Image
          src={image} // Абсолютный путь
          alt={altText}
          width={48} // Указываем ширину
          height={48} // Указываем высоту
          className="w-[48px] h-[48px] rounded-full"
        />
        <div>
          <h3 className="text-base text-slate-800">{name}</h3>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
      </div>
      <blockquote className="text-base text-slate-600">&quot;{quote}&quot;</blockquote>
    </article>
  );
}

export function TestimonialsSection() {
  const t = useTranslations('About');

  // Массив данных для карточек
  const testimonials = [
    {
      image: '/images/peaple1.png',
      name: t('testimonialMariaName') || 'Мария',
      role: t('testimonialMariaRole') || 'Прихожанка',
      quote:
        t('testimonialMariaQuote') ||
        'Храм стал для нашей семьи настоящим духовным домом. Особенно радует воскресная школа, где наши дети получают прекрасное духовное образование.',
      altText: `${t('testimonialMariaName') || 'Мария'} - ${t('testimonialMariaRole') || 'Прихожанка'}`,
    },
    {
      image: '/images/peaple2.png',
      name: t('testimonialNikolaiName') || 'Николай',
      role: t('testimonialNikolaiRole') || 'Прихожанин',
      quote:
        t('testimonialNikolaiQuote') ||
        'Благодарен отцу Олегу за мудрые советы и духовное руководство. Община у нас очень дружная и отзывчивая.',
      altText: `${t('testimonialNikolaiName') || 'Николай'} - ${t('testimonialNikolaiRole') || 'Прихожанин'}`,
    },
    {
      image: '/images/peaple3.png',
      name: t('testimonialElenaName') || 'Елена',
      role: t('testimonialElenaRole') || 'Учитель воскресной школы',
      quote:
        t('testimonialElenaQuote') ||
        'Работа с детьми в воскресной школе - это большая радость. Матушка Алла создала замечательную программу обучения.',
      altText: `${t('testimonialElenaName') || 'Елена'} - ${t('testimonialElenaRole') || 'Учитель воскресной школы'}`,
    },
  ];

  return (
    <section className="flex justify-center py-16 bg-white">
      <div className="px-4 max-w-screen-xl">
        <h2 className="mb-12 text-3xl text-center text-slate-800">
          {t('testimonialsTitle') || 'Отзывы прихожан'}
        </h2>
        <div className="flex gap-8 max-md:flex-col">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              image={testimonial.image}
              name={testimonial.name}
              role={testimonial.role}
              quote={testimonial.quote}
              altText={testimonial.altText}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;