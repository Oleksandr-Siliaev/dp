// components/PaginationControls.tsx
import Link from 'next/link'

type PaginationControlsProps = {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange
}: PaginationControlsProps) {
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {hasPrev && (
        onPageChange ? (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Назад
          </button>
        ) : (
          <Link
            href={`?page=${currentPage - 1}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Назад
          </Link>
        )
      )}

      <span className="text-sm text-gray-600">
        Страница {currentPage} из {totalPages}
      </span>

      {hasNext && (
        onPageChange ? (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Вперед
          </button>
        ) : (
          <Link
            href={`?page=${currentPage + 1}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Вперед
          </Link>
        )
      )}
    </div>
  )
}