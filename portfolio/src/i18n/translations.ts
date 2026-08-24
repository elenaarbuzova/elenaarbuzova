export type Lang = 'en' | 'ru';

export const translations = {
  en: {
    nav: {
      about: 'About',
      work: 'Work',
      contact: 'Contact',
    },
    hero: {
      role: 'Web Designer & AI Developer',
      cta: 'Selected Work ↓',
      lines: ['DESIGN.', 'BUILD.', 'DELIVER'] as const,
    },
    about: {
      lines: [
        'From pixels to products.',
        'I design, build, and experiment with AI to turn ideas into real digital experiences.',
        'No endless perfection – just good design, smart tools, and things that actually work.',
      ] as const,
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
    caseStudy: {
      overview: 'Overview',
      disciplines: 'Disciplines',
      otherWork: 'Other work',
      visitSite: 'Visit website',
      builtIn: 'Built in',
      backToWork: 'Work',
      imageSoon: 'Image coming soon',
      coverLabel: 'Cover',
    },
    cases: {
      labagent: {
        headline: 'Answers labs can trust',
        overview:
          'A product experience for laboratories that need answers they can trust. The design turns documents, cited chat, an embeddable widget and a clear upgrade path into one focused flow – precise, calm and built to feel like a real tool, not a generic AI template.',
        disciplines: ['Product Design', 'UI / UX', 'Prototyping', 'AI Product'] as const,
      },
      yeat: {
        headline: 'Identity for a modern artist',
        overview:
          'An immersive digital experience created for a modern music artist. The design focuses on bold visual storytelling, dynamic layouts and expressive interactions to capture the artist’s identity through a powerful and memorable web presence.',
        disciplines: ['Web Design', 'UI / UX', 'Visual Design'] as const,
      },
      stillness: {
        headline: 'Calm in a noisy feed',
        overview:
          'A calming digital environment built around simplicity and mindfulness. The design focuses on creating an emotional connection through minimal layouts, soft transitions and a peaceful visual language.',
        disciplines: ['UI / UX', 'Experience Design', 'Visual Design'] as const,
      },
      'atelier-nordhavn': {
        headline: 'Architecture, distilled',
        overview:
          'A refined digital experience inspired by Scandinavian architecture and modern editorial design. The project focuses on creating a premium visual identity through minimalist layouts, elegant typography, immersive imagery and smooth interactions.',
        disciplines: ['UI / UX', 'Web Design', 'Editorial Design'] as const,
      },
    },
    contact: {
      line1: "Let's Build",
      line2: 'Something Better:)',
      copy: 'Copy',
      copied: 'Copied',
    },
    tools: {
      label: 'I work with',
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
      contact: 'Контакты',
    },
    hero: {
      role: 'Веб-дизайнер и разработчик ИИ',
      cta: 'Избранные работы ↓',
      lines: ['ДИЗАЙН.', 'РАЗРАБОТКА.', 'РЕЛИЗ'] as const,
    },
    about: {
      lines: [
        'От пикселей к продуктам.',
        'Я проектирую, собираю и экспериментирую с ИИ, чтобы превращать идеи в настоящий цифровой опыт.',
        'Никакого бесконечного перфекционизма – только хороший дизайн, умные инструменты и вещи, которые реально работают.',
      ] as const,
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
    caseStudy: {
      overview: 'Обзор',
      disciplines: 'Дисциплины',
      otherWork: 'Другие работы',
      visitSite: 'Посетить сайт',
      builtIn: 'Сделано в',
      backToWork: 'Работы',
      imageSoon: 'Фото скоро',
      coverLabel: 'Обложка',
    },
    cases: {
      labagent: {
        headline: 'Ответы, которым лаборатории могут доверять',
        overview:
          'Продуктовый опыт для лабораторий, которым нужны ответы, которым можно доверять. Дизайн объединяет документы, чат с цитатами, встраиваемый виджет и понятный путь к расширению в один цельный сценарий – точный, спокойный и созданный как настоящий инструмент, а не как шаблон для ИИ.',
        disciplines: ['Продуктовый дизайн', 'UI / UX', 'Прототипирование', 'ИИ-продукт'] as const,
      },
      yeat: {
        headline: 'Идентичность современного артиста',
        overview:
          'Захватывающий цифровой опыт для современного музыкального артиста. Дизайн строится на смелом визуальном повествовании, динамичных макетах и выразительных взаимодействиях, чтобы передать идентичность артиста через мощное и запоминающееся присутствие в сети.',
        disciplines: ['Веб-дизайн', 'UI / UX', 'Визуальный дизайн'] as const,
      },
      stillness: {
        headline: 'Спокойствие в шумной ленте',
        overview:
          'Спокойная цифровая среда, построенная вокруг простоты и осознанности. Дизайн создаёт эмоциональную связь через минимальные макеты, мягкие переходы и мирный визуальный язык.',
        disciplines: ['UI / UX', 'Опыт взаимодействия', 'Визуальный дизайн'] as const,
      },
      'atelier-nordhavn': {
        headline: 'Архитектура в чистом виде',
        overview:
          'Изысканный цифровой опыт в духе скандинавской архитектуры и современной редакционной подачи. Проект создаёт премиальную визуальную идентичность через минималистичные макеты, элегантную типографику, выразительные изображения и плавные взаимодействия.',
        disciplines: ['UI / UX', 'Веб-дизайн', 'Редакционный дизайн'] as const,
      },
    },
    contact: {
      line1: 'Давайте создадим',
      line2: 'что-то лучше:)',
      copy: 'Копировать',
      copied: 'Скопировано',
    },
    tools: {
      label: 'Я работаю с',
    },
    footer: {
      backToTop: 'Наверх',
      rights: 'Все права защищены',
    },
  },
} as const;

export type Dictionary = (typeof translations)['en'];
