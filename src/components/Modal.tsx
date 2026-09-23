import { useEffect, type ReactNode } from 'react'

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
  busy = false,
}: {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
  busy?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, busy])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 px-4 py-10"
      onClick={busy ? undefined : onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative w-full rounded-sm border border-rule bg-card shadow-[0_24px_60px_rgba(20,32,44,0.18)] ${
          wide ? 'max-w-[720px]' : 'max-w-[520px]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-rule px-6 py-4">
          <div>
            <h2
              id="modal-title"
              className="font-serif text-xl font-semibold tracking-tight text-ink"
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-slate">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="mt-0.5 text-mist transition-colors hover:text-ink disabled:opacity-40"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M4 4l10 10M14 4L4 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  )
}
