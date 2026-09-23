import { CLOSED_REASONS, STATUS_COLUMNS } from '../lib/labels'
import type { ClosedReason, PartnerStatus } from '../types'

function encodeStatus(
  status: PartnerStatus,
  closedReason: ClosedReason | null,
): string {
  if (status === 'closed') return `closed:${closedReason ?? 'paused'}`
  return status
}

function decodeStatus(value: string): {
  status: PartnerStatus
  closedReason: ClosedReason | null
} {
  if (value.startsWith('closed:')) {
    const reason = value.slice(7) as ClosedReason
    return { status: 'closed', closedReason: reason }
  }
  return { status: value as PartnerStatus, closedReason: null }
}

export function StatusControl({
  status,
  closedReason,
  onChange,
  id,
  compact = false,
}: {
  status: PartnerStatus
  closedReason: ClosedReason | null
  onChange: (status: PartnerStatus, closedReason: ClosedReason | null) => void
  id?: string
  compact?: boolean
}) {
  return (
    <div className="relative" onPointerDown={(e) => e.stopPropagation()}>
      <select
        id={id}
        aria-label="Partner status"
        className={`w-full cursor-pointer appearance-none rounded-sm border border-rule bg-snow pr-7 text-ink ${
          compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-sm'
        }`}
        value={encodeStatus(status, closedReason)}
        onChange={(e) => {
          const next = decodeStatus(e.target.value)
          onChange(next.status, next.closedReason)
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {STATUS_COLUMNS.filter((s) => s.id !== 'closed').map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
        {CLOSED_REASONS.map((r) => (
          <option key={r.id} value={`closed:${r.id}`}>
            Closed · {r.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-mist"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        aria-hidden
      >
        <path d="M2 3.5 L5 7 L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </div>
  )
}
