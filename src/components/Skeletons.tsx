export function PartnerDetailSkeleton() {
  return (
    <div
      className="mx-auto max-w-[880px] px-6 pb-20 pt-8"
      aria-busy="true"
      aria-label="Opening partner"
    >
      <div className="skel h-3 w-16" />
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <div className="skel h-9 w-56" />
          <div className="skel mt-3 h-4 w-40" />
        </div>
        <div className="skel h-9 w-36" />
      </div>
      <div className="mt-6 h-px bg-rule" />
      {[1, 2, 3].map((n) => (
        <div key={n} className="mt-10">
          <div className="skel h-5 w-36" />
          <div className="skel mt-4 h-28 w-full" />
        </div>
      ))}
    </div>
  )
}

export function ResetOverlay() {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-paper/80"
      role="status"
      aria-live="polite"
    >
      <div className="border border-rule bg-card px-8 py-6 text-center shadow-[0_16px_40px_rgba(20,32,44,0.12)]">
        <p className="font-serif text-lg font-semibold text-ink">Restoring the seed</p>
        <p className="mt-2 text-sm text-slate">
          Maya, Arjun, Priya, Sam, and Leah — as recorded.
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-mist">
          <span className="loop-tick mr-1 inline-block h-1.5 w-1.5 bg-prussian align-middle" />
          <span className="loop-tick mr-1 inline-block h-1.5 w-1.5 bg-prussian align-middle" />
          <span className="loop-tick inline-block h-1.5 w-1.5 bg-prussian align-middle" />
          <span className="ml-2">Resetting demo</span>
        </p>
      </div>
    </div>
  )
}
