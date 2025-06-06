"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const blockSize = 5;
  const currentBlock = Math.floor((currentPage - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6 mb-8">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="text-gray-400 disabled:opacity-50"
      >
        <ChevronsLeft />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-gray-400 disabled:opacity-45"
      >
        <ChevronLeft />
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
            currentPage === page
              ? "bg-[#FF9500] text-white font-bold"
              : "hover:bg-[#FF9500]/20 text-gray-800"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-gray-400 disabled:opacity-50"
      >
        <ChevronRight />
      </button>
      <button
        data-cy="pagination-last"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="text-gray-400 disabled:opacity-50"
      >
        <ChevronsRight />
      </button>
    </div>
  );
}
