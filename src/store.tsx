import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { nowIso } from './lib/dates'
import { uid } from './lib/ids'
import { createSeed } from './seed'
import type {
  BoardState,
  ClosedReason,
  HypothesisStatus,
  LearningInput,
  PartnerDraft,
  PartnerStatus,
} from './types'

const STORAGE_KEY = 'design-partner-board.v1'

type Store = {
  state: BoardState
  resetDemo: () => void
  addPartner: (draft: PartnerDraft) => string
  updatePartner: (id: string, draft: PartnerDraft) => void
  setPartnerStatus: (
    id: string,
    status: PartnerStatus,
    closedReason: ClosedReason | null,
  ) => void
  addHypothesis: (partnerId: string, text: string) => void
  updateHypothesis: (
    id: string,
    patch: { text?: string; status?: HypothesisStatus },
  ) => void
  logConversation: (
    partnerId: string,
    input: { date: string; notes: string; learnings: LearningInput[] },
  ) => void
}

const StoreContext = createContext<Store | null>(null)

function loadState(): BoardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as BoardState
    if (
      !Array.isArray(parsed.partners) ||
      !Array.isArray(parsed.hypotheses) ||
      !Array.isArray(parsed.conversations) ||
      !Array.isArray(parsed.learnings)
    ) {
      return createSeed()
    }
    return parsed
  } catch {
    return createSeed()
  }
}

function persist(state: BoardState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function touchPartner(state: BoardState, partnerId: string): BoardState {
  const updatedAt = nowIso()
  return {
    ...state,
    partners: state.partners.map((p) =>
      p.id === partnerId ? { ...p, updatedAt } : p,
    ),
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BoardState>(loadState)

  const mutate = useCallback((fn: (prev: BoardState) => BoardState) => {
    setState((prev) => {
      const next = fn(prev)
      persist(next)
      return next
    })
  }, [])

  const resetDemo = useCallback(() => {
    const seed = createSeed()
    persist(seed)
    setState(seed)
  }, [])

  const addPartner = useCallback(
    (draft: PartnerDraft) => {
      const id = uid()
      const ts = nowIso()
      const closedReason = draft.status === 'closed' ? draft.closedReason : null
      mutate((prev) => ({
        ...prev,
        partners: [
          {
            id,
            name: draft.name.trim(),
            company: draft.company.trim(),
            role: draft.role.trim(),
            linkedinUrl: draft.linkedinUrl.trim(),
            notes: draft.notes.trim(),
            status: draft.status,
            closedReason,
            createdAt: ts,
            updatedAt: ts,
          },
          ...prev.partners,
        ],
      }))
      return id
    },
    [mutate],
  )

  const updatePartner = useCallback(
    (id: string, draft: PartnerDraft) => {
      const ts = nowIso()
      const closedReason = draft.status === 'closed' ? draft.closedReason : null
      mutate((prev) => ({
        ...prev,
        partners: prev.partners.map((p) =>
          p.id === id
            ? {
                ...p,
                name: draft.name.trim(),
                company: draft.company.trim(),
                role: draft.role.trim(),
                linkedinUrl: draft.linkedinUrl.trim(),
                notes: draft.notes.trim(),
                status: draft.status,
                closedReason,
                updatedAt: ts,
              }
            : p,
        ),
      }))
    },
    [mutate],
  )

  const setPartnerStatus = useCallback(
    (
      id: string,
      status: PartnerStatus,
      closedReason: ClosedReason | null,
    ) => {
      const ts = nowIso()
      mutate((prev) => ({
        ...prev,
        partners: prev.partners.map((p) =>
          p.id === id
            ? {
                ...p,
                status,
                closedReason: status === 'closed' ? closedReason : null,
                updatedAt: ts,
              }
            : p,
        ),
      }))
    },
    [mutate],
  )

  const addHypothesis = useCallback(
    (partnerId: string, text: string) => {
      const ts = nowIso()
      mutate((prev) =>
        touchPartner(
          {
            ...prev,
            hypotheses: [
              {
                id: uid(),
                partnerId,
                text: text.trim(),
                status: 'open',
                createdAt: ts,
                updatedAt: ts,
              },
              ...prev.hypotheses,
            ],
          },
          partnerId,
        ),
      )
    },
    [mutate],
  )

  const updateHypothesis = useCallback(
    (id: string, patch: { text?: string; status?: HypothesisStatus }) => {
      const ts = nowIso()
      mutate((prev) => {
        const current = prev.hypotheses.find((h) => h.id === id)
        if (!current) return prev
        return touchPartner(
          {
            ...prev,
            hypotheses: prev.hypotheses.map((h) =>
              h.id === id
                ? {
                    ...h,
                    text: patch.text !== undefined ? patch.text.trim() : h.text,
                    status: patch.status ?? h.status,
                    updatedAt: ts,
                  }
                : h,
            ),
          },
          current.partnerId,
        )
      })
    },
    [mutate],
  )

  const logConversation = useCallback(
    (
      partnerId: string,
      input: { date: string; notes: string; learnings: LearningInput[] },
    ) => {
      const ts = nowIso()
      const conversationId = uid()
      const newLearnings = input.learnings.map((l, i) => ({
        id: uid(),
        conversationId,
        hypothesisId: l.hypothesisId,
        text: l.text.trim(),
        outcome: l.outcome,
        nextProductChange: l.nextProductChange.trim(),
        createdAt: new Date(Date.parse(ts) + i).toISOString(),
      }))

      const hypothesisUpdates = new Map<string, HypothesisStatus>()
      for (const l of newLearnings) {
        if (l.hypothesisId) hypothesisUpdates.set(l.hypothesisId, l.outcome)
      }

      mutate((prev) =>
        touchPartner(
          {
            ...prev,
            conversations: [
              {
                id: conversationId,
                partnerId,
                date: input.date,
                notes: input.notes.trim(),
                createdAt: ts,
              },
              ...prev.conversations,
            ],
            learnings: [...newLearnings, ...prev.learnings],
            hypotheses: prev.hypotheses.map((h) => {
              const status = hypothesisUpdates.get(h.id)
              if (!status) return h
              return { ...h, status, updatedAt: ts }
            }),
          },
          partnerId,
        ),
      )
    },
    [mutate],
  )

  const value = useMemo(
    () => ({
      state,
      resetDemo,
      addPartner,
      updatePartner,
      setPartnerStatus,
      addHypothesis,
      updateHypothesis,
      logConversation,
    }),
    [
      state,
      resetDemo,
      addPartner,
      updatePartner,
      setPartnerStatus,
      addHypothesis,
      updateHypothesis,
      logConversation,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
