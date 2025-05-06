//src/data/tests.ts
import { Test } from '@/types'

export const TESTS: Test[] = [
  {
    id: 'depression-test',
    title: 'Тест на депрессию',
    description: 'Оценка эмоционального состояния',
    questions: [
      {
        id: 1,
        text: "Как часто вы чувствуете грусть?",
        answers: [
          { id: 1, text: "Никогда", score: 0 },
          { id: 2, text: "Иногда", score: 1 },
          { id: 3, text: "Часто", score: 2 }
        ]
      },
        {
            id: 2,
            text: "Как часто вы теряете интерес к вещам, которые раньше вам нравились?",
            answers: [
            { id: 1, text: "Никогда", score: 0 },
            { id: 2, text: "Иногда", score: 1 },
            { id: 3, text: "Часто", score: 2 },
            ]
        },
        {
            id: 3,
            text: "Как часто вы чувствуете усталость или недостаток энергии?",
            answers: [
            { id: 1, text: "Никогда", score: 0 },
            { id: 2, text: "Иногда", score: 1 },
            { id: 3, text: "Часто", score: 2 }
            ]
        },
        {
            id: 4,
            text: "test4",
            answers: [
            { id: 1, text: "Никогда", score: 0 },
            { id: 2, text: "Иногда", score: 1 },
            { id: 3, text: "Часто", score: 2 }
            ]
        },{
            id: 5,
            text: "test5",
            answers: [
            { id: 1, text: "Никогда", score: 0 },
            { id: 2, text: "Иногда", score: 1 },
            { id: 3, text: "Часто", score: 2 }
            ]
        },
    ]
  }
]