"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import api from "../../../../axiosConfig";
import Link from "next/link";

interface Schedule {
  id: number;
  date: string;
  time: string;
  event: string;
  translations: { locale: string; event: string }[];
}

const EditSchedule: React.FC = () => {
  const t = useTranslations("AdminScheduleEdit");
  const router = useRouter();
  const { id } = useParams();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [event, setEvent] = useState("");
  const [translations, setTranslations] = useState({
    ru: { event: "" },
    ro: { event: "" },
  });
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (!isCheckingAuth && id) {
      const fetchSchedule = async () => {
        try {
          const response = await api.get(`/api/schedule/${id}`);
          const scheduleData = response.data;
          setSchedule(scheduleData);
          setDate(scheduleData.date);
          setTime(scheduleData.time);
          setEvent(scheduleData.event);

          const ruTranslation = scheduleData.translations.find((trans: { locale: string }) => trans.locale === 'ru');
          const roTranslation = scheduleData.translations.find((trans: { locale: string }) => trans.locale === 'ro');

          setTranslations({
            ru: { event: ruTranslation?.event || "" },
            ro: { event: roTranslation?.event || "" },
          });
        } catch (err: any) {
          console.error('Ошибка загрузки записи:', err.response?.data || err.message);
          setError(t("errorLoadingSchedule"));
        } finally {
          setIsLoading(false);
        }
      };

      fetchSchedule();
    }
  }, [isCheckingAuth, id, t]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvent(e.target.value);
  };

  const handleTranslationChange = (locale: 'ru' | 'ro', field: 'event', value: string) => {
    setTranslations(prev => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  };

  const handleUpdateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !event.trim()) {
      setError(t("errorRequiredFields"));
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const translationArray = [
        { locale: 'ru', event: translations.ru.event },
        { locale: 'ro', event: translations.ro.event },
      ].filter(trans => trans.event.trim());

      const response = await api.patch(`/api/schedule/${id}`, {
        date,
        time,
        event,
        translations: translationArray,
      });
      setSchedule(response.data);
      router.push("/admin/schedule");
    } catch (err: any) {
      console.error("Ошибка при обновлении записи:", err.response?.data || err.message);
      setError(t("errorUpdatingSchedule"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth || isLoading) {
    return <div className="text-center py-16">{t("loading")}</div>;
  }

  if (!schedule) {
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
            href="/admin/schedule"
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            {t("backButton")}
          </Link>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleUpdateSchedule} className="flex flex-col gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              {t("dateLabel")}
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              {t("timeLabel")}
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={handleTimeChange}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>
          <div>
            <label htmlFor="event" className="block text-sm font-medium text-gray-700">
              {t("eventLabel")}
            </label>
            <input
              type="text"
              id="event"
              value={event}
              onChange={handleEventChange}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
              placeholder={t("eventPlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="eventRu" className="block text-sm font-medium text-gray-700">
              {t("eventRuLabel")}
            </label>
            <input
              type="text"
              id="eventRu"
              value={translations.ru.event}
              onChange={(e) => handleTranslationChange('ru', 'event', e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
              placeholder={t("eventRuPlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="eventRo" className="block text-sm font-medium text-gray-700">
              {t("eventRoLabel")}
            </label>
            <input
              type="text"
              id="eventRo"
              value={translations.ro.event}
              onChange={(e) => handleTranslationChange('ro', 'event', e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
              placeholder={t("eventRoPlaceholder")}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50"
          >
            {isLoading ? t("submitting") : t("updateScheduleButton")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditSchedule;

export async function getServerSideProps({ locale }: { locale: string }) {
  console.log('getServerSideProps locale:', locale);

  let messages;
  try {
    if (locale === 'ru') {
      messages = (await import('../../../../../messages/ru.json')).default;
    } else if (locale === 'ro') {
      messages = (await import('../../../../../messages/ro.json')).default;
    } else {
      messages = (await import('../../../../../messages/ro.json')).default;
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
