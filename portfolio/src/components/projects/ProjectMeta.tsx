type ProjectMetaProps = {
  items: Array<string | undefined | false>;
  className?: string;
};

export function ProjectMeta({ items, className = '' }: ProjectMetaProps) {
  const parts = items.filter((item): item is string => Boolean(item));

  return (
    <p
      className={`flex flex-wrap items-center text-[13px] font-medium tracking-[0.04em] text-muted-foreground md:text-sm ${className}`}
    >
      {parts.map((item, index) => (
        <span key={`${item}-${index}`} className="inline-flex items-center">
          {index > 0 ? (
            <span className="mx-2.5 text-[0.7em] leading-none text-foreground/30" aria-hidden>
              ·
            </span>
          ) : null}
          <span className="leading-none">{item}</span>
        </span>
      ))}
    </p>
  );
}
