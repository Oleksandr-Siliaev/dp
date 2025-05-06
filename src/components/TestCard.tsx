import Link from 'next/link'
import { Test } from '@/types'

export function TestCard({ test }: { test: Test }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">{test.title}</h2>
      <p className="text-gray-600 mt-2">{test.description}</p>
      <Link 
        href={`/tests/${test.id}`}
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        Начать тест
      </Link>
    </div>
  )
}