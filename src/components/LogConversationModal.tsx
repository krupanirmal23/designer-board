import { useState, type FormEvent } from 'react'
import { todayIsoDate } from '../lib/dates'
import { uid } from '../lib/ids'
import { OUTCOMES } from '../lib/labels'
import { wait } from '../lib/wait'
import type { Hypothesis, LearningInput, LearningOutcome } from '../types'
import { Button } from './Button'
import { Field, inputClass, textareaClass } from './Field'
import { Modal } from './Modal'

type Draft = {
  key: string
  text: string
  hypothesisId: string
  outcome: LearningOutcome | null
  nextProductChange: string
}

function emptyDraft(): Draft {
  return {
    key: uid(),
    text: '',
    hypothesisId: '',
    outcome: null,
    nextProductChange: '',
  }
}

export function LogConversationModal({
  partnerName,
  hypotheses,
  onClose,
  onSave,
}: {
  partnerName: string
  hypotheses: Hypothesis[]
  onClose: () => void
  onSave: (input: {
    date: string
    notes: string
    learnings: LearningInput[]
  }) => void
}) {
  const [date, setDate] = useState(todayIsoDate())
  const [notes, setNotes] = useState('')
  const [learnings, setLearnings] = useState<Draft[]>([emptyDraft()])
  const [errors, setErrors] = useState<{
    notes?: string
    date?: string
    learnings?: string
    rows?: Record<string, string>
  }>({})
  const [busy, setBusy] = useState(false)

  function update(key: string, patch: Partial<Draft>) {
    setLearnings((rows) =>
      rows.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    )
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const rowErrors: Record<string, string> = {}
    for (const row of learnings) {
      if (!row.text.trim() || !row.outcome) {
        rowErrors[row.key] = !row.text.trim()
          ? 'Learning text is required.'
          : 'Choose an outcome.'
      }
    }
    const next = {
      date: date ? undefined : 'Date is required.',
      notes: notes.trim() ? undefined : 'Notes are required.',
      learnings: learnings.length === 0 ? 'Add at least one learning.' : undefined,
      rows: Object.keys(rowErrors).length ? rowErrors : undefined,
    }
    setErrors(next)
    if (next.date || next.notes || next.learnings || next.rows) return

    setBusy(true)
    await wait(480)
    onSave({
      date,
      notes: notes.trim(),
      learnings: learnings.map((row) => ({
        text: row.text.trim(),
        hypothesisId: row.hypothesisId || null,
        outcome: row.outcome as LearningOutcome,
        nextProductChange: row.nextProductChange.trim(),
      })),
    })
  }

  const missingChange = learnings.every((l) => !l.nextProductChange.trim())

  return (
    <Modal
      title="Log conversation"
      subtitle={`With ${partnerName}. Capture the judgment, not just the notes.`}
      onClose={onClose}
      wide
      busy={busy}
    >
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="grid grid-cols-[160px_1fr] gap-4">
          <Field label="Date" htmlFor="conv-date" error={errors.date}>
            <input
              id="conv-date"
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="Notes" htmlFor="conv-notes" error={errors.notes}>
            <textarea
              id="conv-notes"
              className={`${textareaClass} min-h-[72px]`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What was said. Keep this observational."
            />
          </Field>
        </div>

        <div className="border-t border-rule pt-5">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-lg font-semibold text-ink">
              What did you learn?
            </h3>
            <button
              type="button"
              disabled={busy}
              onClick={() => setLearnings((rows) => [...rows, emptyDraft()])}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-prussian hover:text-prussian-deep disabled:opacity-50"
            >
              + Add learning
            </button>
          </div>
          {errors.learnings ? (
            <p className="mb-3 text-sm text-invalidated">{errors.learnings}</p>
          ) : null}

          <div className="flex flex-col gap-4">
            {learnings.map((row, i) => (
              <div
                key={row.key}
                className="rounded-sm border border-rule bg-snow p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">
                    Learning {String(i + 1).padStart(2, '0')}
                  </span>
                  {learnings.length > 1 ? (
                    <button
                      type="button"
                      className="text-xs text-slate hover:text-invalidated"
                      onClick={() =>
                        setLearnings((rows) => rows.filter((r) => r.key !== row.key))
                      }
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <textarea
                  className={`${textareaClass} min-h-[80px] bg-card font-serif`}
                  value={row.text}
                  onChange={(e) => update(row.key, { text: e.target.value })}
                  placeholder="The judgment this conversation supports or kills."
                />
                {errors.rows?.[row.key] && !row.text.trim() ? (
                  <p className="mt-1.5 text-sm text-invalidated">
                    {errors.rows[row.key]}
                  </p>
                ) : null}

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Field label="Linked hypothesis">
                    <select
                      className={inputClass}
                      value={row.hypothesisId}
                      onChange={(e) =>
                        update(row.key, { hypothesisId: e.target.value })
                      }
                    >
                      <option value="">None</option>
                      {hypotheses.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.text.length > 80 ? `${h.text.slice(0, 80)}…` : h.text}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Outcome">
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {OUTCOMES.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => update(row.key, { outcome: o.id })}
                          className={`stamp ${
                            row.outcome === o.id
                              ? o.id === 'validated'
                                ? 'bg-validated text-snow border-validated'
                                : o.id === 'invalidated'
                                  ? 'bg-invalidated text-snow border-invalidated'
                                  : 'bg-unclear text-snow border-unclear'
                              : 'bg-card text-slate border-rule'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                    {errors.rows?.[row.key] && row.text.trim() && !row.outcome ? (
                      <p className="mt-1.5 text-sm text-invalidated">
                        {errors.rows[row.key]}
                      </p>
                    ) : null}
                  </Field>
                </div>

                <div className="mt-3">
                  <Field
                    label="Next product change"
                    htmlFor={`change-${row.key}`}
                  >
                    <input
                      id={`change-${row.key}`}
                      className={`${inputClass} bg-card`}
                      value={row.nextProductChange}
                      onChange={(e) =>
                        update(row.key, { nextProductChange: e.target.value })
                      }
                      placeholder="Require manual outcome tags. Drop auto-summaries."
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          {missingChange ? (
            <p className="mt-3 border-l-2 border-unclear bg-unclear-bg/60 px-3 py-2 text-sm text-ink">
              What will you change in the product because of this? You can save
              without it — the nudge is the point.
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-rule pt-4">
          <Button variant="quiet" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            type="submit"
            busy={busy}
            busyLabel="Recording the judgment…"
          >
            Save learning
          </Button>
        </div>
      </form>
    </Modal>
  )
}
