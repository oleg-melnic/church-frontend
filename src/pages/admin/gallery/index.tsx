"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import api from '../../../axiosConfig';
import Link from "next/link";

interface Album {
  id: number;
  name: string;
  images: { id: number; url: string; caption: string; type: string }[];
  createdAt: string;
  updatedAt: string;
}

const GalleryAdmin: React.FC = () => {
  const t = useTranslations("AdminGallery");
  const locale = useLocale();
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [albumIdToDelete, setAlbumIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    if (!token || token === "undefined") {
      router.push("/admin/login");
      return;
    }

    const fetchAlbums = async () => {
      try {
        const response = await api.get("/api/gallery/albums", {
          params: { locale },
        });
        setAlbums(response.data);
      } catch (err: any) {
        console.error('Ошибка загрузки альбомов:', err.response?.data || err.message);
        setError(t("errorLoadingAlbums"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [router, t, locale]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/gallery/albums/${id}`);
      setAlbums(albums.filter((album) => album.id !== id));
      setShowDeleteModal(false);
      setAlbumIdToDelete(null);
    } catch (err: any) {
      console.error('Ошибка удаления альбома:', err.response?.data || err.message);
      setError(t("errorDeletingAlbum"));
    }
  };

  const confirmDelete = (id: number) => {
    setAlbumIdToDelete(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAlbumIdToDelete(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    router.push("/admin/login");
  };

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
            href="/admin/gallery/create"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            {t("addAlbumButton")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {albums.length === 0 ? (
            <p className="text-center text-gray-600">
              {t("noAlbums")}
            </p>
          ) : (
            albums.map((album) => (
              <div
                key={album.id}
                className="p-6 bg-white rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{album.name}</h3>
                  <p className="text-base text-gray-600">{album.createdAt}</p>
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/admin/gallery/edit/${album.id}`}
                    className="text-amber-700 hover:underline"
                  >
                    {t("editButton")}
                  </Link>
                  <button
                    onClick={() => confirmDelete(album.id)}
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
                onClick={() => handleDelete(albumIdToDelete!)}
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

export default GalleryAdmin;

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
