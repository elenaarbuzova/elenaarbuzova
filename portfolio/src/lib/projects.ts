export type ProjectSlug = 'labagent' | 'yeat' | 'stillness';

export type ProjectMeta = {
  slug: ProjectSlug;
  title: string;
  year: string;
  liveUrl: string;
  cover: string;
  coverShift?: string;
  coverFit?: 'cover' | 'contain';
  coverAspect?: 'video' | 'wide';
  coverBg?: string;
  subtitleKey: 'yeatSubtitle' | 'stillnessSubtitle' | 'labagentSubtitle';
  categoryKey?: 'webDesign' | 'uxResearch';
  tagKey?: 'uiUx' | 'productPrototype';
  /** Project screenshots for the 3D gallery — add paths under /public */
  galleryImages?: string[];
};

export const projects: ProjectMeta[] = [
  {
    slug: 'labagent',
    title: 'LabAgent',
    year: '2026',
    liveUrl: 'https://labagent.vercel.app/',
    cover: '/LabAgent.PNG',
    subtitleKey: 'labagentSubtitle',
    tagKey: 'productPrototype',
    galleryImages: [
      '/work/labagent/labagent.jpg',
      '/work/labagent/labagent1.jpg',
      '/work/labagent/labagent2.jpg',
      '/work/labagent/labagent3.jpg',
      '/work/labagent/labagent4.jpg',
      '/work/labagent/labagent5.jpg',
      '/work/labagent/labagent6.jpg',
      '/work/labagent/labagent7.jpg',
      '/work/labagent/labagent8.jpg',
    ],
  },
  {
    slug: 'yeat',
    title: 'YEAT',
    year: '2026',
    liveUrl: 'https://yeat-ruddy.vercel.app/',
    cover: '/yeat.png',
    coverFit: 'contain',
    coverAspect: 'video',
    subtitleKey: 'yeatSubtitle',
    categoryKey: 'webDesign',
    galleryImages: [
      '/work/yeat/yeat.jpg',
      '/work/yeat/yeat1.jpg',
      '/work/yeat/yeat2.jpg',
      '/work/yeat/yeat3.jpg',
      '/work/yeat/yeat4.jpg',
      '/work/yeat/yeat5.jpg',
      '/work/yeat/yeat6.jpg',
      '/work/yeat/yeat7.jpg',
      '/work/yeat/yeat8.jpg',
    ],
  },
  {
    slug: 'stillness',
    title: 'Stillness',
    year: '2026',
    liveUrl: 'https://stillnesshq.vercel.app/',
    cover: '/stillness.png',
    coverFit: 'contain',
    coverAspect: 'video',
    coverBg: 'bg-[#efeae2]',
    subtitleKey: 'stillnessSubtitle',
    tagKey: 'uiUx',
    galleryImages: [],
  },
];

export function getProject(slug: string | undefined) {
  return projects.find((project) => project.slug === slug);
}

export function getOtherProjects(slug: ProjectSlug) {
  return projects.filter((project) => project.slug !== slug);
}
