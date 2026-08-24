export function CursorMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {/* Simple Icons — Cursor */}
      <path d="M11.925 24l-4.037-4.037-1.258 1.258c-.436.436-1.143.436-1.58 0L.5 16.67c-.436-.436-.436-1.143 0-1.58l1.258-1.258L0 12.075 12.075 0 24 11.925l-4.037 4.037 1.258 1.258c.436.436.436 1.143 0 1.58l-4.55 4.55c-.436.436-1.143.436-1.58 0l-1.258-1.258L11.925 24z" />
    </svg>
  );
}
