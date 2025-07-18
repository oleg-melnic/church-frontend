"use client";

import React, { useState } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Правильный импорт для App Router
import { useTranslations } from 'next-intl';

const ContactForm: React.FC = () => {
  const t = useTranslations('Contact');
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('invalidEmail') || 'Пожалуйста, введите корректный email.');
      return;
    }
    setIsSending(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post('http://localhost:3003/api/email/send', {
        to: 'oleg.melnic@gmail.com',
        subject: t('emailSubject', { name }) || `Сообщение с сайта от ${name}`,
        text: t('emailBody', { name, email, message }) || `Имя: ${name}\nEmail: ${email}\nСообщение: ${message}`,
      }, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      setSuccess(t('success') || 'Сообщение успешно отправлено! Мы свяжемся с вами скоро.');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => {
        // Редирект с учётом текущей локали
        router.push('/contact');
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`${t('error') || 'Ошибка отправки сообщения: '} ${errorMessage}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {t('title') || 'Связаться с нами'}
        </h2>
        <form onSubmit={handleSubmit} className="contact-form flex flex-col gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {t('nameLabel') || 'Имя'}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
              placeholder={t('namePlaceholder') || 'Ваше имя'}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('emailLabel') || 'Email'}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
              placeholder={t('emailPlaceholder') || 'Ваш email'}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              {t('messageLabel') || 'Сообщение'}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full h-32 focus:outline-none focus:ring-2 focus:ring-amber-700"
              placeholder={t('messagePlaceholder') || 'Ваше сообщение'}
            />
          </div>
          <button
            type="submit"
            disabled={isSending}
            className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50"
          >
            {isSending ? t('sending') || 'Отправка...' : t('submit') || 'Отправить'}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
        </form>
      </div>
    </section>
  );
};

export default ContactForm;