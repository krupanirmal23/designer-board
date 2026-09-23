import { useState, type FormEvent } from 'react'
import { wait } from '../lib/wait'
import type { ClosedReason, Partner, PartnerDraft, PartnerStatus } from '../types'
import { Button } from './Button'
import { Field, inputClass, textareaClass } from './Field'
import { Modal } from './Modal'
import { StatusControl } from './StatusControl'

const emptyDraft: PartnerDraft = {
  name: '',
  company: '',
  role: '',
  linkedinUrl: '',
  notes: '',
  status: 'prospect',
  closedReason: null,
}

function fromPartner(p: Partner): PartnerDraft {
  return {
    name: p.name,
    company: p.company,
    role: p.role,
    linkedinUrl: p.linkedinUrl,
    notes: p.notes,
    status: p.status,
    closedReason: p.closedReason,
  }
}

export function AddPartnerModal({
  partner,
  onClose,
  onSave,
}: {
  partner?: Partner
  onClose: () => void
  onSave: (draft: PartnerDraft) => void
}) {
  const [draft, setDraft] = useState<PartnerDraft>(
    partner ? fromPartner(partner) : emptyDraft,
  )
  const [errors, setErrors] = useState<{ name?: string; company?: string }>({})
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!draft.name.trim()) next.name = 'Name is required.'
    if (!draft.company.trim()) next.company = 'Company is required.'
    setErrors(next)
    if (next.name || next.company) return
    setBusy(true)
    await wait(380)
    onSave(draft)
  }

  const editing = Boolean(partner)

  return (
    <Modal
      title={editing ? 'Edit partner' : 'Add partner'}
      subtitle={
        editing
          ? 'Update who you are learning from.'
          : 'Someone you are learning from while shaping the product.'
      }
      onClose={onClose}
      busy={busy}
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Name" htmlFor="partner-name" error={errors.name}>
          <input
            id="partner-name"
            className={inputClass}
            autoFocus
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Maya Chen"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Company" htmlFor="partner-company" error={errors.company}>
            <input
              id="partner-company"
              className={inputClass}
              value={draft.company}
              onChange={(e) => setDraft({ ...draft, company: e.target.value })}
              placeholder="Northline"
            />
          </Field>
          <Field label="Role" htmlFor="partner-role">
            <input
              id="partner-role"
              className={inputClass}
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              placeholder="Platform Eng Manager"
            />
          </Field>
        </div>
        <Field label="LinkedIn URL" htmlFor="partner-linkedin">
          <input
            id="partner-linkedin"
            className={inputClass}
            value={draft.linkedinUrl}
            onChange={(e) => setDraft({ ...draft, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/…"
          />
        </Field>
        <Field label="Status">
          <StatusControl
            status={draft.status}
            closedReason={draft.closedReason}
            onChange={(status: PartnerStatus, closedReason: ClosedReason | null) =>
              setDraft({ ...draft, status, closedReason })
            }
          />
        </Field>
        <Field label="Notes" htmlFor="partner-notes">
          <textarea
            id="partner-notes"
            className={textareaClass}
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            placeholder="Context that does not belong on a learning yet."
          />
        </Field>
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="quiet" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            type="submit"
            busy={busy}
            busyLabel={editing ? 'Saving partner…' : 'Adding to the board…'}
          >
            {editing ? 'Save partner' : 'Add partner'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
