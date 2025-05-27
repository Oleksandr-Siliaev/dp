//src/data/tests.ts
import { TestDetails } from '@/types'

export const TESTS: TestDetails[] = [
  {
    id: 'depression-test',
    title: 'Тест на депресію',
    description: 'Оцінка емоційного стану',
    questionsCount: 5, 
    questions: [
      {
        id: 1,
        text: "Як часто ви відчуваєте смуток?",
        answers: [
          { id: 1, text: "Ніколи", score: 0 },
          { id: 2, text: "Інколи", score: 1 },
          { id: 3, text: "Часто", score: 2 }
        ]
      },
        {
            id: 2,
            text: "Як часто ви втрачаєте інтерес до речей, які раніше вам подобалися?",
            answers: [
            { id: 1, text: "Ніколи", score: 0 },
            { id: 2, text: "Інколи", score: 1 },
            { id: 3, text: "Часто", score: 2 }
            ]
        },
        {
            id: 3,
            text: "Как часто вы чувствуете усталость или недостаток энергии?",
            answers: [
            { id: 1, text: "Никогда", score: 0, recommendations: ["Продолжайте поддерживать свой энергетический баланс!"] },
            { id: 2, text: "Иногда", score: 1, recommendations: ["Попробуйте добавить легкие физические нагрузки","Следите за режимом питания"   ] },
            { id: 3, text: "Часто", score: 2,recommendations: ["Проверьте уровень витамина D","Рассмотрите возможность консультации с врачом", "Уменьшите потребление кофеина"
      ] }
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
  },
  {
    id: 'anxiety-test',
    title: 'Тест на тривожність',
    description: 'Оцінка рівня тривожності',
    questionsCount: 5,
    questions: [
      {
        id: 1,
        text: "Как часто вы чувствуете тревогу?",
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
  },
  {
    id: 'panic-disorder-test',
    title: 'Тест на панічний розлад (PDSS-SR)',
    description: 'Оцінка симптомів панічного розладу',
    questionsCount: 5,
    questions: [
      {
        id: 1,
        text: "Як часто ви відчуваєте раптові напади інтенсивного страху чи тривоги?",
        answers: [
          { id: 1, text: "Ніколи", score: 0 },
          { id: 2, text: "Рідко", score: 1 },
          { id: 3, text: "Часто", score: 2 }
        ]
      },
      {
        id: 2,
        text: "Чи супроводжуються ці напади фізичними симптомами (наприклад, серцебиття, потовиділення, тремор)?",
        answers: [
          { id: 1, text: "Ніколи", score: 0 },
          { id: 2, text: "Інколи", score: 1 },
          { id: 3, text: "Регулярно", score: 2 }
        ]
      },
      {
        id: 3,
        text: "Як часто ви уникаєте місць або ситуацій через страх перед нападами?",
        answers: [
          { id: 1, text: "Ніколи", score: 0 },
          { id: 2, text: "Інколи", score: 1 },
          { id: 3, text: "Часто", score: 2 }
        ]
      },
      {
        id: 4,
        text: "Як часто напади впливають на вашу здатність виконувати звичні справи?",
        answers: [
          { id: 1, text: "Ніколи", score: 0 },
          { id: 2, text: "Дещо", score: 1 },
          { id: 3, text: "Значно", score: 2 }
        ]
      },
      {
        id: 5,
        text: "Як часто ви відчуваєте страх перед наступним нападом?",
        answers: [
          { id: 1, text: "Ніколи", score: 0 },
          { id: 2, text: "Інколи", score: 1 },
          { id: 3, text: "Майже постійно", score: 2 }
        ]
      }
    ]
  }
]