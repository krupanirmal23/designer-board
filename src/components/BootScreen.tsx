import { useEffect, useState } from 'react'
import { prefersReducedMotion, wait } from '../lib/wait'
import { DeltaMark, LoopLoader } from './LoopLoader'

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      const reduced = prefersReducedMotion()
      await wait(reduced ? 0 : 1200)
      if (cancelled) return
      setLeaving(true)
      await wait(reduced ? 0 : 280)
      if (!cancelled) onDone()
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[80] flex flex-col items-center justify-center bg-paper ${
        leaving ? 'boot-leave' : ''
      }`}
      role="status"
      aria-live="polite"
      aria-label="Opening the ledger"
    >
      <div className="boot-mark flex h-11 w-11 items-center justify-center bg-prussian text-snow">
        <DeltaMark size={18} />
      </div>
      <p className="boot-title mt-6 font-serif text-[28px] font-semibold tracking-tight text-ink">
        Design Partner Board
      </p>
      <ol className="mt-8 flex items-center gap-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
        <li className="boot-step">Hypothesis</li>
        <li className="text-rule" aria-hidden>
          →
        </li>
        <li className="boot-step boot-step-2">Evidence</li>
        <li className="text-rule" aria-hidden>
          →
        </li>
        <li className="boot-step boot-step-3">Change</li>
      </ol>
      <p className="mt-10 text-sm text-slate">
        <LoopLoader label="Opening the ledger" />
      </p>
    </div>
  )
}
