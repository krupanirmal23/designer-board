import type {
  ClosedReason,
  HypothesisStatus,
  LearningOutcome,
  PartnerStatus,
} from '../types'

export const STATUS_COLUMNS: { id: PartnerStatus; label: string }[] = [
  { id: 'prospect', label: 'Prospect' },
  { id: 'talking', label: 'Talking' },
  { id: 'active', label: 'Active' },
  { id: 'closed', label: 'Closed' },
]

export const CLOSED_REASONS: { id: ClosedReason; label: string }[] = [
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
  { id: 'paused', label: 'Paused' },
]

export const HYPOTHESIS_STATUSES: { id: HypothesisStatus; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'validated', label: 'Validated' },
  { id: 'invalidated', label: 'Invalidated' },
  { id: 'unclear', label: 'Unclear' },
]

export const OUTCOMES: { id: LearningOutcome; label: string }[] = [
  { id: 'validated', label: 'Validated' },
  { id: 'invalidated', label: 'Invalidated' },
  { id: 'unclear', label: 'Unclear' },
]

export function closedReasonLabel(reason: ClosedReason | null): string {
  if (!reason) return 'Closed'
  const found = CLOSED_REASONS.find((r) => r.id === reason)
  return found ? `Closed · ${found.label}` : 'Closed'
}

export function statusLabel(
  status: PartnerStatus,
  closedReason: ClosedReason | null,
): string {
  if (status === 'closed') return closedReasonLabel(closedReason)
  return STATUS_COLUMNS.find((s) => s.id === status)?.label ?? status
}
