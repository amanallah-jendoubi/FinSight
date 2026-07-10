import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination
 * Page navigation with truncated page numbers, plus a "results per page" selector.
 *
 * Props:
 * - currentPage: number
 * - totalPages: number
 * - perPage: number
 * - perPageOptions: number[]
 * - onPageChange: (page) => void
 * - onPerPageChange: (perPage) => void
 */
export default function Pagination({
  currentPage ,
  totalPages ,
  onPageChange 
}) {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-sm text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-indigo-500 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function getVisiblePages(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];

  return [1, "...", current, "...", total];
}