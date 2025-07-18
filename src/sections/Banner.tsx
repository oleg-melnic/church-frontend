import React from 'react';
import Link from 'next/link';

const Banner: React.FC = () => {
  return (
    <section className="relative bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/d5139977c2c7e7fadbe7825e1b02921631c7c663"
          alt="Церковь Святого Георгия Победоносца"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Добро пожаловать в церковь Святого Георгия Победоносца
        </h1>
        <p className="text-lg sm:text-xl mb-6">
          Присоединяйтесь к нашей общине, чтобы вместе молиться, помогать и радоваться!
        </p>
        <Link
          href="/news"
          className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
        >
          Узнать больше
        </Link>
      </div>
    </section>
  );
};

export default Banner;
