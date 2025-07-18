import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image'; // Добавьте этот импорт

interface FeaturedNewsCardProps {
  id: number; // Добавляем id
  imageUrl: string;
  date: string;
  category: string;
  title: string;
  description: string;
}

const FeaturedNewsCard: React.FC<FeaturedNewsCardProps> = ({
  id,
  imageUrl,
  date,
  category,
  title,
  description,
}) => {
  const t = useTranslations('NewsCard'); // Используем переводы из NewsCard

  return (
    <div className="flex flex-col w-full max-w-2xl">
      <Link href={`/news/${id}`}>
        <Image
          src={imageUrl}
          alt={t('imageAlt', { title }) || `Новость: ${title}`}
          className="w-full h-64 object-cover rounded-lg mb-4"
          width={800}  // Укажите ширину на основе дизайна (интринсик размер)
          height={400} // Укажите высоту (можно скорректировать)
          priority={true} // Опционально, для быстрой загрузки (если это featured)
        />
      </Link>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 text-sm text-gray-500">
          <span>{date}</span>
          <span>{category}</span>
        </div>
        <Link href={`/news/${id}`}>
          <h3 className="text-2xl font-bold text-slate-800 hover:text-amber-700">{title}</h3>
        </Link>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeaturedNewsCard;