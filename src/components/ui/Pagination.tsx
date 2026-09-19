import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWebsiteSettings } from '@/context/WebsiteSettingsContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const { content } = useWebsiteSettings();
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4 py-12 border-t border-border mt-8">
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className="flex items-center justify-center p-2 text-taupe hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline text-xs tracking-widest uppercase ml-1">
            {content.previousLabel || 'Previous'}
          </span>
        </button>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              disabled={disabled}
              className={`w-10 h-10 flex items-center justify-center text-xs font-sans tracking-wider transition-all border ${
                currentPage === num
                  ? 'bg-charcoal text-ivory border-charcoal font-semibold'
                  : 'bg-white text-taupe border-border hover:border-charcoal hover:text-charcoal'
              }`}
            >
              {num}
            </button>
          ))}
          {totalPages > 5 && getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              <span className="px-2 text-taupe">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-10 h-10 flex items-center justify-center text-xs font-sans border border-border text-taupe hover:border-charcoal"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Mobile Page Display */}
        <div className="sm:hidden flex items-center px-4">
          <span className="text-xs tracking-widest text-charcoal font-medium">
            PAGE <span className="font-mono">{currentPage}</span> / <span className="font-mono">{totalPages}</span>
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          className="flex items-center justify-center p-2 text-taupe hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <span className="hidden sm:inline text-xs tracking-widest uppercase mr-1">
            {content.nextLabel || 'Next'}
          </span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
