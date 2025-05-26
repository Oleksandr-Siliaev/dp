// components/PaginationControls.tsx
import Link from 'next/link'

type PaginationControlsProps = {
  currentPage: number
  totalPages: number
  searchParams?: Record<string, string>
}

export function PaginationControls({
  currentPage,
  totalPages,
  searchParams = {}
}: PaginationControlsProps) {
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const generateQueryString = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('page')
    return params.toString()
  }

  return (
    <div className="flex items-center gap-4">
      {hasPrev && (
        <Link
          href={`?${generateQueryString()}&page=${currentPage - 1}`}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Назад
        </Link>
      )}

      <span className="text-sm text-gray-600">
        Страница {currentPage} из {totalPages}
      </span>

      {hasNext && (
        <Link
          href={`?${generateQueryString()}&page=${currentPage + 1}`}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Вперед
        </Link>
      )}
    </div>
  )
}