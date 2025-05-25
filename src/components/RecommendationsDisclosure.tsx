// components/RecommendationsDisclosure.tsx
'use client'

import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default function RecommendationsDisclosure({
  recommendations,
  title = "Рекомендации"
}: {
  recommendations?: string[]
  title?: string
}) {
  if (!recommendations || recommendations.length === 0) return null

  return (
    <Disclosure>
      {({ open }) => (
        <div className="mt-4 bg-blue-50 p-3 rounded-lg">
          <Disclosure.Button 
            className="flex w-full justify-between items-center"
            aria-label={`${open ? 'Скрыть' : 'Показать'} рекомендации`}
          >
            <h4 className="font-medium text-blue-800">{title}</h4>
            <ChevronDownIcon
              className={`h-5 w-5 text-blue-800 transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </Disclosure.Button>
          
          <Disclosure.Panel className="pt-2">
            <ul 
              className="list-disc pl-5 space-y-1"
              role="list"
            >
              {recommendations.map((rec, i) => (
                <li 
                  key={i} 
                  className="text-blue-700 text-sm leading-6"
                  role="listitem"
                >
                  {rec}
                </li>
              ))}
            </ul>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}