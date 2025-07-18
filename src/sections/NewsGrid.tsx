"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import Pagination from "./Pagination";

interface News {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  image: string;
  fullText: string;
  isMain: boolean;
  isActive: boolean;
  category?: string;
  schedule?: string[];
}

interface NewsGridProps {
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'title';
  sortOrder: 'ASC' | 'DESC';
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: 'createdAt' | 'title', sortOrder: 'ASC' | 'DESC') => void;
}

const NewsGrid: React.FC<NewsGridProps> = ({
  page,
  limit,
  sortBy,
  sortOrder,
  onPageChange,
  onSortChange,
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Убедимся, что параметры определены
        const safePage = page || 1;
        const safeLimit = limit || 3;
        const safeSortBy = sortBy || 'createdAt';
        const safeSortOrder = sortOrder || 'DESC';

        const response = await axios.get<{ news: News[]; total: number }>(
          `http://localhost:3003/api/news?page=${safePage}&limit=${safeLimit}&sortBy=${safeSortBy}&sortOrder=${safeSortOrder}`,
          {
            headers: {
              Authorization: "Bearer your_secure_api_token",
            },
          }
        );
        setNews(response.data.news);
        setTotal(response.data.total);
        setLoading(false);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "Неизвестная ошибка";
        setError(`Ошибка загрузки новостей: ${errorMessage}`);
        setLoading(false);
        console.error("Error fetching news:", err);
      }
    };

    fetchNews();
  }, [page, limit, sortBy, sortOrder]);

  const handleSortChange = (field: 'createdAt' | 'title') => {
    const newSortOrder = sortBy === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSortChange(field, newSortOrder);
  };

  if (loading) {
    return (
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl text-gray-800">Все новости</h2>
        <p>Загрузка...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl text-gray-800">Все новости</h2>
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl text-gray-800">Все новости</h2>
        <p>Новости отсутствуют</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-gray-800">Все новости</h2>
      </div>
      <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
        {news.map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            imageUrl={item.image}
            date={item.createdAt}
            category={item.category || "События"}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalItems={total}
        itemsPerPage={limit}
        onPageChange={onPageChange}
      />
    </section>
  );
};

export default NewsGrid;
