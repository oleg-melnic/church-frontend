"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import api from '../../../axiosConfig';
import Link from "next/link";

interface Schedule {
  id: number;
  date: string;
  time: string;
  event: string;
}

const ScheduleAdmin: React.FC = () => {
  const t = useTranslations("AdminSchedule");
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleIdToDelete, setScheduleIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    if (!token || token === "undefined") {
      router.push("/admin/login");
      return;
    }

    const fetchSchedules = async () => {
      try {
        const response = await api.get("/api/schedule");
        setSchedules(response.data);
      } catch (err: any) {
        console.error('Ошибка загрузки расписания:', err.response?.data || err.message);
        setError(t("errorLoadingSchedules"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [router, t]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/schedule/${id}`);
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
      setShowDeleteModal(false);
      setScheduleIdToDelete(null);
    } catch (err: any) {
      console.error('Ошибка удаления записи:', err.response?.data || err.message);
      setError(t("errorDeletingSchedule"));
    }
  };

  const confirmDelete = (id: number) => {
    setScheduleIdToDelete(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setScheduleIdToDelete(null);
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
            href="/admin/schedule/create"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            {t("addScheduleButton")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {schedules.length === 0 ? (
            <p className="text-center text-gray-600">
              {t("noSchedules")}
            </p>
          ) : (
            schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="p-6 bg-white rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{schedule.event}</h3>
                  <p className="text-base text-gray-600">{schedule.date} в {schedule.time}</p>
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/admin/schedule/edit/${schedule.id}`}
                    className="text-amber-700 hover:underline"
                  >
                    {t("editButton")}
                  </Link>
                  <button
                    onClick={() => confirmDelete(schedule.id)}
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
                onClick={() => handleDelete(scheduleIdToDelete!)}
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

export default ScheduleAdmin;

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