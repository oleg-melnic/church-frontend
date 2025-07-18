"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // Import next/image for optimization
import { useTranslations } from 'next-intl';

interface NewsCardProps {
  id?: number;
  imageUrl: string;
  date: string;
  category: string;
  title: string;
  description: string;
  isCompact?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  imageUrl,
  date,
  category,
  title,
  description,
  isCompact = false,
}) => {
  const t = useTranslations('NewsCard');

  if (isCompact) {
    return (
      <article className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex gap-2 items-center">
          <time className="text-sm text-amber-700">{date}</time>
          <span className="text-base text-black">•</span>
          <span className="text-sm text-gray-600">{category}</span>
        </div>
        <h3 className="mt-3 text-lg text-black">{title}</h3>
        <p className="mt-3 text-base text-gray-600">{description}</p>
      </article>
    );
  }

  return (
    <article className="overflow-hidden bg-white rounded-lg shadow-md">
      <Image
        src={imageUrl}
        alt={t('imageAlt', { title }) || `Новость: ${title}`}
        width={400} // Adjust based on actual image dimensions
        height={200} // Matches the current height (h-[200px])
        className="w-full h-[200px] object-cover"
      />
      <div className="p-4">
        <div className="flex gap-2 items-center">
          <time className="text-sm text-amber-700">{date}</time>
          <span className="text-base text-black">•</span>
          <span className="text-sm text-gray-600">{category}</span>
        </div>
        <h3 className="mt-4 text-lg text-black">{title}</h3>
        <p className="mt-4 text-base text-gray-600">{description}</p>
        {id && (
          <Link
            href={`/news/${id}`}
            className="mt-4 text-base text-amber-700 cursor-pointer inline-block"
          >
            {t('readMore') || 'Подробнее →'}
          </Link>
        )}
      </div>
    </article>
  );
};

export default NewsCard;