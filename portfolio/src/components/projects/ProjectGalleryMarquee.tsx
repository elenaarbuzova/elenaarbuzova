import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import type { ProjectMeta } from '@/lib/projects';

const MIN_IMAGES = 28;

function resolveGalleryImages(project: ProjectMeta): string[] {
  const custom = project.galleryImages?.filter(Boolean) ?? [];
  if (custom.length === 0) {
    return Array.from({ length: MIN_IMAGES }, () => project.cover);
  }

  const padded: string[] = [];
  while (padded.length < MIN_IMAGES) {
    padded.push(custom[padded.length % custom.length]);
  }
  return padded;
}

export function ProjectGalleryMarquee({ project }: { project: ProjectMeta }) {
  const images = resolveGalleryImages(project);

  return (
    <div className="mx-auto my-4 max-w-7xl rounded-2xl bg-gray-950/5 p-1 ring-1 ring-neutral-700/10 sm:my-10 sm:rounded-3xl sm:p-2 dark:bg-neutral-800">
      <ThreeDMarquee images={images} />
    </div>
  );
}
