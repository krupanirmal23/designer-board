export function LoopLoader({
  size = 'md',
  label,
}: {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}) {
  const box =
    size === 'sm' ? 'h-1.5 w-1.5' : size === 'lg' ? 'h-2.5 w-2.5' : 'h-2 w-2'

  return (
    <span
      className="inline-flex items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-1" aria-hidden>
        <span className={`loop-tick ${box} bg-current`} />
        <span className={`loop-tick ${box} bg-current`} />
        <span className={`loop-tick ${box} bg-current`} />
      </span>
      {label ? <span>{label}</span> : <span className="sr-only">Loading</span>}
    </span>
  )
}

export function DeltaMark({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path d="M8 2.6 L14.3 13.5 H1.7 Z" fill="currentColor" />
    </svg>
  )
}
