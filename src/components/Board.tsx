import type { DragEvent } from 'react'
import { STATUS_COLUMNS } from '../lib/labels'
import { useStore } from '../store'
import type { ClosedReason, PartnerStatus } from '../types'
import { PartnerCard } from './PartnerCard'

export function Board({
  onOpenPartner,
}: {
  onOpenPartner: (id: string) => void
}) {
  const { state, setPartnerStatus } = useStore()
  const openHyps = state.hypotheses.filter((h) => h.status === 'open').length
  const changes = state.learnings.filter((l) => l.nextProductChange).length

  function onDropColumn(status: PartnerStatus, e: DragEvent) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/partner-id')
    if (!id) return
    const partner = state.partners.find((p) => p.id === id)
    if (!partner) return
    if (status === 'closed') {
      const reason: ClosedReason = partner.closedReason ?? 'paused'
      setPartnerStatus(id, 'closed', reason)
      return
    }
    setPartnerStatus(id, status, null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-5 py-2.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">
          {state.partners.length} partners
          <span className="mx-2 text-rule">·</span>
          {openHyps} open {openHyps === 1 ? 'hypothesis' : 'hypotheses'}
          <span className="mx-2 text-rule">·</span>
          {state.conversations.length}{' '}
          {state.conversations.length === 1 ? 'conversation' : 'conversations'}
          <span className="mx-2 text-rule">·</span>
          {changes} product {changes === 1 ? 'change' : 'changes'}
        </p>
        <p className="text-sm text-slate">
          Drag a card to move status. The stamp is the learning, not the stage.
        </p>
      </div>
      <div className="grid min-h-[calc(100vh-11rem)] grid-cols-1 gap-0 px-2 md:grid-cols-4">
      {STATUS_COLUMNS.map((col, i) => {
        const partners = state.partners
          .filter((p) => p.status === col.id)
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        return (
          <section
            key={col.id}
            className={`flex min-h-[420px] flex-col px-3 py-4 ${
              i < STATUS_COLUMNS.length - 1 ? 'md:border-r md:border-rule' : ''
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
            }}
            onDrop={(e) => onDropColumn(col.id, e)}
          >
            <header className="mb-3 flex items-baseline justify-between px-1">
              <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-slate">
                {col.label}
              </h2>
              <span className="font-mono text-[11px] text-mist">
                {String(partners.length).padStart(2, '0')}
              </span>
            </header>
            <div className="flex flex-1 flex-col gap-3">
              {partners.length === 0 ? (
                <p className="px-1 pt-6 text-sm text-mist">No one here.</p>
              ) : (
                partners.map((partner, i) => {
                  const hypotheses = state.hypotheses.filter(
                    (h) => h.partnerId === partner.id,
                  )
                  const conversations = state.conversations.filter(
                    (c) => c.partnerId === partner.id,
                  )
                  const convIds = new Set(conversations.map((c) => c.id))
                  const learnings = state.learnings.filter((l) =>
                    convIds.has(l.conversationId),
                  )
                  return (
                    <PartnerCard
                      key={partner.id}
                      partner={partner}
                      hypotheses={hypotheses}
                      conversations={conversations}
                      learnings={learnings}
                      index={i}
                      onOpen={() => onOpenPartner(partner.id)}
                      onStatus={(status, reason) =>
                        setPartnerStatus(partner.id, status, reason)
                      }
                    />
                  )
                })
              )}
            </div>
          </section>
        )
      })}
      </div>
    </div>
  )
}
