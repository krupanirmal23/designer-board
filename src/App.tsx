import { useCallback, useEffect, useState } from 'react'
import { AddPartnerModal } from './components/AddPartnerModal'
import { Board } from './components/Board'
import { BootScreen } from './components/BootScreen'
import { Button } from './components/Button'
import { DeltaMark } from './components/LoopLoader'
import { Modal } from './components/Modal'
import { PartnerDetail } from './components/PartnerDetail'
import { PartnerDetailSkeleton, ResetOverlay } from './components/Skeletons'
import { wait } from './lib/wait'
import { useStore } from './store'

type Route = { name: 'board' } | { name: 'detail'; partnerId: string }

function parseRoute(): Route {
  const hash = window.location.hash.replace(/^#/, '') || '/'
  const match = hash.match(/^\/p\/([^/]+)/)
  if (match) return { name: 'detail', partnerId: match[1] }
  return { name: 'board' }
}

function goBoard() {
  window.location.hash = '#/'
}

function goPartner(id: string) {
  window.location.hash = `#/p/${id}`
}

export default function App() {
  const { addPartner, resetDemo } = useStore()
  const [route, setRoute] = useState<Route>(parseRoute)
  const [addOpen, setAddOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [booting, setBooting] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [resetBusy, setResetBusy] = useState(false)
  const [pageReady, setPageReady] = useState(true)

  const finishBoot = useCallback(() => setBooting(false), [])

  useEffect(() => {
    const onHash = () => setRoute(parseRoute())
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) window.location.hash = '#/'
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (route.name !== 'detail') {
      setPageReady(true)
      return
    }
    let cancelled = false
    setPageReady(false)
    void wait(280).then(() => {
      if (!cancelled) setPageReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [route])

  async function confirmReset() {
    setResetBusy(true)
    setResetOpen(false)
    setResetting(true)
    await wait(720)
    resetDemo()
    goBoard()
    setResetting(false)
    setResetBusy(false)
  }

  return (
    <div className="min-h-screen">
      {booting ? <BootScreen onDone={finishBoot} /> : null}
      {resetting ? <ResetOverlay /> : null}

      <div className={booting ? 'invisible' : 'rise'}>
        <header className="border-b border-rule border-t-[3px] border-t-prussian bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
            <button
              type="button"
              onClick={goBoard}
              className="flex items-center gap-3 text-left"
            >
              <span className="flex h-8 w-8 items-center justify-center bg-prussian text-snow">
                <DeltaMark />
              </span>
              <span>
                <span className="block font-serif text-[18px] font-semibold leading-none text-ink">
                  Design Partner Board
                </span>
                <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
                  hypothesis → evidence → change
                </span>
              </span>
            </button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setResetOpen(true)}>
                Reset demo
              </Button>
              <Button onClick={() => setAddOpen(true)}>Add partner</Button>
            </div>
          </div>
        </header>

        {route.name === 'board' ? (
          <Board onOpenPartner={goPartner} />
        ) : pageReady ? (
          <PartnerDetail partnerId={route.partnerId} onBack={goBoard} />
        ) : (
          <PartnerDetailSkeleton />
        )}
      </div>

      {addOpen ? (
        <AddPartnerModal
          onClose={() => setAddOpen(false)}
          onSave={(draft) => {
            const id = addPartner(draft)
            setAddOpen(false)
            goPartner(id)
          }}
        />
      ) : null}

      {resetOpen ? (
        <Modal
          title="Reset demo"
          subtitle="This replaces everything with the seeded partners. Your edits will be gone."
          onClose={() => setResetOpen(false)}
          busy={resetBusy}
        >
          <div className="flex justify-end gap-3">
            <Button variant="quiet" onClick={() => setResetOpen(false)}>
              Keep my data
            </Button>
            <Button
              onClick={() => void confirmReset()}
              busy={resetBusy}
              busyLabel="Restoring the seed…"
            >
              Reset to seed
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
