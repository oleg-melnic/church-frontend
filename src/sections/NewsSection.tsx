// src/sections/NewsSection.tsx
import React from 'react';
import NewsCard from '../components/NewsCard';
import FeaturedNews from './FeaturedNews';
import NewsGrid from './NewsGrid';
import Pagination from './Pagination';

const NewsSection: React.FC = () => {
  const newsItems = [
    {
      id: 1,
      image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e73b68b0dd798c01d2a89f172c79eb5cf2ab47c8',
      date: '12 января 2025',
      title: 'Рождественский концерт церковного хора',
      content: 'В нашей церкви прошёл ежегодный рождественский концерт, организованный церковным хором.',
      description: 'Краткое описание концерта.'
    },
    {
      id: 2,
      image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/84442ca89724f0403866a148d28ee23ba187c8b8',
      date: '10 января 2025',
      title: 'Начало занятий в воскресной школе',
      content: 'В воскресной школе начались занятия для детей всех возрастов.',
      description: 'Краткое описание занятий.'
    },
    {
      id: 3,
      image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3b37c3f3fc74430601459b059415bafc5e113a5a',
      date: '8 января 2025',
      title: 'Благотворительная акция "Помоги ближнему"',
      content: 'Мы провели благотворительную акцию, чтобы помочь нуждающимся семьям.',
      description: 'Краткое описание акции.'
    }
  ];

  return (
    <main className="flex flex-col gap-12 px-20 py-8 max-md:px-10 max-sm:px-5">
      <FeaturedNews />
      <NewsGrid page={0} limit={0} sortBy={'createdAt'} sortOrder={'ASC'} onPageChange={function (page: number): void {
        throw new Error('Function not implemented.');
      } } onSortChange={function (sortBy: 'createdAt' | 'title', sortOrder: 'ASC' | 'DESC'): void {
        throw new Error('Function not implemented.');
      } } />
      <Pagination currentPage={0} totalItems={0} itemsPerPage={0} onPageChange={function (page: number): void {
        throw new Error('Function not implemented.');
      } } />
    </main>
  );
};

export default NewsSection;