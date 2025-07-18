"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

interface DonationFormProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const DonationForm: React.FC<DonationFormProps> = ({ title, description, icon, category }) => {
  const t = useTranslations('Note.donationForm');
  const [namesList, setNamesList] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [type, setType] = useState('simple');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const stripe = useStripe();

  const paymentTypes = t.raw('types') || [
    { value: "simple", label: "Простая (бесплатно)", isPaid: false, amount: 0, perName: 0, maxNames: Infinity },
    { value: "sorokoust", label: "Сорокауст", isPaid: true, perName: 100, maxNames: Infinity },
    { value: "proskomedia", label: "Проскомидия", isPaid: true, perName: 0, amount: 50, maxNames: 10 },
    { value: "proskomedia_40", label: "40 Проскомидий", isPaid: true, perName: 200, maxNames: Infinity },
    { value: "ekteneia", label: "Заказная ектения", isPaid: true, perName: 150, maxNames: Infinity },
  ];

  const exchangeRates = {
    mdlToUsd: 0.056, // 1 MDL = 0.056 USD
    mdlToEur: 0.052, // 1 MDL = 0.052 EUR
  };

  const nameCount = namesList.length;

  const getPaymentInfo = (type: string) => {
    const selectedType = paymentTypes.find((t: { value: string }) => t.value === type);
    if (!selectedType) return { isPaid: false, amount: 0, perName: 0, maxNames: Infinity, amountUsd: 0, amountEur: 0 };

    let amount = selectedType.amount || 0;
    if (selectedType.perName) {
      amount = nameCount * selectedType.perName;
    }

    const amountUsd = parseFloat((amount * exchangeRates.mdlToUsd).toFixed(2));
    const amountEur = parseFloat((amount * exchangeRates.mdlToEur).toFixed(2));

    return {
      isPaid: selectedType.isPaid,
      amount,
      perName: selectedType.perName || 0,
      maxNames: selectedType.maxNames,
      amountUsd,
      amountEur,
    };
  };

  const paymentInfo = getPaymentInfo(type);

