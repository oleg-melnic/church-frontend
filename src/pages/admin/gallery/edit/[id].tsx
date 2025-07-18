"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import api from "../../../../axiosConfig";
import Link from "next/link";

interface Album {
  id: number;
  name: string;
  images: Image[];
  translations: { locale: string; title: string }[];
  createdAt: string;
  updatedAt: string;
}

interface Image {
  id: number;
  url: string;
  caption: string;
  type: 'photo' | 'video';
  translations: { locale: string; caption: string }[];
  createdAt: string;
  updatedAt: string;
}

interface FileWithPreview {
  file: File;
  caption: string;
  translations: { locale: string; caption: string }[];
  type: 'photo' | 'video';
  preview: string;
  progress: number;
}

const EditAlbum: React.FC = () => {
  const t = useTranslations("AdminGalleryEdit");
  const router = useRouter();
  const { id } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [albumName, setAlbumName] = useState("");
  const [translations, setTranslations] = useState({
    ru: { title: "" },
    ro: { title: "" },
  });
  const [newImages, setNewImages] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageIdToDelete, setImageIdToDelete] = useState<number | null>(null);

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

  useEffect(() => {
    if (!isCheckingAuth && id) {
      const fetchAlbum = async () => {
        try {
          const response = await api.get(`/api/gallery/albums/${id}`);
          const albumData = response.data;
          setAlbum(albumData);
          setAlbumName(albumData.name);

          const ruTranslation = albumData.translations.find((trans: { locale: string }) => trans.locale === 'ru');
          const roTranslation = albumData.translations.find((trans: { locale: string }) => trans.locale === 'ro');

          setTranslations({
            ru: { title: ruTranslation?.title || "" },
            ro: { title: roTranslation?.title || "" },
          });
        } catch (err: any) {
          console.error("Ошибка загрузки альбома:", err.response?.data || err.message);
          setError(t("errorLoadingAlbum"));
        } finally {
          setIsLoading(false);
        }
      };

      fetchAlbum();
    }
  }, [isCheckingAuth, id, t]);

  const handleAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumName(e.target.value);
  };

  const handleTranslationChange = (locale: 'ru' | 'ro', field: 'title', value: string) => {
    setTranslations(prev => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        file,
        caption: "",
        translations: [
          { locale: 'ru', caption: "" },
          { locale: 'ro', caption: "" },
        ],
        type: file.type.startsWith('image') ? 'photo' : 'video',
        preview: URL.createObjectURL(file),
        progress: 0,
      }));
      setNewImages(prev => [...prev, ...newFiles]);
    }
  };

  const handleCaptionChange = (index: number, value: string) => {
    setNewImages(prev => {
      const updated = [...prev];
      updated[index].caption = value;
      return updated;
    });
  };

  const handleImageTranslationChange = (index: number, locale: 'ru' | 'ro', value: string) => {
    setNewImages(prev => {
      const updated = [...prev];
      const img = updated[index];
      const transIndex = img.translations.findIndex(trans => trans.locale === locale);
      if (transIndex !== -1) {
        img.translations[transIndex].caption = value;
      } else {
        img.translations.push({ locale, caption: value });
      }
      return updated;
    });
  };

  const handleRemoveFile = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateAlbum = async (e: React.FormEvent) => {
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

      const response = await api.patch(`/api/gallery/albums/${id}`, {
        name: albumName,
        translations: translationArray,
      });
      setAlbum(response.data);
      router.push("/admin/gallery");
    } catch (err: any) {
      console.error("Ошибка при обновлении альбома:", err.response?.data || err.message);
      setError(t("errorUpdatingAlbum"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newImages.length === 0) {
      setError(t("errorNoFilesSelected"));
      return;
    }
    setError(null);
    setIsUploading(true);
  
    try {
      const formData = new FormData();
      newImages.forEach(img => formData.append('files', img.file));
  
      const uploadResponse = await api.post('/api/gallery/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
          setNewImages(prev => prev.map(img => ({ ...img, progress: percentCompleted })));
        },
      });
  
      const uploadedFiles = uploadResponse.data;
  
      const newImagesData = await Promise.all(uploadedFiles.map(async (file: { url: string; type: 'photo' | 'video' }, index: number) => {
        const caption = newImages[index].caption.trim() || newImages[index].file.name;
        const translations = newImages[index].translations
          .filter(trans => trans.caption.trim())
          .map(trans => ({
            locale: trans.locale,
            caption: trans.caption.trim(),
          }));
  
        const response = await api.post(`/api/gallery/images`, {
          albumId: parseInt(id as string, 10),
          url: file.url,
          caption,
          type: file.type,
          translations,
        });
  
        const updatedImage = {
          ...response.data,
          url: file.url.startsWith('http') ? file.url : `http://localhost:3003${file.url}`,
        };
        console.log('Updated image URL:', updatedImage.url); // Добавляем отладку
  
        return updatedImage;
      }));
  
      setAlbum((prev) => prev ? { ...prev, images: [...prev.images, ...newImagesData] } : null);
      setNewImages([]);
    } catch (err: any) {
      console.error("Ошибка при добавлении изображений:", err.response?.data || err.message);
      setError(t("errorAddingImages"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await api.delete(`/api/gallery/images/${imageId}`);
      setAlbum((prev) => prev ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) } : null);
      setShowDeleteModal(false);
      setImageIdToDelete(null);
    } catch (err: any) {
      console.error('Ошибка удаления изображения:', err.response?.data || err.message);
      setError(t("errorDeletingImage"));
    }
  };

  const confirmDeleteImage = (imageId: number) => {
    setImageIdToDelete(imageId);
    setShowDeleteModal(true);
  };

  const cancelDeleteImage = () => {
    setShowDeleteModal(false);
    setImageIdToDelete(null);
  };

  if (isCheckingAuth || isLoading) {
    return <div className="text-center py-16">{t("loading")}</div>;
  }

  if (!album) {
    return <div className="text-center py-16">{t("notFound")}</div>;
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
        <form onSubmit={handleUpdateAlbum} className="flex flex-col gap-6 mb-12">
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
            {isLoading ? t("submitting") : t("updateAlbumButton")}
          </button>
        </form>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          {t("imagesTitle")}
        </h3>
        <form onSubmit={handleAddImages} className="flex flex-col gap-4 mb-8">
          <div>
            <label htmlFor="imageFiles" className="block text-sm font-medium text-gray-700">
              {t("imageFilesLabel")}
            </label>
            <input
              type="file"
              id="imageFiles"
              accept="image/*,video/*"
              multiple
              onChange={handleFilesChange}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            {newImages.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {newImages.map((img, index) => (
                  <div key={index} className="relative">
                    {img.type === 'photo' ? (
                      <img src={img.preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    ) : (
                      <video src={img.preview} className="w-full h-48 object-cover rounded-lg" controls />
                    )}
                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) => handleCaptionChange(index, e.target.value)}
                      placeholder={t("captionPlaceholder")}
                      className="mt-2 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
                    />
                    <div className="mt-2">
                      <label htmlFor={`captionRu-${index}`} className="block text-sm font-medium text-gray-700">
                        {t("captionRuLabel")}
                      </label>
                      <input
                        type="text"
                        id={`captionRu-${index}`}
                        value={img.translations.find(trans => trans.locale === 'ru')?.caption || ""}
                        onChange={(e) => handleImageTranslationChange(index, 'ru', e.target.value)}
                        placeholder={t("captionRuPlaceholder")}
                        className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
                      />
                    </div>
                    <div className="mt-2">
                      <label htmlFor={`captionRo-${index}`} className="block text-sm font-medium text-gray-700">
                        {t("captionRoLabel")}
                      </label>
                      <input
                        type="text"
                        id={`captionRo-${index}`}
                        value={img.translations.find(trans => trans.locale === 'ro')?.caption || ""}
                        onChange={(e) => handleImageTranslationChange(index, 'ro', e.target.value)}
                        placeholder={t("captionRoPlaceholder")}
                        className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
                      />
                    </div>
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-amber-700 h-2.5 rounded-full"
                          style={{ width: `${img.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-center mt-1">{img.progress}%</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      {t("removeButton")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50"
          >
            {isUploading ? t("uploading") : t("addImagesButton")}
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {album.images.length === 0 ? (
            <p className="text-center text-gray-600">{t("noImages")}</p>
          ) : (
            album.images.map((image) => (
              <div key={image.id} className="relative">
                {image.type === 'photo' ? (
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <video
                    src={image.url}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    muted
                    loop
                    autoPlay
                  />
                )}
                <p className="mt-2 text-sm text-gray-600">{image.caption}</p>
                <button
                  onClick={() => confirmDeleteImage(image.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  {t("deleteButton")}
                </button>
              </div>
            ))
          )}
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                {t("confirmDeleteImageTitle")}
              </h3>
              <p className="mb-6">
                {t("confirmDeleteImageMessage")}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDeleteImage(imageIdToDelete!)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  {t("deleteButton")}
                </button>
                <button
                  onClick={cancelDeleteImage}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  {t("cancelButton")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EditAlbum;

export async function getServerSideProps({ locale }: { locale: string }) {
  console.log('getServerSideProps locale:', locale);

  let messages;
  try {
    if (locale === 'ru') {
      messages = (await import('../../../../../messages/ru.json')).default;
    } else if (locale === 'ro') {
      messages = (await import('../../../../../messages/ro.json')).default;
    } else {
      messages = (await import('../../../../../messages/ru.json')).default;
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
