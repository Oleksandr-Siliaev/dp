// components/PaginationControls.tsx
import Link from 'next/link'

export function PaginationControls({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div className="flex items-center gap-4">
      {hasPrev && (
        <Link
          href={`?page=${currentPage - 1}`}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Назад
        </Link>
      )}

      <span className="text-sm text-gray-600">
        Страница {currentPage} из {totalPages}
      </span>

      {hasNext && (
        <Link
          href={`?page=${currentPage + 1}`}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Вперед
        </Link>
      )}
    </div>
  )
}