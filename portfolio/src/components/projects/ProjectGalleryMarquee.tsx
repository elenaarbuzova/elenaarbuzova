import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import type { ProjectMeta } from '@/lib/projects';

const MIN_IMAGES = 16;

function resolveGalleryImages(project: ProjectMeta): string[] {
  const custom = project.galleryImages?.filter(Boolean) ?? [];
  if (custom.length === 0) {
    return Array.from({ length: MIN_IMAGES }, () => project.cover);
  }

  const padded = [...custom];
  while (padded.length < MIN_IMAGES) {
    padded.push(custom[padded.length % custom.length]);
  }
  return padded;
}

export function ProjectGalleryMarquee({ project }: { project: ProjectMeta }) {
  const images = resolveGalleryImages(project);

  return (
    <div className="mx-auto my-10 max-w-7xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDMarquee images={images} />
    </div>
  );
}
