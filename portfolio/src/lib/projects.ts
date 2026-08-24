import labagent from '@assets/generated_images/labagent.png';

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
};

export const projects: ProjectMeta[] = [
  {
    slug: 'labagent',
    title: 'LabAgent',
    year: '2026',
    liveUrl: 'https://labagent.vercel.app/',
    cover: labagent,
    subtitleKey: 'labagentSubtitle',
    tagKey: 'productPrototype',
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
  },
];

export function getProject(slug: string | undefined) {
  return projects.find((project) => project.slug === slug);
}

export function getOtherProjects(slug: ProjectSlug) {
  return projects.filter((project) => project.slug !== slug);
}
