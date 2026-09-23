import type { LearningOutcome } from '../types'

const STYLES: Record<LearningOutcome, string> = {
  validated: 'text-validated bg-validated-bg',
  invalidated: 'text-invalidated bg-invalidated-bg',
  unclear: 'text-unclear bg-unclear-bg',
}

const LABELS: Record<LearningOutcome, string> = {
  validated: 'Validated',
  invalidated: 'Invalidated',
  unclear: 'Unclear',
}

export function OutcomeChip({
  outcome,
  size = 'md',
}: {
  outcome: LearningOutcome
  size?: 'sm' | 'md'
}) {
  return (
    <span
      className={`stamp ${STYLES[outcome]} ${size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : ''}`}
    >
      {LABELS[outcome]}
    </span>
  )
}
