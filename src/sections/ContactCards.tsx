import React from 'react';
import { useTranslations } from 'next-intl';

const AddressCard: React.FC = () => {
  const t = useTranslations('Contact');

  return (
    <article className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
      <svg
        width="23"
        height="30"
        viewBox="0 0 23 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[22.5px] h-[30px] mb-[12px]"
      >
        <g clipPath="url(#clip0_2_3234)">
          <path
            d="M12.7168 29.25C15.7227 25.4883 22.5781 16.3711 22.5781 11.25C22.5781 5.03906 17.5391 0 11.3281 0C5.11719 0 0.078125 5.03906 0.078125 11.25C0.078125 16.3711 6.93359 25.4883 9.93945 29.25C10.6602 30.1465 11.9961 30.1465 12.7168 29.25ZM11.3281 7.5C12.3227 7.5 13.2765 7.89509 13.9798 8.59835C14.683 9.30161 15.0781 10.2554 15.0781 11.25C15.0781 12.2446 14.683 13.1984 13.9798 13.9017C13.2765 14.6049 12.3227 15 11.3281 15C10.3336 15 9.37974 14.6049 8.67647 13.9017C7.97321 13.1984 7.57812 12.2446 7.57812 11.25C7.57812 10.2554 7.97321 9.30161 8.67647 8.59835C9.37974 7.89509 10.3336 7.5 11.3281 7.5Z"
            fill="#B45309"
          />
        </g>
        <defs>
          <clipPath id="clip0_2_3234">
            <path d="M0.078125 0H22.5781V30H0.078125V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <h3 className="mb-2 text-xl text-black">{t('address') || 'Адрес'}</h3>
      <address className="text-base text-center text-gray-600 not-italic">
        <span>{t('addressStreet') || 'ул. Щусева, 1'}</span>
        <br />
        <span>{t('addressCity') || 'г. Новые Анены, Р. Молдова'}</span>
      </address>
    </article>
  );
};

const PhoneCard: React.FC = () => {
  const t = useTranslations('Contact');

  return (
    <article className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
      <svg
        width="31"
        height="30"
        viewBox="0 0 31 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[30px] h-[30px] mb-[12px]"
      >
        <g clipPath="url(#clip0_2_3244)">
          <path
            d="M10.6465 1.44175C10.1953 0.351907 9.00586 -0.228171 7.86914 0.0823758L2.71289 1.48863C1.69336 1.76988 0.984375 2.69566 0.984375 3.75034C0.984375 18.2464 12.7383 30.0003 27.2344 30.0003C28.2891 30.0003 29.2148 29.2914 29.4961 28.2718L30.9023 23.1156C31.2129 21.9789 30.6328 20.7894 29.543 20.3382L23.918 17.9945C22.9629 17.596 21.8555 17.8714 21.2051 18.6742L18.8379 21.5628C14.7129 19.6117 11.373 16.2718 9.42188 12.1468L12.3105 9.7855C13.1133 9.12925 13.3887 8.02769 12.9902 7.07261L10.6465 1.44761V1.44175Z"
            fill="#B45309"
          />
        </g>
        <defs>
          <clipPath id="clip0_2_3244">
            <path d="M0.984375 0H30.9844V30H0.984375V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <h3 className="mb-2 text-xl text-black">{t('phone') || 'Телефон'}</h3>
      <p className="text-base text-gray-600">
        <a href={`tel:${t('phone1') || '+(373) 676-29-020'}`}>
          {t('phone1') || '+(373) 676-29-020'}
        </a>
      </p>
      <p className="text-base text-gray-600">
        <a href={`tel:${t('phone2') || '+(373) 676-29-022'}`}>
          {t('phone2') || '+(373) 676-29-022'}
        </a>
      </p>
    </article>
  );
};

const EmailCard: React.FC = () => {
  const t = useTranslations('Contact');

  return (
    <article className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
      <svg
        width="31"
        height="30"
        viewBox="0 0 31 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[30px] h-[30px] mb-[12px]"
      >
        <g clipPath="url(#clip0_2_3251)">
          <path
            d="M3.46875 3.75C1.91602 3.75 0.65625 5.00977 0.65625 6.5625C0.65625 7.44727 1.07227 8.2793 1.78125 8.8125L14.5312 18.375C15.1992 18.873 16.1133 18.873 16.7812 18.375L29.5312 8.8125C30.2402 8.2793 30.6562 7.44727 30.6562 6.5625C30.6562 5.00977 29.3965 3.75 27.8438 3.75H3.46875ZM0.65625 10.3125V22.5C0.65625 24.5684 2.33789 26.25 4.40625 26.25H26.9062C28.9746 26.25 30.6562 24.5684 30.6562 22.5V10.3125L17.9062 19.875C16.5703 20.877 14.7422 20.877 13.4062 19.875L0.65625 10.3125Z"
            fill="#B45309"
          />
        </g>
        <defs>
          <clipPath id="clip0_2_3251">
            <path d="M0.65625 0H30.6562V30H0.65625V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <h3 className="mb-2 text-xl text-black">{t('email') || 'Email'}</h3>
      <p className="text-base text-gray-600">
        <a href={`mailto:${t('emailAddress') || 'oleg.melnic@gmail.com'}`}>
          {t('emailAddress') || 'oleg.melnic@gmail.com'}
        </a>
      </p>
    </article>
  );
};

const ContactCards: React.FC = () => {
  return (
    <section className="flex justify-center px-20 py-12 w-full max-md:px-10 max-sm:px-5">
      <div className="grid grid-cols-3 gap-8 w-full max-w-screen-xl max-md:grid-cols-2 max-sm:grid-cols-1">
        <AddressCard />
        <PhoneCard />
        <EmailCard />
      </div>
    </section>
  );
};

export default ContactCards;