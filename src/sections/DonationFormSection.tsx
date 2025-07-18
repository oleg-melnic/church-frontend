"use client";

import React, { useState } from "react";
import { useTranslations } from 'next-intl';
import axios from "axios";
import { useStripe } from '@stripe/react-stripe-js';

const DonationAmountButton: React.FC<{
  amount: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ amount, isSelected, onClick }) => {
  return (
    <button
      type="button"
      className={`flex-1 text-base text-black bg-white rounded border border-amber-300 h-[42px] transition-colors duration-200 ${
        isSelected ? "bg-amber-200 border-amber-500" : "bg-white hover:bg-amber-50"
      }`}
      onClick={onClick}
    >
      {amount}
    </button>
  );
};

const DonationFormSection: React.FC = () => {
  const t = useTranslations('DonationFormSection');
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const stripe = useStripe();

  // Курсы обмена (примерные, можно заменить на API)
  const exchangeRates = {
    mdlToUsd: 0.056, // 1 MDL = 0.056 USD
    mdlToEur: 0.052, // 1 MDL = 0.052 EUR
  };

  // Получение текущей суммы
  const finalAmount = selectedAmount === "custom" ? customAmount : selectedAmount;
  const parsedAmount = finalAmount ? parseFloat(finalAmount) : 0;

  // Конвертация суммы в USD и EUR
  const amountUsd = parsedAmount ? parseFloat((parsedAmount * exchangeRates.mdlToUsd).toFixed(2)) : 0;
  const amountEur = parsedAmount ? parseFloat((parsedAmount * exchangeRates.mdlToEur).toFixed(2)) : 0;

  const handleAmountSelection = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAmount("custom");
    setCustomAmount(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Начинаем отправку пожертвования');

    if (!finalAmount) {
      console.log('Ошибка валидации: сумма не выбрана');
      setError(t('errorAmountRequired'));
      return;
    }
    const parsedAmount = parseFloat(finalAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.log('Ошибка валидации: некорректная сумма');
      setError(t('errorInvalidAmount'));
      return;
    }
    console.log('Валидация суммы прошла успешно:', parsedAmount);

    if (!donorName.trim()) {
      console.log('Ошибка валидации: имя пустое');
      setError(t('errorNameRequired'));
      return;
    }
    console.log('Валидация имени прошла успешно:', donorName);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
      console.log('Ошибка валидации: некорректный email');
      setError(t('errorInvalidEmail'));
      return;
    }
    console.log('Валидация email прошла успешно:', donorEmail);

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const normalizedDonorName = donorName.trim();
    const normalizedEmail = donorEmail.trim().toLowerCase();
    const normalizedComment = comment.trim();

    try {
      console.log('Создаём пожертвование:', { 
        amount: parsedAmount, 
        donorName: normalizedDonorName, 
        donorEmail: normalizedEmail, 
        comment: normalizedComment 
      });
      await axios.post('http://localhost:3003/api/donations', {
        amount: parsedAmount,
        donorName: normalizedDonorName,
        donorEmail: normalizedEmail,
        comment: normalizedComment,
        status: 'pending',
        paymentMethod: "stripe",
      });
      console.log('Пожертвование успешно создано со статусом pending');

      console.log('Создаём сессию Stripe Checkout');
      const { data } = await axios.post('http://localhost:3003/api/donations/create-checkout-session', {
        amount: parsedAmount * 100,
        donorName: normalizedDonorName,
        donorEmail: normalizedEmail,
      });
      console.log('Сессия Stripe Checkout создана:', data.sessionId);

      const result = await stripe?.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result?.error) {
        console.log('Ошибка перенаправления Stripe:', result.error.message);
        setError(result.error.message || t('errorStripeRedirect'));
        setIsSubmitting(false);
        return;
      }
    } catch (err: any) {
      console.error('Ошибка при отправке пожертвования:', err);
      setError(err.response?.data?.message || t('errorSubmit'));
      setIsSubmitting(false);
    }
  };

  return (
    <section className="p-8 bg-white rounded-lg shadow-sm border-[1px_solid_#F1F5F9]">
      <h2 className="mb-6 text-2xl text-slate-800">{t('title')}</h2>
      <div className="flex gap-8 max-md:flex-col">
        <div className="flex-1">
          <div className="p-6 mb-6 rounded-lg bg-slate-50">
            <h3 className="mb-4 text-lg text-slate-800">
              {t('selectAmountTitle')}
            </h3>
            <div className="flex gap-4 max-sm:flex-col">
              <DonationAmountButton
                amount="100 lei"
                isSelected={selectedAmount === "100"}
                onClick={() => handleAmountSelection("100")}
              />
              <DonationAmountButton
                amount="500 lei"
                isSelected={selectedAmount === "500"}
                onClick={() => handleAmountSelection("500")}
              />
              <DonationAmountButton
                amount="1000 lei"
                isSelected={selectedAmount === "1000"}
                onClick={() => handleAmountSelection("1000")}
              />
            </div>
            <input
              type="number"
              placeholder={t('customAmountPlaceholder')}
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="px-2 mt-4 w-full text-base bg-white rounded border-[1px_solid_#E2E8F0] h-[42px]"
            />
            {/* Отображаем сумму в MDL, USD и EUR */}
            {parsedAmount > 0 && (
              <div className="mt-4 text-base text-gray-700">
                <p>{t('totalAmount', { amount: parsedAmount }) || `Итого: ${parsedAmount} MDL`}</p>
                <p>{t('amountUsdLabel', { amount: amountUsd }) || `Примерно ${amountUsd} USD`}</p>
                <p>{t('amountEurLabel', { amount: amountEur }) || `Примерно ${amountEur} EUR`}</p>
              </div>
            )}
          </div>
          <div className="p-6 rounded-lg bg-slate-50">
            <h3 className="mb-4 text-lg text-slate-800">{t('paymentMethodTitle')}</h3>
            <div className="flex flex-col gap-3">
              <label className="flex gap-3 items-center text-base text-black">
                <input
                  type="radio"
                  name="payment"
                  className="rounded-full border-[0.5px_solid_#000] h-[13px] w-[13px]"
                  checked={true}
                  readOnly
                />
                <span>{t('paymentMethodCard')}</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6 rounded-lg bg-slate-50">
          <h3 className="mb-4 text-lg text-slate-800">{t('donorInfoTitle')}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder={t('donorNamePlaceholder')}
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="px-2 w-full text-base bg-white rounded border-[1px_solid_#E2E8F0] h-[42px]"
            />
            <input
              type="email"
              placeholder={t('donorEmailPlaceholder')}
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              className="px-2 w-full text-base bg-white rounded border-[1px_solid_#E2E8F0] h-[42px]"
            />
            <textarea
              placeholder={t('commentPlaceholder')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="p-2 w-full text-base bg-white rounded border-[1px_solid_#E2E8F0] h-[90px]"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 w-full text-base text-white bg-amber-700 rounded disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('submitting')}
                </span>
              ) : (
                t('submitButton')
              )}
            </button>
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            {success && <p className="mt-4 text-green-500 text-center">{success}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default DonationFormSection;