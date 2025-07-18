"use client";

import React, { useState } from "react";
import FeaturedNews from "../../sections/FeaturedNews";
import NewsGrid from "../../sections/NewsGrid";

const News: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex flex-col gap-12 px-20 py-32 max-md:px-10 max-sm:px-5">
      <FeaturedNews />
      <NewsGrid
        page={currentPage}
        limit={itemsPerPage}
        onPageChange={handlePageChange}
        sortBy={'createdAt'}
        sortOrder={'ASC'}
        onSortChange={(sortBy: 'createdAt' | 'title', sortOrder: 'ASC' | 'DESC') => {
          // Реализовать позже
        }}
      />
    </main>
  );
};

export default News;

export async function getServerSideProps({ locale }: { locale: string }) {
  console.log('getServerSideProps locale:', locale); // Добавим отладку

  let messages;
  try {
    if (locale === 'ru') {
      messages = (await import('../../../messages/ru.json')).default;
    } else if (locale === 'ro') {
      messages = (await import('../../../messages/ro.json')).default;
    } else {
      messages = (await import('../../../messages/ru.json')).default;
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
