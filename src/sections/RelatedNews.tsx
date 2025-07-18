// src/sections/RelatedNews.tsx
import React from 'react';
import NewsCard from '../components/NewsCard';

const RelatedNews: React.FC = () => {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Похожие новости</h2>
      <div className="grid gap-8 grid-cols-[repeat(3,1fr)] max-md:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]">
        <NewsCard
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/e73b68b0dd798c01d2a89f172c79eb5cf2ab47c8"
          date="12 января 2025"
          category="Служба"
          title="Рождественский концерт церковного хора"
          description="Краткое описание концерта."
        />
        <NewsCard
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/84442ca89724f0403866a148d28ee23ba187c8b8"
          category="Служба"
          date="10 января 2025"
          title="Начало занятий в воскресной школе"
          description="Краткое описание занятий."
        />
        <NewsCard
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/3b37c3f3fc74430601459b059415bafc5e113a5a"
          category="Служба"
          date="8 января 2025"
          title='Благотворительная акция "Помоги ближнему"'
          description="Краткое описание акции."
        />
      </div>
    </section>
  );
};

export default RelatedNews;