// components/RecommendationsDisclosure.tsx
'use client'

import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default function RecommendationsDisclosure({
  recommendations,
}: {
  recommendations: string[]
}) {
  return (
    <Disclosure>
      {({ open }) => (
        <div className="mt-4 bg-blue-50 p-3 rounded-lg">
          <Disclosure.Button className="flex w-full justify-between items-center">
            <h4 className="font-medium text-blue-800">Рекомендации</h4>
            <ChevronDownIcon
              className={`h-5 w-5 text-blue-800 transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
              style={{ transition: 'transform 200ms' }}
            />
          </Disclosure.Button>
          
          <Disclosure.Panel className="pt-2">
            <ul className="list-disc pl-5 space-y-1">
              {recommendations.map((rec, i) => (
                <li key={i} className="text-blue-700 text-sm">
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