  const handleAddName = () => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      setError(t('nameRequiredError') || 'Пожалуйста, введите имя.');
      return;
    }

    if (!/^[a-zA-Zа-яА-Я\s-]+$/i.test(trimmedName)) {
      setError(t('nameInvalidError') || 'Имя должно содержать только буквы, пробелы или дефисы.');
      return;
    }

    if (type === 'proskomedia' && nameCount >= paymentInfo.maxNames) {
      setError(t('maxNamesError', { max: paymentInfo.maxNames }) || `Максимум ${paymentInfo.maxNames} имён для проскомидии.`);
      return;
    }

    setNamesList([...namesList, trimmedName]);
    setNewName('');
    setError(null);
  };

  const handleRemoveName = (index: number) => {
    setNamesList(namesList.filter((_, i) => i !== index));
    setError(null);
  };

  const handleNewNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Starting handleSubmit at 10:16 PM EEST, June 06, 2025');

    if (namesList.length === 0) {
      console.log('Validation failed: no names provided');
      setError(t('namesRequiredError') || 'Пожалуйста, добавьте хотя бы одно имя.');
      return;
    }
    console.log('Names validation passed:', namesList);

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const normalizedNames = namesList.join(' ').trim();
    console.log('Normalized names:', normalizedNames);

    try {
      if (paymentInfo.isPaid) {
        console.log('Creating note at 10:16 PM EEST, June 06, 2025:', { type, names: normalizedNames, isPaid: paymentInfo.isPaid, amount: paymentInfo.amount });
        await axios.post('http://localhost:3003/api/notes', {
          type,
          names: normalizedNames,
          isPaid: paymentInfo.isPaid,
          amount: paymentInfo.amount,
          status: 'pending',
        });
        console.log('Note created successfully');

        console.log('Creating checkout session at 10:16 PM EEST, June 06, 2025');
        const { data } = await axios.post('http://localhost:3003/api/notes/create-checkout-session', {
          amount: paymentInfo.amount * 100,
          type,
          names: normalizedNames,
        });
        console.log('Checkout session created:', data.sessionId);

        const result = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result?.error) {
          console.log('Stripe redirect error:', result.error.message);
          setError(t('stripeRedirectError') || 'Не удалось открыть форму оплаты. Проверьте подключение к интернету и попробуйте снова.');
          setIsSubmitting(false);
          return;
        }
      } else {
        console.log('Note is not paid, creating without Stripe');
        await axios.post('http://localhost:3003/api/notes', {
          type,
          names: normalizedNames,
          isPaid: paymentInfo.isPaid,
          amount: paymentInfo.amount,
        });
        console.log('Free note created successfully');
        setSuccess(t('successMessage') || 'Записка успешно отправлена!');
        setNamesList([]);
      }
    } catch (err: any) {
      console.error('Error in handleSubmit at 10:16 PM EEST, June 06, 2025:', err);
      if (err.response?.status === 401) {
        setError(t('authError') || 'Ошибка авторизации. Пожалуйста, обновите страницу и попробуйте снова.');
      } else if (err.response?.status === 500) {
        setError(t('serverError') || 'Произошла ошибка на сервере. Пожалуйста, попробуйте позже или обратитесь к администратору.');
      } else if (err.code === 'ERR_NETWORK') {
        setError(t('networkError') || 'Не удалось подключиться к серверу. Проверьте ваше интернет-соединение.');
      } else {
        setError(err.response?.data?.message || t('generalError') || 'Произошла ошибка при отправке записки. Попробуйте снова.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="p-8 bg-white rounded-lg shadow-sm border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex gap-3 items-center mb-4">
        <div>{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-base text-gray-600 mb-6">{description}</p>
      <div className="mb-6">
        <label htmlFor={`${category}-type`} className="block text-sm font-medium text-gray-700 mb-2">
          {t('typeLabel') || 'Тип записки'}
        </label>
        <select
          id={`${category}-type`}
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
        >
          {paymentTypes.map((option: { value: string; label: string }, index: number) => (
            <option key={index} value={option.value}>
              {option.label}
              {option.perName > 0 && ` (${option.perName} MDL за имя)`}
            </option>
          ))}
        </select>
      </div>
      <div className="p-4 mb-6 rounded-lg bg-gray-50">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newName}
            onChange={handleNewNameChange}
            placeholder={t('namePlaceholder') || 'Введите имя (в родительном падеже)'}
            className="p-3 w-full text-base bg-white rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-700"
          />
          <button
            type="button"
            onClick={handleAddName}
            className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
          >
            {t('addButton') || 'Добавить'}
          </button>
        </div>
        {namesList.length > 0 && (
          <ul className="list-disc pl-5">
            {namesList.map((name, index) => (
              <li key={index} className="flex justify-between items-center text-base text-gray-700 mb-2">
                <span>{name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveName(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  {t('removeButton') || 'Удалить'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {paymentInfo.isPaid && (
        <div className="mb-4 text-base text-gray-700">
          {paymentInfo.perName > 0 ? (
            <>
              <p>{t('amountPerNameLabel', { count: nameCount, amount: paymentInfo.amount }) || `Сумма: ${nameCount} имён x ${paymentInfo.perName} MDL = ${paymentInfo.amount} MDL`}</p>
              <p>{t('amountUsdLabel', { amount: paymentInfo.amountUsd }) || `Примерно ${paymentInfo.amountUsd} USD`}</p>
              <p>{t('amountEurLabel', { amount: paymentInfo.amountEur }) || `Примерно ${paymentInfo.amountEur} EUR`}</p>
            </>
          ) : (
            <>
              <p>
                {t('amountLabel', { amount: paymentInfo.amount }) || `Сумма: ${paymentInfo.amount} MDL`}
                {type === 'proskomedia' && ` (${t('forTenNames') || 'за 10 имён'})`}
              </p>
              <p>{t('amountUsdLabel', { amount: paymentInfo.amountUsd }) || `Примерно ${paymentInfo.amountUsd} USD`}</p>
              <p>{t('amountEurLabel', { amount: paymentInfo.amountEur }) || `Примерно ${paymentInfo.amountEur} EUR`}</p>
            </>
          )}
        </div>
      )}
      <motion.button
        onClick={handleSubmit}
        disabled={isSubmitting || (!stripe && paymentInfo.isPaid)}
        className={`w-full px-6 py-3 text-base text-white rounded-lg ${paymentInfo.isPaid ? 'bg-amber-700 hover:bg-amber-800' : 'bg-emerald-600 hover:bg-emerald-700'} disabled:opacity-50 flex items-center justify-center`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('submitting') || 'Отправка...'}
          </span>
        ) : (
          t('submitButton') || 'Подать записку'
        )}
      </motion.button>
      {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
      {success && <p className="mt-2 text-green-500 text-center">{success}</p>}
    </motion.div>
  );
};

const DonationCards: React.FC = () => {
  const t = useTranslations('Note.donationForm');

  const donationForms = [
    {
      title: t('health.title') || 'О здравии',
      description: t('health.description') || 'Молитва о здравии и благополучии живых',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[24px] h-[24px]"
        >
          <path d="M0 0H24V24H0V0Z" stroke="#E5E7EB"></path>
          <path
            d="M2.23125 14.081L10.7016 21.9888C11.0531 22.317 11.5172 22.4998 12 22.4998C12.4828 22.4998 12.9469 22.317 13.2984 21.9888L21.7687 14.081C23.1938 12.7545 24 10.8935 24 8.9482V8.67633C24 5.39976 21.6328 2.60601 18.4031 2.06695C16.2656 1.7107 14.0906 2.40914 12.5625 3.93726L12 4.49976L11.4375 3.93726C9.90938 2.40914 7.73438 1.7107 5.59688 2.06695C2.36719 2.60601 0 5.39976 0 8.67633V8.9482C0 10.8935 0.80625 12.7545 2.23125 14.081Z"
            fill="#059669"
          ></path>
        </svg>
      ),
      category: "zdravie",
    },
    {
      title: t('repose.title') || 'О упокоении',
      description: t('repose.description') || 'Молитва об усопших православных христианах',
      icon: (
        <svg
          width="18"
          height="24"
          viewBox="0 0 18 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[18px] h-[24px]"
        >
          <g clipPath="url(#clip0_2_2884)">
            <path
              d="M8.25 0C7.00781 0 6 1.00781 6 2.25V6H2.25C1.00781 6 0 7.00781 0 8.25V9.75C0 10.9922 1.00781 12 2.25 12H6V21.75C6 22.9922 7.00781 24 8.25 24H9.75C10.9922 24 12 22.9922 12 21.75V12H15.75C16.9922 12 18 10.9922 18 9.75V8.25C18 7.00781 16.9922 6 15.75 6H12V2.25C12 1.00781 10.9922 0 9.75 0H8.25Z"
              fill="#475569"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_2_2884">
              <path d="M0 0H18V24H0V0Z" fill="white"></path>
            </clipPath>
          </defs>
        </svg>
      ),
      category: "upokoy",
    },
  ];

  return (
    <Elements stripe={stripePromise}>
      <section className="flex gap-8 justify-center max-md:flex-col">
        {donationForms.map((form, index) => (
          <DonationForm
            key={index}
            title={form.title}
            description={form.description}
            icon={form.icon}
            category={form.category}
          />
        ))}
      </section>
    </Elements>
  );
};

export default DonationCards;