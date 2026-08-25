import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const ThreeDMarquee = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const chunkSize = Math.ceil(images.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return images.slice(start, start + chunkSize);
  });

  return (
    <div
      className={cn(
        'mx-auto block h-[600px] overflow-hidden rounded-2xl max-sm:h-100',
        className,
      )}
    >
      <div className="flex size-full items-center justify-center [perspective:1400px]">
        <div className="relative size-[1720px] shrink-0 scale-[0.5] sm:scale-[0.72] md:scale-[0.88] lg:scale-[1.1]">
          <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
            <div
              style={{
                transform: 'rotateX(55deg) rotateY(0deg) rotateZ(-45deg)',
              }}
              className="grid w-max grid-cols-4 gap-5 sm:gap-6 [transform-style:preserve-3d]"
            >
              {chunks.map((subarray, colIndex) => (
                <motion.div
                  animate={{ y: colIndex % 2 === 0 ? 100 : -100 }}
                  transition={{
                    duration: colIndex % 2 === 0 ? 10 : 15,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  key={colIndex + 'marquee'}
                  className="flex flex-col items-start gap-5 sm:gap-6"
                >
                  <GridLineVertical className="-left-4" offset="80px" />
                  {subarray.map((image, imageIndex) => (
                    <div className="relative z-10" key={imageIndex + image}>
                      <GridLineHorizontal className="-top-4" offset="20px" />
                      <div className="relative z-20 aspect-[40/19] w-[268px] overflow-hidden rounded-md bg-white p-0.5 ring ring-gray-950/5 hover:shadow-2xl sm:w-[284px]">
                        <motion.img
                          whileHover={{
                            y: -10,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: 'easeInOut',
                          }}
                          src={image}
                          alt={`Image ${imageIndex + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          '--background': '#ffffff',
          '--color': 'rgba(0, 0, 0, 0.2)',
          '--height': '1px',
          '--width': '5px',
          '--fade-stop': '90%',
          '--offset': offset || '200px',
          '--color-dark': 'rgba(255, 255, 255, 0.2)',
          maskComposite: 'exclude',
        } as React.CSSProperties
      }
      className={cn(
        'absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]',
        'bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]',
        '[background-size:var(--width)_var(--height)]',
        '[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]',
        '[mask-composite:exclude]',
        'z-0',
        'dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]',
        className,
      )}
    />
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          '--background': '#ffffff',
          '--color': 'rgba(0, 0, 0, 0.2)',
          '--height': '5px',
          '--width': '1px',
          '--fade-stop': '90%',
          '--offset': offset || '150px',
          '--color-dark': 'rgba(255, 255, 255, 0.2)',
          maskComposite: 'exclude',
        } as React.CSSProperties
      }
      className={cn(
        'absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]',
        'bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]',
        '[background-size:var(--width)_var(--height)]',
        '[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]',
        '[mask-composite:exclude]',
        'z-0',
        'dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]',
        className,
      )}
    />
  );
};
