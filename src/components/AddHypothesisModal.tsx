import { useState, type FormEvent } from 'react'
import { HYPOTHESIS_STATUSES } from '../lib/labels'
import { wait } from '../lib/wait'
import type { Hypothesis, HypothesisStatus } from '../types'
import { Button } from './Button'
import { Field, textareaClass } from './Field'
import { Modal } from './Modal'

const MAX = 280

export function AddHypothesisModal({
  hypothesis,
  onClose,
  onSave,
}: {
  hypothesis?: Hypothesis
  onClose: () => void
  onSave: (input: { text: string; status: HypothesisStatus }) => void
}) {
  const [text, setText] = useState(hypothesis?.text ?? '')
  const [status, setStatus] = useState<HypothesisStatus>(
    hypothesis?.status ?? 'open',
  )
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const editing = Boolean(hypothesis)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      setError('Write the belief this conversation is meant to test.')
      return
    }
    if (trimmed.length > MAX) {
      setError(`Keep it to ${MAX} characters.`)
      return
    }
    setBusy(true)
    await wait(360)
    onSave({ text: trimmed, status })
  }

  return (
    <Modal
      title={editing ? 'Edit hypothesis' : 'Add hypothesis'}
      subtitle="A short, testable belief — not a feature request."
      onClose={onClose}
      busy={busy}
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Hypothesis" htmlFor="hyp-text" error={error}>
          <textarea
            id="hyp-text"
            className={`${textareaClass} font-serif text-[17px]`}
            autoFocus
            maxLength={MAX}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (error) setError('')
            }}
            placeholder="SREs will share raw Slack incident threads if the output is a structured learning log."
          />
          <span className="mt-1.5 block text-right font-mono text-[11px] text-mist">
            {text.trim().length}/{MAX}
          </span>
        </Field>
        {editing ? (
          <Field label="Status">
            <div className="flex flex-wrap gap-2">
              {HYPOTHESIS_STATUSES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id)}
                  className={`stamp ${
                    status === s.id
                      ? s.id === 'open'
                        ? 'bg-ink text-snow border-ink'
                        : s.id === 'validated'
                          ? 'bg-validated text-snow border-validated'
                          : s.id === 'invalidated'
                            ? 'bg-invalidated text-snow border-invalidated'
                            : 'bg-unclear text-snow border-unclear'
                      : 'bg-snow text-slate border-rule'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Field>
        ) : (
          <p className="text-sm text-slate">
            Status starts as <span className="font-medium text-ink">Open</span>.
            Update it after a conversation — or let a learning do it.
          </p>
        )}
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="quiet" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            type="submit"
            busy={busy}
            busyLabel={editing ? 'Saving hypothesis…' : 'Writing the belief…'}
          >
            {editing ? 'Save hypothesis' : 'Add hypothesis'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
