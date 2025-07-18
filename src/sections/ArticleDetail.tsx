import React from "react";
import CalendarIcon from "./../components/CalendarIcon";
import { FacebookIcon, TelegramIcon, VKIcon } from "./../components/SocialIcons";

const ArticleDetail: React.FC = () => {
  return (
    <article className="mt-16">
      <a href="#" className="mb-8 text-sm text-gray-500 no-underline block">
        ← Вернуться к новостям
      </a>
      <h1 className="mb-4 text-3xl text-gray-800">
        Престольный праздник святого великомученика Георгия Победоносца
      </h1>
      <div className="flex gap-2 items-center mb-8 text-sm text-gray-500">
        <CalendarIcon />
        <span>15 января 2025</span>
      </div>
      <div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/17046c7fccf33e66d2f44f1e9e9407661ce56c01"
          alt=""
          className="object-cover mb-8 w-full h-[500px]"
        />
        <div className="text-base leading-normal text-gray-700">
          <p>Дорогие братья и сестры!</p>
          <p>
            6 мая наш храм отмечает престольный праздник - день памяти святого
            великомученика Георгия Победоносца. Приглашаем всех верующих на
            торжественное богослужение.
          </p>
          <h2 className="mx-0 mt-6 mb-4 text-xl text-black">
            Расписание богослужений:
          </h2>
          <ul className="pl-6 mx-0 my-4">
            <li>8:00 - Божественная литургия</li>
            <li>11:00 - Крестный ход</li>
            <li>12:00 - Праздничная трапеза</li>
          </ul>
          <p>
            После богослужения состоится праздничный концерт с участием
            церковного хора. Также будет организована благотворительная ярмарка,
            средства от которой пойдут на помощь нуждающимся прихожанам.
          </p>
          <blockquote className="pl-5 mx-0 my-6 italic text-gray-600 border-l-4 border-solid border-l-amber-600">
            &quot;Святый великомученик Георгий Победоносец, моли Бога о
            нас!&quot;
          </blockquote>
          <p>Ждем всех желающих разделить с нами радость праздника!</p>
        </div>
        <div className="flex gap-4 items-center pt-8 mt-8 border-t border-solid">
          <span>Поделиться:</span>
          <div className="flex gap-4">
            <FacebookIcon color="#4B5563" size={20} />
            <TelegramIcon color="#4B5563" size={20} />
            <VKIcon color="#4B5563" size={20} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
