export type Lang = 'en' | 'ru';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      work: 'Work',
      contact: 'Contact',
      menu: 'Menu',
    },
    hero: {
      role: 'Web Designer & AI Developer',
      cta: 'Selected Work ↓',
      greeting: "Hi I'm Elena Arbuzova",
      greetingLeft: "I'm A",
      greetingRight: 'Elena Arbuzova',
      greetingInitial: 'A',
      left: 'WEB',
      right: 'DESIGNER',
      leftLines: ['WEB'] as const,
      rightLines: ['DESIGNER'] as const,
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
      stillnessSubtitle: 'Mindful Experience',
      labagentSubtitle: 'Research Assistant Product',
    },
    caseStudy: {
      overview: 'Overview',
      disciplines: 'Disciplines',
      otherWork: 'Other work',
      visitSite: 'Visit website',
      backToWork: 'Work',
      coverLabel: 'Cover',
    },
    cases: {
      labagent: {
        headline: 'Answers labs can trust',
        overview:
          'LabAgent is a product experience built around a simple promise: laboratories need answers they can verify. I shaped the full flow — knowledge upload, cited chat, embeddable widget, analytics and upgrade path — into one calm, focused interface. The goal was not another AI demo, but a tool that feels precise, credible and ready for real workflows. Every screen prioritises clarity over novelty.',
        disciplines: ['Product Design', 'UI / UX', 'Prototyping', 'AI Product'] as const,
      },
      yeat: {
        headline: 'Identity for a modern artist',
        overview:
          'YEAT is an immersive web presence for a contemporary music artist. I approached it as visual storytelling first: bold type, dynamic composition and interactions that match the energy of the music without overwhelming it. The site is built to feel memorable in a single visit — strong first impression, clear navigation, and a layout that scales from hero moments to catalogue depth.',
        disciplines: ['Web Design', 'UI / UX', 'Visual Design'] as const,
      },
      stillness: {
        headline: 'Calm in a noisy feed',
        overview:
          'Stillness is a digital space for mindfulness — designed to slow the user down rather than compete for attention. I focused on editorial restraint: generous whitespace, soft transitions and typography that reads like a quiet invitation. The experience is intentionally minimal so the emotional tone — peace, focus, presence — comes through in every scroll.',
        disciplines: ['UI / UX', 'Experience Design', 'Visual Design'] as const,
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
      home: 'Главная',
      about: 'Обо мне',
      work: 'Работы',
      contact: 'Контакты',
      menu: 'Меню',
    },
    hero: {
      role: 'Веб-дизайнер и разработчик ИИ',
      cta: 'Избранные работы ↓',
      greeting: "Hi I'm Elena Arbuzova",
      greetingLeft: "I'm A",
      greetingRight: 'Elena Arbuzova',
      greetingInitial: 'A',
      left: 'WEB',
      right: 'DESIGNER',
      leftLines: ['WEB'] as const,
      rightLines: ['DESIGNER'] as const,
      lines: ['ДИЗАЙН.', 'КОД.', 'РЕЛИЗ'] as const,
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
      stillnessSubtitle: 'Осознанный опыт',
      labagentSubtitle: 'Продукт: исследовательский ассистент',
    },
    caseStudy: {
      overview: 'Обзор',
      disciplines: 'Дисциплины',
      otherWork: 'Другие работы',
      visitSite: 'Посетить сайт',
      backToWork: 'Работы',
      coverLabel: 'Обложка',
    },
    cases: {
      labagent: {
        headline: 'Ответы, которым лаборатории могут доверять',
        overview:
          'LabAgent — продуктовый опыт вокруг простого обещания: лабораториям нужны ответы, которые можно проверить. Я собрала весь сценарий — загрузку документов, чат с цитатами, встраиваемый виджет, аналитику и путь к расширению — в один спокойный, сфокусированный интерфейс. Задача была не в очередной AI-демо, а в инструменте, который ощущается точным, надёжным и готовым к реальной работе. На каждом экране — ясность важнее эффектности.',
        disciplines: ['Продуктовый дизайн', 'UI / UX', 'Прототипирование', 'ИИ-продукт'] as const,
      },
      yeat: {
        headline: 'Идентичность современного артиста',
        overview:
          'YEAT — иммерсивное веб-присутствие для современного музыкального артиста. Я подошла к проекту как к визуальному повествованию: смелая типографика, динамичная композиция и взаимодействия, которые передают энергию музыки, не перегружая её. Сайт должен запоминаться с первого визита — сильное первое впечатление, понятная навигация и макет, который масштабируется от hero-моментов к глубине каталога.',
        disciplines: ['Веб-дизайн', 'UI / UX', 'Визуальный дизайн'] as const,
      },
      stillness: {
        headline: 'Спокойствие в шумной ленте',
        overview:
          'Stillness — цифровое пространство для осознанности, созданное замедлить пользователя, а не бороться за внимание. Я сделала акцент на редакционной сдержанности: воздух, мягкие переходы и типографика, которая читается как тихое приглашение. Опыт намеренно минималистичен — чтобы эмоциональный тон (покой, фокус, присутствие) чувствовался в каждом скролле.',
        disciplines: ['UI / UX', 'Опыт взаимодействия', 'Визуальный дизайн'] as const,
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
