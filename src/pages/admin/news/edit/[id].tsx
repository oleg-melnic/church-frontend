"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import api from "../../../../axiosConfig";
import Link from "next/link";

interface NewsItem {
  id: number;
  image: string;
  isMain: boolean;
  isActive: boolean;
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

const EditNews: React.FC = () => {
  const t = useTranslations("AdminNewsEdit");
  const locale = useLocale();
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState<NewsItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminAccessToken");
      console.log('Проверка токена в edit.tsx:', token);
      if (!token || token === "undefined") {
        console.log('Токен отсутствует или некорректен, перенаправляем на /admin/login');
        router.push("/admin/login");
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isCheckingAuth && id) {
      const fetchNews = async () => {
        try {
          const response = await api.get(`/api/news/${id}`, {
            params: { locale },
          });
          setFormData(response.data);
        } catch (err: any) {
          console.error('Ошибка загрузки новости:', err.response?.data || err.message);
          setError(t("errorLoadingNews") || "Ошибка загрузки новости.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchNews();
    }
  }, [isCheckingAuth, id, locale, t]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    lang: "ru" | "ro",
    field: string
  ) => {
    if (!formData) return;
    const updatedTranslations = formData.translations.map((trans) =>
      trans.locale === lang ? { ...trans, [field]: e.target.value } : trans
    );
    setFormData({ ...formData, translations: updatedTranslations });
  };

  const handleScheduleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    lang: "ru" | "ro"
  ) => {
    if (!formData) return;
    const schedule = e.target.value.split("\n").filter((line) => line.trim() !== "");
    const updatedTranslations = formData.translations.map((trans) =>
      trans.locale === lang ? { ...trans, schedule } : trans
    );
    setFormData({ ...formData, translations: updatedTranslations });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setError(null);
    setIsLoading(true);
  
    try {
      let imageUrl = formData.image;
  
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", imageFile);
  
        const uploadResponse = await api.post("/api/upload", formDataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imageUrl = uploadResponse.data.url;
      }
  
      await api.patch(`/api/news/${id}`, {
        ...formData,
        image: imageUrl,
        updatedAt: new Date().toISOString(),
      });
  
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Ошибка при обновлении новости:", err.response?.data || err.message);
      setError(t("errorUpdatingNews") || "Ошибка при обновлении новости.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth || isLoading) {
    return <div className="text-center py-16">{t("loading") || "Загрузка..."}</div>;
  }

  if (!formData) {
    return <div className="text-center py-16">{t("notFound") || "Новость не найдена."}</div>;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {t("title") || "Редактировать новость"}
          </h2>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            {t("backButton") || "Назад"}
          </Link>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Поле для загрузки изображения */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              {t("imageLabel") || "Изображение"}
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
            {formData.image && (
              <p className="mt-2 text-sm text-gray-600">
                Текущее изображение: <a href={formData.image} target="_blank" className="text-amber-700">{formData.image}</a>
              </p>
            )}
          </div>
          <div className="flex gap-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isMain}
                  onChange={(e) => setFormData({ ...formData, isMain: e.target.checked })}
                  className="mr-2"
                />
                {t("isMainLabel") || "Главная новость"}
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                {t("isActiveLabel") || "Активна"}
              </label>
            </div>
          </div>

          {/* Поля для русского языка */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t("russianSection") || "Русский язык"}
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="title-ru" className="block text-sm font-medium text-gray-700">
                  {t("titleLabel") || "Заголовок"}
                </label>
                <input
                  type="text"
                  id="title-ru"
                  value={formData.translations.find((t) => t.locale === "ru")?.title || ""}
                  onChange={(e) => handleInputChange(e, "ru", "title")}
                  required
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
                  placeholder={t("titlePlaceholder") || "Введите заголовок"}
                />
              </div>
              <div>
                <label htmlFor="description-ru" className="block text-sm font-medium text-gray-700">
                  {t("descriptionLabel") || "Описание"}
                </label>
                <textarea
                  id="description-ru"
                  value={formData.translations.find((t) => t.locale === "ru")?.description || ""}
                  onChange={(e) => handleInputChange(e, "ru", "description")}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  placeholder={t("descriptionPlaceholder") || "Введите описание"}
                />
              </div>
              <div>
                <label htmlFor="fullText-ru" className="block text-sm font-medium text-gray-700">
                  {t("fullTextLabel") || "Полный текст"}
                </label>
                <textarea
                  id="fullText-ru"
                  value={formData.translations.find((t) => t.locale === "ru")?.fullText || ""}
                  onChange={(e) => handleInputChange(e, "ru", "fullText")}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full h-32 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  placeholder={t("fullTextPlaceholder") || "Введите полный текст"}
                />
              </div>
              <div>
                <label htmlFor="category-ru" className="block text-sm font-medium text-gray-700">
                  {t("categoryLabel") || "Категория"}
                </label>
                <input
                  type="text"
                  id="category-ru"
                  value={formData.translations.find((t) => t.locale === "ru")?.category || ""}
                  onChange={(e) => handleInputChange(e, "ru", "category")}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
                  placeholder={t("categoryPlaceholder") || "Введите категорию"}
                />
              </div>
              <div>
                <label htmlFor="schedule-ru" className="block text-sm font-medium text-gray-700">
                  {t("scheduleLabel") || "Расписание (каждая строка — отдельный пункт)"}
                </label>
                <textarea
                  id="schedule-ru"
                  value={formData.translations.find((t) => t.locale === "ru")?.schedule.join("\n") || ""}
                  onChange={(e) => handleScheduleChange(e, "ru")}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  placeholder={t("schedulePlaceholder") || "Введите расписание"}
                />
              </div>
              <div>
                <label htmlFor="date-ru" className="block text-sm font-medium text-gray-700">
                  {t("dateLabel") || "Дата"}
                </label>
                <input
                  type="date"
                  id="date-ru"
                  value={formData.translations.find((t) => t.locale === "ru")?.date || ""}
                  onChange={(e) => handleInputChange(e, "ru", "date")}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>
            </div>
          </div>

          {/* Поля для румынского языка */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t("romanianSection") || "Румынский язык"}
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="title-ro" className="block text-sm font-medium text-gray-700">
                  {t("titleLabel") || "Заголовок"}
                </label>
                <input
                  type="text"
                  id="title-ro"
                  value={formData.translations.find((t) => t.locale === "ro")?.title || ""}
                  onChange={(e) => handleInputChange(e, "ro", "title")}
                  required
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
                  placeholder={t("titlePlaceholder") || "Введите заголовок"}
                />
              </div>
              <div>
                <label htmlFor="description-ro" className="block text-sm font-medium text-gray-700">
                  {t("descriptionLabel") || "Описание"}
                </label>
                <textarea
                  id="description-ro"
                  value={formData.translations.find((t) => t.locale === "ro")?.description || ""}
                  onChange={(e) => handleInputChange(e, "ro", "description")}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  placeholder={t("descriptionPlaceholder") || "Введите описание"}
                />
              </div>
              <div>
                <label htmlFor="fullText-ro" className="block text-sm font-medium text-gray-700">
                  {t("fullTextLabel") || "Полный текст"}
                </label>
                <textarea
                  id="fullText-ro"
                  value={formData.translations.find((t) => t.locale === "ro")?.fullText || ""}
                  onChange={(e) => handleInputChange(e, "ro", "fullText")}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full h-32 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  placeholder={t("fullTextPlaceholder") || "Введите полный текст"}
                />
              </div>
              <div>
                <label htmlFor="category-ro" className="block text-sm font-medium text-gray-700">
                  {t("categoryLabel") || "Категория"}
                </label>
                <input
                  type="text"
                  id="category-ro"
                  value={formData.translations.find((t) => t.locale === "ro")?.category || ""}
                  onChange={(e) => handleInputChange(e, "ro", "category")}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
                  placeholder={t("categoryPlaceholder") || "Введите категорию"}
                />
              </div>
              <div>
                <label htmlFor="schedule-ro" className="block text-sm font-medium text-gray-700">
                  {t("scheduleLabel") || "Расписание (каждая строка — отдельный пункт)"}
                </label>
                <textarea
                  id="schedule-ro"
                  value={formData.translations.find((t) => t.locale === "ro")?.schedule.join("\n") || ""}
                  onChange={(e) => handleScheduleChange(e, "ro")}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  placeholder={t("schedulePlaceholder") || "Введите расписание"}
                />
              </div>
              <div>
                <label htmlFor="date-ro" className="block text-sm font-medium text-gray-700">
                  {t("dateLabel") || "Дата"}
                </label>
                <input
                  type="date"
                  id="date-ro"
                  value={formData.translations.find((t) => t.locale === "ro")?.date || ""}
                  onChange={(e) => handleInputChange(e, "ro", "date")}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>
            </div>
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50"
          >
            {isLoading ? t("submitting") || "Обновление..." : t("submitButton") || "Обновить новость"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditNews;

// Заменяем getStaticProps на getServerSideProps
export async function getServerSideProps({ locale }: { locale: string }) {
  console.log('getServerSideProps locale:', locale);

  let messages;
  if (locale === 'ru') {
    messages = (await import('../../../../../messages/ru.json')).default;
  } else if (locale === 'ro') {
    messages = (await import('../../../../../messages/ro.json')).default;
  } else {
    messages = (await import('../../../../../messages/ru.json')).default;
  }

  return {
    props: {
      messages,
      locale: locale || 'ru',
    },
  };
}
