import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import type { ProjectMeta } from '@/lib/projects';

const MIN_IMAGES = 16;

function resolveGalleryImages(project: ProjectMeta): string[] {
  const custom = project.galleryImages?.filter(Boolean) ?? [];
  if (custom.length >= 4) return custom;

  return Array.from({ length: MIN_IMAGES }, (_, index) => custom[index] ?? project.cover);
}

export function ProjectGalleryMarquee({ project }: { project: ProjectMeta }) {
  const images = resolveGalleryImages(project);

  return (
    <div className="mx-auto my-10 max-w-7xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10">
      <ThreeDMarquee images={images} />
    </div>
  );
}
