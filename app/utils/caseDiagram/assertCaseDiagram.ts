import type {
  CaseDiagram,
  CaseDiagramEdge,
  CaseDiagramFlow,
  CaseDiagramHub,
  CaseDiagramTriad,
  HubNode,
  TriadSlot,
} from '~/data/caseDiagram'
import { CASE_DIAGRAM_LIMITS } from '~/data/caseDiagram'

const TRIAD_SLOTS: readonly TriadSlot[] = [
  'north',
  'center',
  'southwest',
  'southeast',
]

function assertUniqueIds(nodes: readonly { id: string }[], context: string) {
  const seen = new Set<string>()
  for (const node of nodes) {
    if (seen.has(node.id)) {
      throw new Error(`[caseDiagram] ${context}: duplicate node id "${node.id}"`)
    }
    seen.add(node.id)
  }
}

function assertEdges(
  nodes: readonly { id: string }[],
  edges: readonly CaseDiagramEdge[],
  context: string,
) {
  const ids = new Set(nodes.map((node) => node.id))
  for (const edge of edges) {
    if (!ids.has(edge.from)) {
      throw new Error(
        `[caseDiagram] ${context}: edge.from "${edge.from}" is not a node id`,
      )
    }
    if (!ids.has(edge.to)) {
      throw new Error(
        `[caseDiagram] ${context}: edge.to "${edge.to}" is not a node id`,
      )
    }
  }
}

function warnLengths(diagram: CaseDiagram, context: string) {
  if (!import.meta.dev) return
  const { labelChars, detailChars, edgeChars, maxNodes } = CASE_DIAGRAM_LIMITS
  if (diagram.nodes.length > maxNodes) {
    console.warn(
      `[caseDiagram] ${context}: ${diagram.nodes.length} nodes (soft max ${maxNodes})`,
    )
  }
  for (const node of diagram.nodes) {
    if (node.label.length > labelChars) {
      console.warn(
        `[caseDiagram] ${context}: node "${node.id}" label length ${node.label.length} (soft max ${labelChars})`,
      )
    }
    if (node.detail && node.detail.length > detailChars) {
      console.warn(
        `[caseDiagram] ${context}: node "${node.id}" detail length ${node.detail.length} (soft max ${detailChars})`,
      )
    }
  }
  for (const edge of diagram.edges) {
    if (edge.label && edge.label.length > edgeChars) {
      console.warn(
        `[caseDiagram] ${context}: edge ${edge.from}->${edge.to} label length ${edge.label.length} (soft max ${edgeChars})`,
      )
    }
  }
}

function assertTriad(diagram: CaseDiagramTriad, context: string) {
  if (diagram.nodes.length !== 4) {
    throw new Error(
      `[caseDiagram] ${context}: triad requires exactly 4 nodes (got ${diagram.nodes.length})`,
    )
  }
  const slots = new Set(diagram.nodes.map((node) => node.slot))
  for (const slot of TRIAD_SLOTS) {
    if (!slots.has(slot)) {
      throw new Error(`[caseDiagram] ${context}: triad missing slot "${slot}"`)
    }
  }
  if (slots.size !== 4) {
    throw new Error(`[caseDiagram] ${context}: triad slots must be unique`)
  }
  assertUniqueIds(diagram.nodes, context)
  assertEdges(diagram.nodes, diagram.edges, context)
}

function assertHub(diagram: CaseDiagramHub, context: string) {
  const hubs = diagram.nodes.filter((node): node is HubNode => node.slot === 'hub')
  const spokes = diagram.nodes.filter((node) => node.slot === 'spoke')
  if (hubs.length !== 1) {
    throw new Error(
      `[caseDiagram] ${context}: hub layout requires exactly one hub node (got ${hubs.length})`,
    )
  }
  if (spokes.length < 2 || spokes.length > 3) {
    throw new Error(
      `[caseDiagram] ${context}: hub layout requires 2-3 spokes (got ${spokes.length})`,
    )
  }
  if (diagram.nodes.length !== hubs.length + spokes.length) {
    throw new Error(
      `[caseDiagram] ${context}: hub nodes must use only hub|spoke slots`,
    )
  }
  assertUniqueIds(diagram.nodes, context)
  assertEdges(diagram.nodes, diagram.edges, context)
}

function assertFlow(diagram: CaseDiagramFlow, context: string) {
  if (diagram.nodes.length < 2 || diagram.nodes.length > 4) {
    throw new Error(
      `[caseDiagram] ${context}: flow requires 2-4 nodes (got ${diagram.nodes.length})`,
    )
  }
  assertUniqueIds(diagram.nodes, context)
  assertEdges(diagram.nodes, diagram.edges, context)
}

/**
 * Validate layout invariants. Returns the same diagram for fluent authoring.
 * Soft char limits warn in dev only.
 */
export function assertCaseDiagram<T extends CaseDiagram>(
  diagram: T,
  context = diagram.layout,
): T {
  switch (diagram.layout) {
    case 'triad':
      assertTriad(diagram, context)
      break
    case 'hub':
      assertHub(diagram, context)
      break
    case 'flow':
      assertFlow(diagram, context)
      break
    default: {
      const _exhaustive: never = diagram
      throw new Error(`[caseDiagram] unknown layout: ${(_exhaustive as CaseDiagram).layout}`)
    }
  }
  warnLengths(diagram, context)
  return diagram
}
