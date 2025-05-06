//app/page.tsx
import { TestCard } from '@/components/TestCard'
import { TESTS } from '@/data/tests'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Доступные тесты</h1>
      <div className="grid gap-4">
        {TESTS.map(test => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>
    </div>
  )
}