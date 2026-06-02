"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from(
    new Set([1, page - 1, page, page + 1, totalPages].filter((item) => item >= 1 && item <= totalPages)),
  ).sort((a, b) => a - b);

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-2 border border-[#dcfce7] bg-white px-3 py-2 text-[#64748b] transition hover:border-[#16a34a] hover:text-[#166534] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      <div className="flex items-center gap-1">
        {pages.map((item, index) => (
          <span key={item} className="flex items-center gap-1">
            {index > 0 && item - pages[index - 1] > 1 ? (
              <span className="px-2 text-[#16a34a]">…</span>
            ) : null}
            <button
              type="button"
              onClick={() => onPageChange(item)}
              className={`min-w-9 px-3 py-2 font-mono text-sm transition ${
                item === page
                  ? "bg-[#166534] text-white"
                  : "border border-[#dcfce7] bg-white text-[#64748b] hover:border-[#16a34a] hover:text-[#166534]"
              }`}
            >
              {item}
            </button>
          </span>
        ))}
      </div>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-2 border border-[#dcfce7] bg-white px-3 py-2 text-[#64748b] transition hover:border-[#16a34a] hover:text-[#166534] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
