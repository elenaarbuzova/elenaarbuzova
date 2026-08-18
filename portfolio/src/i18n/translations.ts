export type Lang = 'en' | 'ru';

export const translations = {
  en: {
    nav: {
      about: 'About',
      work: 'Work',
      process: 'Process',
      testimonials: 'Testimonials',
      contact: 'Contact',
    },
    hero: {
      role: 'Web Designer & QA Engineer',
      cta: 'Selected Work ↓',
      lines: ['DESIGN.', 'TEST.', 'DELIVER'] as const,
    },
    about: {
      line1: "I don't design websites.",
      line2: 'I design digital experiences.',
      point1: 'Every interface starts with a question.',
      point2: 'Every interaction has a purpose.',
      point3: 'Every pixel must justify its existence.',
    },
    work: {
      title: 'Selected Work',
      webDesign: 'Web Design',
      uxResearch: 'UX Research',
      uiUx: 'UI / UX',
      productPrototype: 'Product prototype',
      yeatSubtitle: 'Artist Portfolio Website',
      atelierSubtitle: 'Architecture Studio',
      stillnessSubtitle: 'Mindful Experience',
      labagentSubtitle: 'Research Assistant Product',
      yeatHover:
        'An immersive digital experience created for a modern music artist. The design focuses on bold visual storytelling, dynamic layouts and expressive interactions to capture the artist’s identity through a powerful and memorable web presence.',
      stillnessHover:
        'A calming digital environment built around simplicity and mindfulness. The design focuses on creating an emotional connection through minimal layouts, soft transitions and a peaceful visual language.',
      atelierHover:
        'A refined digital experience inspired by Scandinavian architecture and modern editorial design. The project focuses on creating a premium visual identity through minimalist layouts, elegant typography, immersive imagery and smooth interactions.',
      labagentHover:
        'A product experience for laboratories that need answers they can trust. The design turns documents, cited chat, an embeddable widget and a clear upgrade path into one focused flow – precise, calm and built to feel like a real tool, not a generic AI template.',
    },
    process: {
      title: 'The Process',
      steps: [
        { title: 'Research', desc: 'Understanding the domain, the users, and the constraints.' },
        { title: 'Structure', desc: 'Defining the architecture and interaction flows before visual design.' },
        { title: 'Prototype', desc: 'Building low-fidelity models to validate concepts quickly.' },
        { title: 'Visual Design', desc: 'Applying the aesthetic layer with obsessive precision.' },
        { title: 'Testing & Quality Assurance', desc: 'Checking usability, responsiveness and interface consistency across devices.' },
        { title: 'Launch', desc: 'Deployment, monitoring, and post-launch refinement.' },
      ],
    },
    skills: {
      design: 'Design',
      testing: 'Testing',
      designList: [
        'UI Design',
        'UX Research',
        'Figma',
        'Responsive Layouts',
        'Design Systems',
        'HTML & CSS',
        'Prototyping',
        'Typography',
      ],
      testingList: [
        'Manual Testing',
        'Bug Reporting',
        'Test Case Creation',
        'Usability Testing',
        'Cross-browser QA',
        'Accessibility',
        'Performance Auditing',
        'Attention to Detail',
      ],
    },
    philosophy: {
      line1: 'Good design is invisible.',
      line2: 'Great design is unforgettable.',
    },
    why: {
      title: 'Why Work With Me',
      reasons: [
        {
          title: "Designer's Eye",
          desc: "Every interface has visual balance. I sweat the details so your users don't have to.",
        },
        {
          title: 'QA Mindset',
          desc: 'Every interaction is verified. Edge cases are not an afterthought; they are the foundation.',
        },
        {
          title: 'Business Thinking',
          desc: 'Design solves problems, not just looks beautiful. Every decision maps to a metric.',
        },
      ],
    },
    testimonials: {
      t1: '"Elena always puts genuine effort into every project she works on. She pays close attention to details, listens carefully to feedback, and isn\'t afraid to improve her work until the result feels right. Working with her means knowing that every task will be approached with responsibility and care."',
      t1Role: 'Project Collaborator',
      t2: '"What impressed me most about Elena is her ability to balance aesthetics with usability. She doesn\'t design just for appearance – she thinks about how people will actually interact with the product. Her testing background gives her a unique perspective and makes her designs feel polished and well considered."',
      t2Role: 'UI/UX Designer',
    },
    contact: {
      line1: "Let's Build",
      line2: 'Something Better:)',
      copy: 'Copy',
      copied: 'Copied',
    },
    footer: {
      backToTop: 'Back to top',
      rights: 'All rights reserved',
    },
  },
  ru: {
    nav: {
      about: 'Обо мне',
      work: 'Работы',
      process: 'Процесс',
      testimonials: 'Отзывы',
      contact: 'Контакты',
    },
    hero: {
      role: 'Веб-дизайнер и инженер по качеству',
      cta: 'Избранные работы ↓',
      lines: ['ДИЗАЙН.', 'ТЕСТ.', 'РЕЛИЗ'] as const,
    },
    about: {
      line1: 'Я не просто делаю сайты.',
      line2: 'Я проектирую цифровые впечатления.',
      point1: 'Каждый интерфейс начинается с вопроса.',
      point2: 'У каждого взаимодействия есть цель.',
      point3: 'Каждый пиксель должен оправдывать своё существование.',
    },
    work: {
      title: 'Избранные работы',
      webDesign: 'Веб-дизайн',
      uxResearch: 'Исследование пользовательского опыта',
      uiUx: 'UI/UX',
      productPrototype: 'Прототип продукта',
      yeatSubtitle: 'Сайт-портфолио артиста',
      atelierSubtitle: 'Архитектурная студия',
      stillnessSubtitle: 'Осознанный опыт',
      labagentSubtitle: 'Продукт: исследовательский ассистент',
      yeatHover:
        'Захватывающий цифровой опыт для современного музыкального артиста. Дизайн строится на смелом визуальном повествовании, динамичных макетах и выразительных взаимодействиях, чтобы передать идентичность артиста через мощное и запоминающееся присутствие в сети.',
      stillnessHover:
        'Спокойная цифровая среда, построенная вокруг простоты и осознанности. Дизайн создаёт эмоциональную связь через минимальные макеты, мягкие переходы и мирный визуальный язык.',
      atelierHover:
        'Изысканный цифровой опыт в духе скандинавской архитектуры и современной редакционной подачи. Проект создаёт премиальную визуальную идентичность через минималистичные макеты, элегантную типографику, выразительные изображения и плавные взаимодействия.',
      labagentHover:
        'Продуктовый опыт для лабораторий, которым нужны ответы, которым можно доверять. Дизайн объединяет документы, чат с цитатами, встраиваемый виджет и понятный путь к расширению в один цельный сценарий – точный, спокойный и созданный как настоящий инструмент, а не как шаблон для ИИ.',
    },
    process: {
      title: 'Процесс',
      steps: [
        { title: 'Исследование', desc: 'Понимание предметной области, пользователей и ограничений.' },
        { title: 'Структура', desc: 'Архитектура и сценарии взаимодействия до визуального дизайна.' },
        { title: 'Прототип', desc: 'Низкодетализированные модели для быстрой проверки идей.' },
        { title: 'Визуальный дизайн', desc: 'Эстетический слой с вниманием к каждой детали.' },
        {
          title: 'Тестирование и обеспечение качества',
          desc: 'Проверка удобства, адаптивности и согласованности интерфейса на разных устройствах.',
        },
        { title: 'Запуск', desc: 'Выпуск, мониторинг и доработка после запуска.' },
      ],
    },
    skills: {
      design: 'Дизайн',
      testing: 'Тестирование',
      designList: [
        'Дизайн интерфейсов',
        'Исследование пользовательского опыта',
        'Figma',
        'Адаптивные макеты',
        'Дизайн-системы',
        'HTML & CSS',
        'Прототипирование',
        'Типографика',
      ],
      testingList: [
        'Ручное тестирование',
        'Отчёты об ошибках',
        'Создание тестовых сценариев',
        'Тестирование удобства',
        'Кроссбраузерное тестирование',
        'Доступность',
        'Аудит производительности',
        'Внимание к деталям',
      ],
    },
    philosophy: {
      line1: 'Хороший дизайн незаметен.',
      line2: 'Великий дизайн – незабываем.',
    },
    why: {
      title: 'Почему со мной',
      reasons: [
        {
          title: 'Взгляд дизайнера',
          desc: 'В каждом интерфейсе – визуальный баланс. Я работаю над деталями, чтобы пользователям не пришлось.',
        },
        {
          title: 'Мышление тестировщика',
          desc: 'Каждое взаимодействие проверено. Краевые случаи – не послесловие, а основа.',
        },
        {
          title: 'Бизнес-мышление',
          desc: 'Дизайн решает задачи, а не только украшает. Каждое решение связано с метрикой.',
        },
      ],
    },
    testimonials: {
      t1: '«Елена вкладывает настоящие усилия в каждый проект. Она внимательна к деталям, чутко принимает обратную связь и не боится дорабатывать результат, пока он не станет верным. С ней каждая задача выполняется ответственно и с заботой.»',
      t1Role: 'Участник проекта',
      t2: '«Больше всего впечатляет умение Елены балансировать эстетику и удобство. Она проектирует не только внешний вид – она думает о том, как люди будут взаимодействовать с продуктом. Опыт в тестировании даёт ей особый взгляд и делает дизайн зрелым и продуманным.»',
      t2Role: 'Дизайнер интерфейсов',
    },
    contact: {
      line1: 'Давайте создадим',
      line2: 'что-то лучше:)',
      copy: 'Копировать',
      copied: 'Скопировано',
    },
    footer: {
      backToTop: 'Наверх',
      rights: 'Все права защищены',
    },
  },
} as const;

export type Dictionary = (typeof translations)['en'];
