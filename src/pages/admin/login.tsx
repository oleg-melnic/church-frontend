"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import api from '../../axiosConfig';

const AdminLogin: React.FC = () => {
  const t = useTranslations("AdminLogin");
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Starting handleSubmit at 11:10 AM EEST, May 27, 2025');

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/api/auth/login', {
        username,
        password,
      });
      console.log('Полный ответ от /api/auth/login:', response); // Логируем полный ответ
      const { accessToken, refreshToken } = response.data;
      console.log('Полученные токены:', { accessToken, refreshToken });
      if (!accessToken || !refreshToken) {
        throw new Error('Токены отсутствуют в ответе сервера');
      }
      try {
        localStorage.setItem("adminAccessToken", accessToken);
        localStorage.setItem("adminRefreshToken", refreshToken);
        console.log('Токены сохранены в localStorage:', {
          accessToken: localStorage.getItem("adminAccessToken"),
          refreshToken: localStorage.getItem("adminRefreshToken"),
        });
      } catch (err) {
        console.error('Ошибка сохранения токенов в localStorage:', err);
      }
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error('Ошибка входа:', err.response?.data || err.message);
      setError(t("errorMessage") || "Ошибка входа. Проверьте логин и пароль.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {t("title") || "Вход в админ-панель"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              {t("usernameLabel") || "Имя пользователя"}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
              placeholder={t("usernamePlaceholder") || "Введите имя пользователя"}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t("passwordLabel") || "Пароль"}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
              placeholder={t("passwordPlaceholder") || "Введите пароль"}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50"
          >
            {isSubmitting ? t("submitting") || "Вход..." : t("submitButton") || "Войти"}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;

export async function getStaticProps({ locale }: { locale: string }) {
  console.log('getStaticProps locale:', locale);

  let messages;
  if (locale === 'ru') {
    messages = (await import('../../../messages/ru.json')).default;
  } else if (locale === 'ro') {
    messages = (await import('../../../messages/ro.json')).default;
  } else {
    messages = (await import('../../../messages/ru.json')).default;
  }

  const props = {
    props: {
      messages,
      locale: locale || 'ru',
    },
  };
  console.log('getStaticProps props:', props);
  return props;
}