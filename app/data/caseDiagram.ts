/**
 * Abstract product / role map for NDA media (no client UI).
 * Human contract: `docs/case-diagrams.md`
 */

export type CaseDiagramLayout = 'triad' | 'flow' | 'hub'

export type CaseDiagramEdge = {
  from: string
  to: string
  /** Optional mid-edge caption (auth, pay, realtime, …). */
  label?: string
}

export type CaseDiagramNodeBase = {
  id: string
  /** Primary line - prefer a job verb over a role noun. */
  label: string
  /** Optional second line (role or stack hint). */
  detail?: string
}

export type TriadSlot = 'north' | 'center' | 'southwest' | 'southeast'
export type HubSlot = 'hub' | 'spoke'

export type TriadNode = CaseDiagramNodeBase & { slot: TriadSlot }
export type HubNode = CaseDiagramNodeBase & { slot: HubSlot }
export type FlowNode = CaseDiagramNodeBase

export type CaseDiagramTriad = {
  /** Accessible name for the figure. */
  label: string
  layout: 'triad'
  nodes: readonly TriadNode[]
  edges: readonly CaseDiagramEdge[]
}

export type CaseDiagramHub = {
  label: string
  layout: 'hub'
  nodes: readonly HubNode[]
  edges: readonly CaseDiagramEdge[]
}

export type CaseDiagramFlow = {
  label: string
  layout: 'flow'
  nodes: readonly FlowNode[]
  edges: readonly CaseDiagramEdge[]
}

export type CaseDiagram = CaseDiagramTriad | CaseDiagramHub | CaseDiagramFlow

/** Soft authoring limits (dev warnings). */
export const CASE_DIAGRAM_LIMITS = {
  maxNodes: 4,
  labelChars: 22,
  detailChars: 18,
  edgeChars: 16,
} as const
