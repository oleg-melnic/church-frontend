import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import api from "../axiosConfig"; // Используем новый файл
import Link from "next/link";

const DEFAULT_IMAGE = "/images/default-news-image-ru.png";

const RecentNews: React.FC = () => {
  const t = useTranslations('RecentNews');
  const locale = useLocale();
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/api/news`, {
          params: { locale },
        });
        setNews(response.data.news);
      } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [locale]);

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold text-center mb-6">{t('title')}</h2>
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="p-4 bg-white shadow-md rounded-lg">
              <img src={item.image || DEFAULT_IMAGE} alt={item.title} className="w-full h-48 object-cover rounded-t-lg" />
              <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
              <Link href={`/news/${item.id}`} className="text-amber-700 hover:underline mt-2 inline-block">
                {t('readMore')}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">{t('noNews')}</p>
      )}
    </section>
  );
};

export default RecentNews;