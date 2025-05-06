import { TestComponent } from '@/components/TestComponent'
import { TESTS } from '@/data/tests'
import { redirect } from 'next/navigation'

export default async function TestPage({
  params
}: {
  params: { testId: string }
}) {
  const test = TESTS.find(t => t.id === params.testId)
  
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