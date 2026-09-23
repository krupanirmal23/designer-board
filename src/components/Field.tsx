import type { ReactNode } from 'react'

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="block">
      <label
        className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-1.5 text-sm text-slate">{hint}</p>
      ) : null}
      {error ? (
        <p className="mt-1.5 text-sm text-invalidated">{error}</p>
      ) : null}
    </div>
  )
}

export const inputClass =
  'w-full rounded-sm border border-rule bg-snow px-3 py-2 text-ink placeholder:text-mist'

export const textareaClass = `${inputClass} min-h-[96px] resize-y leading-relaxed`
