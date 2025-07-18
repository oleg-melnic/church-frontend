import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`${
          currentPage === 1
            ? "h-10 text-base text-white bg-amber-700 rounded-lg w-[38px]"
            : "text-base text-gray-700 bg-white rounded-lg border-[1px] border-gray-300 h-[42px] w-[43px]"
        }`}
      >
        1
      </button>,
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <span key="ellipsis1" className="text-base text-black">
          ...
        </span>,
      );
    }

    // Show current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always shown

      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${
            currentPage === i
              ? "h-10 text-base text-white bg-amber-700 rounded-lg w-[38px]"
              : "text-base text-gray-700 bg-white rounded-lg border-[1px] border-gray-300 h-[42px] w-[43px]"
          }`}
        >
          {i}
        </button>,
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="ellipsis2" className="text-base text-black">
          ...
        </span>,
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`${
            currentPage === totalPages
              ? "h-10 text-base text-white bg-amber-700 rounded-lg w-[38px]"
              : "text-base text-gray-700 bg-white rounded-lg border-[1px] border-gray-300 h-[42px] w-[43px]"
          }`}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <nav className="flex gap-2 justify-center mt-12" aria-label="Pagination">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex justify-center items-center w-11 bg-white rounded-lg border border-gray-300 h-[34px]"
        aria-label="Previous page"
      >
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[10px] h-[16px]"><g clip-path="url(#clip0_7_3408)"><path d="M1.1687 7.29414C0.778076 7.68477 0.778076 8.31914 1.1687 8.70977L7.1687 14.7098C7.55933 15.1004 8.1937 15.1004 8.58433 14.7098C8.97495 14.3191 8.97495 13.6848 8.58433 13.2941L3.29058 8.00039L8.5812 2.70664C8.97183 2.31602 8.97183 1.68164 8.5812 1.29102C8.19058 0.900391 7.5562 0.900391 7.16558 1.29102L1.16558 7.29102L1.1687 7.29414Z" fill="#374151"></path></g><defs><clipPath id="clip0_7_3408"><path d="M0.875 0H10.875V16H0.875V0Z" fill="white"></path></clipPath></defs></svg>',
          }}
        />
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex justify-center items-center w-11 bg-white rounded-lg border border-gray-300 h-[34px]"
        aria-label="Next page"
      >
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[10px] h-[16px]"><g clip-path="url(#clip0_7_3411)"><path d="M9.83127 7.29414C10.2219 7.68477 10.2219 8.31914 9.83127 8.70977L3.83127 14.7098C3.44065 15.1004 2.80627 15.1004 2.41565 14.7098C2.02502 14.3191 2.02502 13.6848 2.41565 13.2941L7.7094 8.00039L2.41877 2.70664C2.02815 2.31602 2.02815 1.68164 2.41877 1.29102C2.8094 0.900391 3.44377 0.900391 3.8344 1.29102L9.8344 7.29102L9.83127 7.29414Z" fill="#374151"></path></g><defs><clipPath id="clip0_7_3411"><path d="M0.125 0H10.125V16H0.125V0Z" fill="white"></path></clipPath></defs></svg>',
          }}
        />
      </button>
    </nav>
  );
};

export default Pagination;
