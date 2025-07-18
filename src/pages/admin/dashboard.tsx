"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import api from '../../axiosConfig';
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  translations: Array<{
    locale: string;
    title: string;
    description: string;
    fullText: string;
    category: string;
    schedule: string[];
    date: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const t = useTranslations("AdminDashboard");
  const locale = useLocale();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsIdToDelete, setNewsIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get<{ news: NewsItem[]; total: number }>("/api/news", {
          params: {
            locale,
          },
        });
        console.log('Ответ от /api/news:', response.data);
        setNewsItems(response.data.news || []); // Исправляем: извлекаем news из ответа
      } catch (err: any) {
        console.error('Ошибка загрузки новостей:', err.response?.data || err.message);
        setError(t("errorLoadingNews"));
      } finally {
        setIsLoading(false);
      }
    };

    if (isMounted) {
      const token = localStorage.getItem("adminAccessToken");
      console.log('Проверка токена в dashboard.tsx:', token);
      if (!token || token === "undefined") {
        console.log('Токен отсутствует или некорректен, перенаправляем на /admin/login');
        router.push("/admin/login");
        return;
      }

      fetchNews();
    }
  }, [isMounted, router, t, locale]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/news/${id}`);
      setNewsItems(newsItems.filter((item) => item.id !== id));
      setShowDeleteModal(false);
      setNewsIdToDelete(null);
    } catch (err: any) {
      console.error('Ошибка удаления новости:', err.response?.data || err.message);
      setError(t("errorDeletingNews"));
    }
  };

  const confirmDelete = (id: number) => {
    setNewsIdToDelete(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setNewsIdToDelete(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    router.push("/admin/login");
  };

  if (!isMounted) {
    return <div />;
  }

  if (isLoading) {
    return <div className="text-center py-16">{t("loading")}</div>;
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {t("title")}
          </h2>
          <Link
            href="/admin/dashboard"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            новости
          </Link>
          <Link
            href="/admin/gallery"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            галлерея
          </Link>
          <Link
            href="/admin/schedule"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            расписание
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            {t("logoutButton")}
          </button>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-6 text-center">
          <Link
            href="/admin/news/create"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            {t("addNewsButton")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {newsItems.length === 0 ? (
            <p className="text-center text-gray-600">
              {t("noNews")}
            </p>
          ) : (
            newsItems.map((news) => (
              <div
                key={news.id}
                className="p-6 bg-white rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{news.title}</h3>
                  <p className="text-base text-gray-600">{news.date} • {news.category}</p>
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/admin/news/edit/${news.id}`}
                    className="text-amber-700 hover:underline"
                  >
                    {t("editButton")}
                  </Link>
                  <button
                    onClick={() => confirmDelete(news.id)}
                    className="text-red-500 hover:underline"
                  >
                    {t("deleteButton")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {t("confirmDeleteTitle")}
            </h3>
            <p className="mb-6">
              {t("confirmDeleteMessage")}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(newsIdToDelete!)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                {t("deleteButton")}
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                {t("cancelButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;

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
