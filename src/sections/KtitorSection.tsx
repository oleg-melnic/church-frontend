"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { motion, easeOut } from 'framer-motion'; // Импортируем easeOut

interface Ktitor {
  id: number;
  name: string;
  contribution: string;
  createdAt: string;
}

const KtitorSection: React.FC = () => {
  const t = useTranslations('KtitorSection');
  const [ktitors, setKtitors] = useState<Ktitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchKtitors = async () => {
      try {
        const response = await axios.get<Ktitor[]>('http://localhost:3003/api/ktitors', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        });
        setKtitors(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(t('errorLoadingKtitors'));
        setLoading(false);
      }
    };

    fetchKtitors();
  }, [t]);

  useEffect(() => {
    if (formSuccess) {
      const timer = setTimeout(() => {
        setFormSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError(t('formErrorName'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError(t('formErrorEmail'));
      return;
    }
    if (!formData.phone.trim()) {
      setFormError(t('formErrorPhone'));
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      await axios.post('http://localhost:3003/api/ktitors', {
        name: formData.name,
        contribution: t('ktitorApplication'),
      }, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });

      await axios.post('http://localhost:3003/api/email/send', {
        to: 'oleg.melnic@gmail.com',
        subject: t('emailSubject', { name: formData.name }),
        text: t('emailBody', { name: formData.name, email: formData.email, phone: formData.phone }),
      }, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });

      setFormSuccess(t('formSuccess'));
      setFormData({ name: '', email: '', phone: '' });
    } catch (err: any) {
      setFormError(t('formErrorSubmit'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }, // Используем easeOut как функцию
  };

  return (
    <motion.section
      className="p-8 bg-white rounded-lg shadow-sm border border-gray-200"
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <motion.h2
        className="mb-6 text-2xl font-semibold text-gray-800"
        variants={variants}
      >
        {t('title')}
      </motion.h2>
      <motion.div
        className="flex gap-8 max-md:flex-col"
        variants={variants}
      >
        <div className="flex-1">
          <p className="mb-8 text-base text-gray-600">
            {t('description')}
          </p>
          <ul className="flex flex-col gap-2">
            <li className="text-base text-gray-600">{t('benefit1')}</li>
            <li className="text-base text-gray-600">{t('benefit2')}</li>
            <li className="text-base text-gray-600">{t('benefit3')}</li>
            <li className="text-base text-gray-600">{t('benefit4')}</li>
          </ul>
        </div>
        <div className="flex-1 p-6 bg-amber-50 rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-amber-800">{t('formTitle')}</h3>
          <p className="mb-6 text-base text-gray-600">
            {t('formDescription')}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('formNamePlaceholder')}
              className="px-3 py-2 w-full text-base bg-white rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('formEmailPlaceholder')}
              className="px-3 py-2 w-full text-base bg-white rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t('formPhonePlaceholder')}
              className="px-3 py-2 w-full text-base bg-white rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 w-full text-base text-white bg-amber-700 rounded-lg hover:bg-amber-800 disabled:opacity-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('formSubmitting')}
                </span>
              ) : (
                t('formSubmit')
              )}
            </motion.button>
            {formError && <p className="mt-4 text-red-500 text-center">{formError}</p>}
            {formSuccess && <p className="mt-4 text-green-500 text-center">{formSuccess}</p>}
          </form>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default KtitorSection;