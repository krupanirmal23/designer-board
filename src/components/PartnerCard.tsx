import { formatDateShort } from '../lib/dates'
import { closedReasonLabel } from '../lib/labels'
import type {
  ClosedReason,
  Conversation,
  Hypothesis,
  Learning,
  Partner,
  PartnerStatus,
} from '../types'
import { OutcomeChip } from './OutcomeChip'
import { StatusControl } from './StatusControl'

export function PartnerCard({
  partner,
  hypotheses,
  conversations,
  learnings,
  index = 0,
  onOpen,
  onStatus,
}: {
  partner: Partner
  hypotheses: Hypothesis[]
  conversations: Conversation[]
  learnings: Learning[]
  index?: number
  onOpen: () => void
  onStatus: (status: PartnerStatus, closedReason: ClosedReason | null) => void
}) {
  const openCount = hypotheses.filter((h) => h.status === 'open').length
  const last = conversations
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))[0]
  const lastLearnings = last
    ? learnings
        .filter((l) => l.conversationId === last.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    : []
  const latestOutcome = lastLearnings[0]
  const latestChange =
    lastLearnings.find((l) => l.nextProductChange)?.nextProductChange ?? ''
  const edge =
    latestOutcome?.outcome === 'validated'
      ? 'border-l-validated'
      : latestOutcome?.outcome === 'invalidated'
        ? 'border-l-invalidated'
        : latestOutcome?.outcome === 'unclear'
          ? 'border-l-unclear'
          : 'border-l-rule'

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/partner-id', partner.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      onClick={onOpen}
      style={{ animationDelay: `${index * 45}ms` }}
      className={`card-enter group cursor-pointer border border-rule border-l-[3px] bg-card p-3.5 shadow-[0_1px_0_rgba(20,32,44,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(20,32,44,0.08)] ${edge}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-[17px] font-semibold leading-snug text-ink">
            {partner.name}
          </h3>
          <p className="mt-0.5 truncate text-sm text-slate">
            {partner.company}
            {partner.role ? ` · ${partner.role}` : ''}
          </p>
        </div>
        {partner.status === 'closed' && partner.closedReason ? (
          <span
            className={`stamp shrink-0 ${
              partner.closedReason === 'won'
                ? 'text-validated bg-validated-bg'
                : partner.closedReason === 'lost'
                  ? 'text-invalidated bg-invalidated-bg'
                  : 'text-unclear bg-unclear-bg'
            }`}
          >
            {closedReasonLabel(partner.closedReason).replace('Closed · ', '')}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 font-mono text-[11px] text-mist">
        <span>
          {openCount} open {openCount === 1 ? 'hypothesis' : 'hypotheses'}
        </span>
        <span>
          {last ? `Last talk ${formatDateShort(last.date)}` : 'No conversation'}
        </span>
      </div>

      {latestOutcome ? (
        <div className="mt-3 border-t border-rule pt-3">
          <OutcomeChip outcome={latestOutcome.outcome} size="sm" />
          {latestChange ? (
            <p className="mt-2 line-clamp-2 text-sm leading-snug text-ink">
              <span className="mr-1 font-serif text-prussian">Δ</span>
              {latestChange}
            </p>
          ) : (
            <p className="mt-2 line-clamp-2 text-sm leading-snug text-slate">
              {latestOutcome.text}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 border-t border-rule pt-3 text-sm text-mist">
          Structured partner, no learning yet.
        </p>
      )}

      <div className="mt-3" onClick={(e) => e.stopPropagation()}>
        <StatusControl
          compact
          status={partner.status}
          closedReason={partner.closedReason}
          onChange={onStatus}
        />
      </div>
    </article>
  )
}
