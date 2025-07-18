"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import api from "../../src/axiosConfig";
import FeaturedNewsCard from "../components/FeaturedNewsCard";

const DEFAULT_IMAGE = "/images/default-news-image-ru.png";

interface News {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  image: string;
  fullText: string;
  isMain: boolean;
  isActive: boolean;
  category?: string;
}

const FeaturedNews: React.FC = () => {
  const t = useTranslations("FeaturedNews");
  const locale = useLocale();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMainNews = async () => {
      try {
        let response = await api.get<{ news: News[]; total: number }>("http://localhost:3003/api/news", {
          params: { locale, isMain: true, limit: 1 },
        });

        let featuredNews = response.data.news[0] || null;

        if (!featuredNews) {
          response = await api.get<{ news: News[]; total: number }>("http://localhost:3003/api/news", {
            params: { locale, limit: 1, sortBy: 'createdAt', sortOrder: 'DESC' },
          });
          featuredNews = response.data.news[0] || null;
        }

        setNews(featuredNews);
        setLoading(false);
      } catch (err: any) {
        setError(t("errorLoadingNews"));
        setLoading(false);
        console.error("Error fetching main news:", err);
      }
    };

    fetchMainNews();
  }, [locale, t]);

  if (loading) {
    return (
      <section className="flex flex-col gap-8 items-center">
        <h2 className="text-4xl text-slate-800 max-md:text-3xl max-sm:text-3xl">{t("title")}</h2>
        <p>{t("loading")}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-8 min-h-screen items-center">
        <h2 className="text-4xl text-slate-800 max-md:text-3xl max-sm:text-3xl">{t("title")}</h2>
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  if (!news) {
    return (
      <section className="flex flex-col gap-8 items-center">
        <h2 className="text-4xl text-slate-800 max-md:text-3xl max-sm:text-3xl">{t("title")}</h2>
        <p>{t("noMainNews")}</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8 items-center">
      <h2 className="text-4xl text-slate-800 max-md:text-3xl max-sm:text-3xl">{t("title")}</h2>
      <div className="flex gap-8 max-md:flex-col">
        <FeaturedNewsCard
          id={news.id} // Передаём id
          imageUrl={news.image || DEFAULT_IMAGE}
          date={news.createdAt}
          category={news.category || t("defaultCategory")}
          title={news.title}
          description={news.description}
        />
      </div>
    </section>
  );
};

export default FeaturedNews;