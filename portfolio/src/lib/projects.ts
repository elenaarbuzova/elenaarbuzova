import yeat from '@assets/generated_images/yeat.png';
import voidArena from '@assets/generated_images/void-arena.png';
import stillness from '@assets/generated_images/stillness.png';
import labagent from '@assets/generated_images/labagent.png';

export type ProjectSlug = 'labagent' | 'yeat' | 'stillness' | 'atelier-nordhavn';

export type ProjectMeta = {
  slug: ProjectSlug;
  title: string;
  year: string;
  liveUrl: string;
  cover: string;
  coverShift?: string;
  subtitleKey: 'yeatSubtitle' | 'atelierSubtitle' | 'stillnessSubtitle' | 'labagentSubtitle';
  hoverKey: 'stillnessHover' | 'atelierHover' | 'yeatHover' | 'labagentHover';
  categoryKey?: 'webDesign' | 'uxResearch';
  tagKey?: 'uiUx' | 'productPrototype';
  /** Placeholder slots until real case images are uploaded */
  gallerySlots: number;
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
    hoverKey: 'labagentHover',
    gallerySlots: 3,
  },
  {
    slug: 'yeat',
    title: 'YEAT',
    year: '2026',
    liveUrl: 'https://yeat-ruddy.vercel.app/',
    cover: yeat,
    subtitleKey: 'yeatSubtitle',
    categoryKey: 'webDesign',
    hoverKey: 'yeatHover',
    gallerySlots: 3,
  },
  {
    slug: 'stillness',
    title: 'Stillness',
    year: '2026',
    liveUrl: 'https://stillnesshq.vercel.app/',
    cover: stillness,
    subtitleKey: 'stillnessSubtitle',
    tagKey: 'uiUx',
    hoverKey: 'stillnessHover',
    gallerySlots: 3,
  },
  {
    slug: 'atelier-nordhavn',
    title: 'Atelier Nordhavn',
    year: '2025',
    liveUrl: 'https://atelier-nordhavn.vercel.app/',
    cover: voidArena,
    subtitleKey: 'atelierSubtitle',
    tagKey: 'uiUx',
    hoverKey: 'atelierHover',
    gallerySlots: 3,
  },
];

export function getProject(slug: string | undefined) {
  return projects.find((project) => project.slug === slug);
}

export function getOtherProjects(slug: ProjectSlug) {
  return projects.filter((project) => project.slug !== slug);
}
