// components/TestCard.tsx
import Link from 'next/link'
import { TestSummary } from '@/types'

export function TestCard({ test }: { test: TestSummary }) {
  return (
    <div className="h-full border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-3 text-white">{test.title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{test.description}</p>
      <div className="flex justify-between items-end">
        <span className="text-sm text-gray-500">
          {test.questionsCount} питань
        </span>
        <Link
          href={`/tests/${test.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Почати тест
        </Link>
      </div>
    </div>
  )
}