import React from "react";
import { NoteIcon, HeartIcon } from "./../components/SvgIcons";

const SupportSection: React.FC = () => {
  return (
    <section className="px-0 py-16">
      <div className="px-4 py-0 mx-auto my-0 max-w-screen-xl max-sm:px-5 max-sm:py-0">
        <h2 className="mb-10 text-3xl text-center text-gray-800">
          Поддержите нашу церковь
        </h2>
        <div className="flex gap-6 justify-center max-sm:flex-col max-sm:gap-4">
          <button className="flex gap-2 items-center px-6 py-3.5 text-base text-white bg-amber-600 rounded-lg cursor-pointer border-[none]">
            <NoteIcon />
            <span>Подать записку онлайн</span>
          </button>
          <button className="flex gap-2 items-center px-6 py-3.5 text-base text-white bg-amber-600 rounded-lg cursor-pointer border-[none]">
            <HeartIcon />
            <span>Сделать пожертвование</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
