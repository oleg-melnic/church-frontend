"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Head from "next/head";
import { FaFacebookF, FaTwitter, FaVk } from "react-icons/fa";
import DOMPurify from "dompurify";
import api from "../../axiosConfig";

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
  schedule?: string[];
}

const NewsDetail: React.FC = () => {
  const t = useTranslations("NewsDetail");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const { id } = router.query;
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      try {
        const response = await api.get<News>(`http://localhost:3003/api/news/${id}`);
        setNews(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(t("errorLoadingNews"));
        setLoading(false);
        console.error("Error fetching news:", err);
      }
    };

    fetchNews();
  }, [id, t]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = news ? news.title : '';

  if (loading) {
    return <p className="text-center text-gray-600">{t("loading")}</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!news) {
    return <p className="text-center text-gray-600">{t("notFound")}</p>;
  }

  return (
    <>
      <Head>
        <title>{news.title} | {tCommon("siteTitle")}</title>
        <meta name="description" content={news.description} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.description} />
        <meta property="og:image" content={news.image} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
      </Head>
      <main className="flex flex-col gap-12 px-20 py-32 max-md:px-10 max-sm:px-5">
        <Link href="/news" className="text-amber-700 hover:text-amber-800 text-sm mb-6 inline-block">
          ← {t("backToNews")}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{news.title}</h1>

        <p className="text-gray-600 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          {news.createdAt}
        </p>

        <img src={news.image} alt={news.title} className="w-full h-96 object-cover rounded-lg mb-8" />

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="leading-relaxed mb-6">{news.description}</p>

          {news.schedule && news.schedule.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("scheduleTitle")}</h2>
              <ul className="schedule mb-6">
                {news.schedule.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </>
          )}

          <div
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.fullText) }}
          />

          <blockquote className="border-l-4 border-amber-700 pl-4 italic text-gray-600 my-6">
            {t("quote")}
          </blockquote>
        </div>

        <div className="flex items-center gap-3 mt-8">
          <span className="text-gray-700">{t("shareLabel")}</span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-800"
            aria-label="Share on Facebook"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700"
            aria-label="Share on Twitter"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href={`https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700"
            aria-label="Share on VK"
          >
            <FaVk size={20} />
          </a>
        </div>
      </main>
    </>
  );
};

export default NewsDetail;

// Добавляем getServerSideProps для загрузки переводов
export async function getServerSideProps({ locale }: { locale: string }) {
  console.log('getServerSideProps locale:', locale);

  let messages;
  try {
    if (locale === 'ru') {
      messages = (await import('../../../messages/ru.json')).default;
    } else if (locale === 'ro') {
      messages = (await import('../../../messages/ro.json')).default;
    } else {
      messages = (await import('../../../messages/ru.json')).default;
    }
  } catch (error) {
    console.error('Ошибка загрузки переводов:', error);
    messages = {};
  }

  return {
    props: {
      messages,
      locale: locale || 'ru',
    },
  };
}
