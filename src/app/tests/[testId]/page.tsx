//app/tests/[testId]/page.tsx
import { TestComponent } from '@/components/TestComponent'
import { TESTS } from '@/app/api/tests/data/tests'
import { redirect } from 'next/navigation'

export default async function TestPage({
  params
}: {
  params: Promise<{ testId: string }>
}) {
  const { testId } = await params
  const test = TESTS.find(t => t.id === testId)
  if (!test) {
    redirect('/')
  }

  // Клиент создается в TestComponent при необходимости
  return (
    <div className="container mx-auto p-4">
      <TestComponent test={test} />
    </div>
  )
}