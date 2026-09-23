import { useState, type ReactNode } from 'react'
import { formatDate } from '../lib/dates'
import { HYPOTHESIS_STATUSES } from '../lib/labels'
import { useStore } from '../store'
import type { Hypothesis } from '../types'
import { AddHypothesisModal } from './AddHypothesisModal'
import { AddPartnerModal } from './AddPartnerModal'
import { Button } from './Button'
import { OutcomeChip } from './OutcomeChip'
import { LogConversationModal } from './LogConversationModal'
import { StatusControl } from './StatusControl'

export function PartnerDetail({
  partnerId,
  onBack,
}: {
  partnerId: string
  onBack: () => void
}) {
  const {
    state,
    updatePartner,
    setPartnerStatus,
    addHypothesis,
    updateHypothesis,
    logConversation,
  } = useStore()
  const partner = state.partners.find((p) => p.id === partnerId)
  const [editPartner, setEditPartner] = useState(false)
  const [addHyp, setAddHyp] = useState(false)
  const [editHyp, setEditHyp] = useState<Hypothesis | null>(null)
  const [logConv, setLogConv] = useState(false)

  if (!partner) {
    return (
      <div className="mx-auto max-w-[880px] px-6 py-16">
        <p className="text-slate">This partner is no longer on the board.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-sm text-prussian hover:text-prussian-deep"
        >
          ← Back to board
        </button>
      </div>
    )
  }

  const hypotheses = state.hypotheses
    .filter((h) => h.partnerId === partner.id)
    .sort((a, b) => {
      if (a.status === 'open' && b.status !== 'open') return -1
      if (b.status === 'open' && a.status !== 'open') return 1
      return b.createdAt.localeCompare(a.createdAt)
    })
  const conversations = state.conversations
    .filter((c) => c.partnerId === partner.id)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
  const convIds = new Set(conversations.map((c) => c.id))
  const learnings = state.learnings.filter((l) => convIds.has(l.conversationId))
  const changes = learnings
    .filter((l) => l.nextProductChange)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="mx-auto max-w-[880px] px-6 pb-20 pt-8">
      <button
        type="button"
        onClick={onBack}
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate hover:text-ink"
      >
        ← Board
      </button>

      <header className="mt-5 border-b border-rule pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-[32px] font-semibold leading-tight tracking-tight text-ink">
              {partner.name}
            </h1>
            <p className="mt-1 text-slate">
              {partner.company}
              {partner.role ? ` · ${partner.role}` : ''}
            </p>
            {partner.linkedinUrl ? (
              <a
                href={partner.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-prussian hover:text-prussian-deep"
              >
                LinkedIn ↗
              </a>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <StatusControl
              status={partner.status}
              closedReason={partner.closedReason}
              onChange={(status, reason) =>
                setPartnerStatus(partner.id, status, reason)
              }
            />
            <Button variant="ghost" onClick={() => setEditPartner(true)}>
              Edit
            </Button>
          </div>
        </div>
        {partner.notes ? (
          <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-slate">
            {partner.notes}
          </p>
        ) : null}
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
          01 belief → 02 evidence → 03 change
        </p>
      </header>

      <Section
        index="01"
        title="Hypotheses"
        action={
          <Button onClick={() => setAddHyp(true)}>Add hypothesis</Button>
        }
      >
        {hypotheses.length === 0 ? (
          <Empty
            text="Write the belief this conversation is meant to test."
            cta="Add hypothesis"
            onClick={() => setAddHyp(true)}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {hypotheses.map((h) => (
              <li
                key={h.id}
                className="rounded-sm border border-rule bg-card p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="max-w-[62ch] font-serif text-[17px] leading-snug text-ink">
                    {h.text}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditHyp(h)}
                    className="shrink-0 text-xs text-slate hover:text-ink"
                  >
                    Edit
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {HYPOTHESIS_STATUSES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        updateHypothesis(h.id, { status: s.id })
                      }
                      className={`stamp ${
                        h.status === s.id
                          ? s.id === 'open'
                            ? 'bg-ink text-snow border-ink'
                            : s.id === 'validated'
                              ? 'bg-validated text-snow border-validated'
                              : s.id === 'invalidated'
                                ? 'bg-invalidated text-snow border-invalidated'
                                : 'bg-unclear text-snow border-unclear'
                          : 'bg-snow text-mist border-rule'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        index="02"
        title="Conversations"
        action={
          <Button onClick={() => setLogConv(true)}>Log conversation</Button>
        }
      >
        {conversations.length === 0 ? (
          <Empty
            text="A partner without a learning is just a note."
            cta="Log conversation"
            onClick={() => setLogConv(true)}
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {conversations.map((c, i) => {
              const items = learnings
                .filter((l) => l.conversationId === c.id)
                .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
              return (
                <li
                  key={c.id}
                  className={`${i === 0 ? 'ink-in' : ''} rounded-sm border border-rule bg-card p-4`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <time className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">
                      {formatDate(c.date)}
                    </time>
                    <span className="font-mono text-[11px] text-mist">
                      {items.length} {items.length === 1 ? 'learning' : 'learnings'}
                    </span>
                  </div>
                  <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-slate">
                    {c.notes}
                  </p>
                  <div className="mt-4 flex flex-col gap-3">
                    {items.map((l) => {
                      const hyp = hypotheses.find((h) => h.id === l.hypothesisId)
                      return (
                        <div
                          key={l.id}
                          className="border-t border-rule pt-3"
                        >
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <OutcomeChip outcome={l.outcome} />
                            {hyp ? (
                              <span className="text-xs text-mist">
                                on “{truncate(hyp.text, 72)}”
                              </span>
                            ) : null}
                          </div>
                          <p className="max-w-[62ch] font-serif text-[16px] leading-snug text-ink">
                            {l.text}
                          </p>
                          {l.nextProductChange ? (
                            <p className="mt-2 max-w-[62ch] text-sm leading-snug text-ink">
                              <span className="mr-1.5 font-serif text-prussian">
                                Δ
                              </span>
                              {l.nextProductChange}
                            </p>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Section>

      <Section index="03" title="Next product changes">
        {changes.length === 0 ? (
          <Empty
            text="After a conversation, capture the product change here."
            cta="Log conversation"
            onClick={() => setLogConv(true)}
          />
        ) : (
          <ol className="flex flex-col gap-3">
            {changes.map((l) => (
              <li
                key={l.id}
                className="flex gap-3 rounded-sm border border-prussian/20 bg-card px-4 py-3"
              >
                <span className="mt-0.5 font-serif text-lg leading-none text-prussian">
                  Δ
                </span>
                <div>
                  <p className="max-w-[62ch] text-[15px] leading-snug text-ink">
                    {l.nextProductChange}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-mist">
                    from a {l.outcome} learning
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      {editPartner ? (
        <AddPartnerModal
          partner={partner}
          onClose={() => setEditPartner(false)}
          onSave={(draft) => {
            updatePartner(partner.id, draft)
            setEditPartner(false)
          }}
        />
      ) : null}
      {addHyp ? (
        <AddHypothesisModal
          onClose={() => setAddHyp(false)}
          onSave={({ text }) => {
            addHypothesis(partner.id, text)
            setAddHyp(false)
          }}
        />
      ) : null}
      {editHyp ? (
        <AddHypothesisModal
          hypothesis={editHyp}
          onClose={() => setEditHyp(null)}
          onSave={({ text, status }) => {
            updateHypothesis(editHyp.id, { text, status })
            setEditHyp(null)
          }}
        />
      ) : null}
      {logConv ? (
        <LogConversationModal
          partnerName={partner.name}
          hypotheses={hypotheses}
          onClose={() => setLogConv(false)}
          onSave={(input) => {
            logConversation(partner.id, input)
            setLogConv(false)
          }}
        />
      ) : null}
    </div>
  )
}

function Section({
  index,
  title,
  action,
  children,
}: {
  index: string
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] text-prussian">{index}</span>
          <span className="font-serif text-xl font-semibold text-ink">{title}</span>
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function Empty({
  text,
  cta,
  onClick,
}: {
  text: string
  cta: string
  onClick: () => void
}) {
  return (
    <div className="rounded-sm border border-dashed border-rule bg-snow px-4 py-8 text-center">
      <p className="text-sm text-slate">{text}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-3 text-sm font-medium text-prussian hover:text-prussian-deep"
      >
        {cta}
      </button>
    </div>
  )
}

function truncate(text: string, n: number): string {
  return text.length > n ? `${text.slice(0, n)}…` : text
}
