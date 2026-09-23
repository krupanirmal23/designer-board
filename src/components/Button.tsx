import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoopLoader } from './LoopLoader'

type Variant = 'primary' | 'ghost' | 'quiet'

export function Button({
  children,
  busy = false,
  busyLabel,
  variant = 'primary',
  className = '',
  disabled,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  busy?: boolean
  busyLabel?: string
  variant?: Variant
}) {
  const styles: Record<Variant, string> = {
    primary:
      'bg-prussian text-snow hover:bg-prussian-deep disabled:hover:bg-prussian',
    ghost:
      'border border-rule bg-card text-slate hover:text-ink disabled:hover:text-slate',
    quiet: 'text-slate hover:text-ink disabled:hover:text-slate',
  }

  return (
    <button
      type={type}
      disabled={disabled || busy}
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium disabled:cursor-wait disabled:opacity-70 ${styles[variant]} ${className}`}
      {...rest}
    >
      {busy ? (
        <>
          <LoopLoader size="sm" />
          {busyLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
