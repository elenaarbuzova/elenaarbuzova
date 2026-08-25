import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function padImages(images: string[]) {
  if (images.length === 0) return images;

  const padded = [...images];
  while (padded.length < 12 || padded.length % 4 !== 0) {
    padded.push(images[padded.length % images.length]);
  }
  return padded;
}

export const ThreeDMarquee = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gallery = padImages(images);
  const chunkSize = Math.ceil(gallery.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return gallery.slice(start, start + chunkSize);
  });

  return (
    <div
      className={cn(
        'mx-auto block h-[min(640px,72vh)] overflow-hidden rounded-2xl sm:h-[600px]',
        className,
      )}
    >
      <div className="flex size-full items-center justify-center [perspective:1400px]">
        <div
          className="grid origin-center grid-cols-4 gap-4 sm:gap-6 [transform-style:preserve-3d]"
          style={{
            transform:
              'rotateX(52deg) rotateZ(-42deg) scale(0.42) sm:scale(0.58) md:scale(0.72) lg:scale(0.82)',
          }}
        >
          {chunks.map((subarray, colIndex) => (
            <motion.div
              animate={{ y: colIndex % 2 === 0 ? 80 : -80 }}
              transition={{
                duration: colIndex % 2 === 0 ? 10 : 15,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              key={`${colIndex}-marquee`}
              className="flex flex-col items-center gap-4 sm:gap-6"
            >
              {subarray.map((image, imageIndex) => (
                <motion.img
                  key={`${colIndex}-${imageIndex}-${image}`}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  src={image}
                  alt={`Gallery ${imageIndex + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-[220px] rounded-lg object-cover ring ring-gray-950/5 hover:shadow-2xl sm:w-[260px] md:w-[300px]"
                  width={970}
                  height={700}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
