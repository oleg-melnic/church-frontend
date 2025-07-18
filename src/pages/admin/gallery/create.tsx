"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import api from "../../../axiosConfig";
import Link from "next/link";

const CreateAlbum: React.FC = () => {
  const t = useTranslations("AdminGalleryCreate");
  const router = useRouter();
  const [albumName, setAlbumName] = useState("");
  const [translations, setTranslations] = useState({
    ru: { title: "" },
    ro: { title: "" },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminAccessToken");
      if (!token || token === "undefined") {
        router.push("/admin/login");
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const handleAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumName(e.target.value);
  };

  const handleTranslationChange = (locale: 'ru' | 'ro', field: 'title', value: string) => {
    setTranslations(prev => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumName.trim()) {
      setError(t("errorAlbumNameRequired"));
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const translationArray = [
        { locale: 'ru', title: translations.ru.title },
        { locale: 'ro', title: translations.ro.title },
      ].filter(trans => trans.title.trim());

      await api.post(`/api/gallery/albums`, {
        name: albumName,
        translations: translationArray,
      });
      router.push("/admin/gallery");
    } catch (err: any) {
      console.error("Ошибка при создании альбома:", err.response?.data || err.message);
      setError(t("errorCreatingAlbum"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth || isLoading) {
    return <div className="text-center py-16">{t("loading")}</div>;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {t("title")}
          </h2>
          <Link
            href="/admin/gallery"
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            {t("backButton")}
          </Link>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleCreateAlbum} className="flex flex-col gap-6">
          <div>
            <label htmlFor="albumName" className="block text-sm font-medium text-gray-700">
              {t("albumNameLabel")}
            </label>
            <input
              type="text"
              id="albumName"
              value={albumName}
              onChange={handleAlbumNameChange}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
              placeholder={t("albumNamePlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="titleRu" className="block text-sm font-medium text-gray-700">
              {t("titleRuLabel")}
            </label>
            <input
              type="text"
              id="titleRu"
              value={translations.ru.title}
              onChange={(e) => handleTranslationChange('ru', 'title', e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
              placeholder={t("titleRuPlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="titleRo" className="block text-sm font-medium text-gray-700">
              {t("titleRoLabel")}
            </label>
            <input
              type="text"
              id="titleRo"
              value={translations.ro.title}
              onChange={(e) => handleTranslationChange('ro', 'title', e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
              placeholder={t("titleRoPlaceholder")}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50"
          >
            {isLoading ? t("submitting") : t("createAlbumButton")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateAlbum;

export async function getServerSideProps({ locale }: { locale: string }) {
  console.log('getServerSideProps locale:', locale);

  let messages;
  try {
    if (locale === 'ru') {
      messages = (await import('../../../../messages/ru.json')).default;
    } else if (locale === 'ro') {
      messages = (await import('../../../../messages/ro.json')).default;
    } else {
      messages = (await import('../../../../messages/ru.json')).default;
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