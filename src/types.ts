export type PartnerStatus = 'prospect' | 'talking' | 'active' | 'closed'
export type ClosedReason = 'won' | 'lost' | 'paused'
export type HypothesisStatus = 'open' | 'validated' | 'invalidated' | 'unclear'
export type LearningOutcome = 'validated' | 'invalidated' | 'unclear'

export type Partner = {
  id: string
  name: string
  company: string
  role: string
  linkedinUrl: string
  notes: string
  status: PartnerStatus
  closedReason: ClosedReason | null
  createdAt: string
  updatedAt: string
}

export type Hypothesis = {
  id: string
  partnerId: string
  text: string
  status: HypothesisStatus
  createdAt: string
  updatedAt: string
}

export type Conversation = {
  id: string
  partnerId: string
  date: string
  notes: string
  createdAt: string
}

export type Learning = {
  id: string
  conversationId: string
  hypothesisId: string | null
  text: string
  outcome: LearningOutcome
  nextProductChange: string
  createdAt: string
}

export type BoardState = {
  partners: Partner[]
  hypotheses: Hypothesis[]
  conversations: Conversation[]
  learnings: Learning[]
}

export type LearningInput = {
  text: string
  hypothesisId: string | null
  outcome: LearningOutcome
  nextProductChange: string
}

export type PartnerDraft = {
  name: string
  company: string
  role: string
  linkedinUrl: string
  notes: string
  status: PartnerStatus
  closedReason: ClosedReason | null
}
