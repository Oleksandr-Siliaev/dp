'use client';
// components/PaginationControls.tsx
import Link from 'next/link';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  searchParams?: Record<string, string>;
};

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  searchParams = {},
}: PaginationControlsProps) {
  console.log('PaginationControls rendered with:', {
    currentPage,
    totalPages,
    searchParams,
  });
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const generateQueryString = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    return params.toString();
  };

  return (
    <div className='flex items-center gap-4'>
      {hasPrev && (
        <Link
          href={`?${generateQueryString()}&page=${currentPage - 1}`}
          className='px-4 py-2 bg-gray-500 rounded hover:bg-gray-400'
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
        >
          Назад
        </Link>
      )}

      <span className='text-sm text-gray-600'>
        Сторінка {currentPage} з {totalPages}
      </span>

      {hasNext && (
        <Link
          href={`?${generateQueryString()}&page=${currentPage + 1}`}
          className='px-4 py-2 bg-gray-500 rounded hover:bg-gray-400'
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
        >
          Вперед
        </Link>
      )}
    </div>
  );
}
