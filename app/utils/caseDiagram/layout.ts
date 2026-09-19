import type {
  CaseDiagram,
  CaseDiagramNodeBase,
  FlowNode,
  HubNode,
  TriadNode,
  TriadSlot,
} from '~/data/caseDiagram'

export type LayoutOptions = {
  dense?: boolean
}

export type PlacedNode = CaseDiagramNodeBase & {
  x: number
  y: number
  w: number
  h: number
}

export type RoutedEdge = {
  key: string
  d: string
  label?: string
  labelX: number
  labelY: number
  labelW: number
  labelH: number
}

export type DiagramLayout = {
  viewBox: { x: number; y: number; w: number; h: number }
  nodes: PlacedNode[]
  edges: RoutedEdge[]
  /** Font sizes used for this layout (SVG paint). */
  type: {
    label: number
    detail: number
    edge: number
  }
}

type Point = { x: number; y: number }
type Rect = { x: number; y: number; w: number; h: number }

type Scale = {
  labelFont: number
  detailFont: number
  edgeFont: number
  padX: number
  padY: number
  minW: number
  maxW: number
  lineGap: number
  chipPadX: number
  chipPadY: number
  canvasW: number
  canvasH: number
}

function scaleFor(dense: boolean): Scale {
  if (dense) {
    return {
      labelFont: 8,
      detailFont: 6.5,
      edgeFont: 6.5,
      padX: 6,
      padY: 4,
      minW: 56,
      maxW: 92,
      lineGap: 1.5,
      chipPadX: 3,
      chipPadY: 1.5,
      canvasW: 320,
      canvasH: 180,
    }
  }
  return {
    // At max-w-hero (~42rem): labels ≈ 0.875rem, under 1rem body.
    labelFont: 10,
    detailFont: 8,
    edgeFont: 7.5,
    padX: 8,
    padY: 5,
    minW: 64,
    maxW: 104,
    lineGap: 2,
    chipPadX: 3.5,
    chipPadY: 2,
    canvasW: 480,
    canvasH: 270,
  }
}

/** Approximate system-ui glyph width at fontSize. */
function measureText(text: string, fontSize: number): number {
  return text.length * fontSize * 0.52
}

function nodeSize(
  node: CaseDiagramNodeBase,
  s: Scale,
): { w: number; h: number } {
  const labelW = measureText(node.label, s.labelFont)
  const detailW = node.detail ? measureText(node.detail, s.detailFont) : 0
  const contentW = Math.max(labelW, detailW)
  const w = Math.min(s.maxW, Math.max(s.minW, contentW + s.padX * 2))
  const lines = node.detail ? 2 : 1
  const textH =
    lines === 1
      ? s.labelFont
      : s.labelFont + s.lineGap + s.detailFont
  const h = textH + s.padY * 2
  // Cards/detail: nodes +25% for tap/read weight in the frame.
  return { w: w * 1.25, h: h * 1.25 }
}

function placeAt(
  node: CaseDiagramNodeBase,
  cx: number,
  cy: number,
  s: Scale,
): PlacedNode {
  const { w, h } = nodeSize(node, s)
  return {
    ...node,
    x: cx - w / 2,
    y: cy - h / 2,
    w,
    h,
  }
}

function center(node: PlacedNode): Point {
  return { x: node.x + node.w / 2, y: node.y + node.h / 2 }
}

/** Intersection of ray from center toward target with the node rectangle border. */
function borderPoint(node: PlacedNode, toward: Point): Point {
  const c = center(node)
  const dx = toward.x - c.x
  const dy = toward.y - c.y
  if (dx === 0 && dy === 0) return c

  const hw = node.w / 2
  const hh = node.h / 2
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  const scaleX = absDx < 1e-6 ? Infinity : hw / absDx
  const scaleY = absDy < 1e-6 ? Infinity : hh / absDy
  const t = Math.min(scaleX, scaleY)
  return { x: c.x + dx * t, y: c.y + dy * t }
}

function rectsOverlap(a: Rect, b: Rect, margin = 2): boolean {
  return !(
    a.x + a.w + margin <= b.x
    || b.x + b.w + margin <= a.x
    || a.y + a.h + margin <= b.y
    || b.y + b.h + margin <= a.y
  )
}

function chipSize(label: string, s: Scale): { w: number; h: number } {
  const w = measureText(label, s.edgeFont) + s.chipPadX * 2
  const h = s.edgeFont + s.chipPadY * 2
  return { w, h }
}

function layoutTriad(nodes: readonly TriadNode[], s: Scale): PlacedNode[] {
  const anchors: Record<TriadSlot, Point> = {
    north: { x: s.canvasW / 2, y: s.canvasH * 0.2 },
    center: { x: s.canvasW / 2, y: s.canvasH * 0.5 },
    southwest: { x: s.canvasW * 0.22, y: s.canvasH * 0.82 },
    southeast: { x: s.canvasW * 0.78, y: s.canvasH * 0.82 },
  }
  return nodes.map((node) =>
    placeAt(node, anchors[node.slot].x, anchors[node.slot].y, s),
  )
}

function layoutHub(nodes: readonly HubNode[], s: Scale): PlacedNode[] {
  const hub = nodes.find((node) => node.slot === 'hub')
  const spokes = nodes.filter((node) => node.slot === 'spoke')
  if (!hub) return []

  const placed: PlacedNode[] = [
    placeAt(hub, s.canvasW / 2, s.canvasH * 0.22, s),
  ]
  const count = spokes.length
  const xs =
    count === 2
      ? [s.canvasW * 0.28, s.canvasW * 0.72]
      : [s.canvasW * 0.18, s.canvasW * 0.5, s.canvasW * 0.82]
  const spokeY = s.canvasH * 0.78
  spokes.forEach((node, index) => {
    placed.push(placeAt(node, xs[index] ?? s.canvasW / 2, spokeY, s))
  })
  return placed
}

/** Top-to-bottom pipeline with max vertical separation (avoids cramped gaps). */
function layoutFlow(nodes: readonly FlowNode[], s: Scale): PlacedNode[] {
  const n = nodes.length
  const cx = s.canvasW / 2
  if (n === 0) return []
  if (n === 1) return [placeAt(nodes[0]!, cx, s.canvasH / 2, s)]

  const heights = nodes.map((node) => nodeSize(node, s).h)
  const maxH = Math.max(...heights)
  const edgePad = Math.max(8, maxH * 0.15)
  const top = edgePad + maxH / 2
  const bottom = s.canvasH - edgePad - maxH / 2
  const span = Math.max(bottom - top, maxH)

  return nodes.map((node, index) => {
    const t = index / (n - 1)
    return placeAt(node, cx, top + span * t, s)
  })
}

function routeEdges(
  diagram: CaseDiagram,
  placed: PlacedNode[],
  s: Scale,
): RoutedEdge[] {
  const byId = new Map(placed.map((node) => [node.id, node]))

  return diagram.edges
    .map((edge) => {
      const from = byId.get(edge.from)
      const to = byId.get(edge.to)
      if (!from || !to) return null

      const fromC = center(from)
      const toC = center(to)
      const p1 = borderPoint(from, toC)
      const p2 = borderPoint(to, fromC)
      const d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`

      if (!edge.label) {
        return {
          key: `${edge.from}-${edge.to}`,
          d,
          labelX: 0,
          labelY: 0,
          labelW: 0,
          labelH: 0,
        } satisfies RoutedEdge
      }

      const { w: labelW, h: labelH } = chipSize(edge.label, s)
      let labelX = (p1.x + p2.x) / 2 - labelW / 2
      let labelY = (p1.y + p2.y) / 2 - labelH / 2

      const chip: Rect = { x: labelX, y: labelY, w: labelW, h: labelH }
      const overlaps = placed.some((node) =>
        rectsOverlap(chip, { x: node.x, y: node.y, w: node.w, h: node.h }),
      )
      if (overlaps) {
        const dx = p2.x - p1.x
        const dy = p2.y - p1.y
        const len = Math.hypot(dx, dy) || 1
        const nx = -dy / len
        const ny = dx / len
        const nudge = labelH / 2 + 3
        labelX += nx * nudge
        labelY += ny * nudge
      }

      return {
        key: `${edge.from}-${edge.to}`,
        d,
        label: edge.label,
        labelX,
        labelY,
        labelW,
        labelH,
      } satisfies RoutedEdge
    })
    .filter((item): item is RoutedEdge => item !== null)
}

/**
 * Pure layout: measure nodes, route edges to borders.
 * viewBox is the fixed canvas so content stays zoomed out inside the frame.
 */
export function layoutCaseDiagram(
  diagram: CaseDiagram,
  options: LayoutOptions = {},
): DiagramLayout {
  const dense = options.dense ?? false
  const s = scaleFor(dense)

  let nodes: PlacedNode[]
  switch (diagram.layout) {
    case 'triad':
      nodes = layoutTriad(diagram.nodes, s)
      break
    case 'hub':
      nodes = layoutHub(diagram.nodes, s)
      break
    case 'flow':
      nodes = layoutFlow(diagram.nodes, s)
      break
    default: {
      const _exhaustive: never = diagram
      throw new Error(
        `[caseDiagram] unknown layout: ${(_exhaustive as CaseDiagram).layout}`,
      )
    }
  }

  const edges = routeEdges(diagram, nodes, s)

  return {
    viewBox: { x: 0, y: 0, w: s.canvasW, h: s.canvasH },
    nodes,
    edges,
    type: {
      label: s.labelFont,
      detail: s.detailFont,
      edge: s.edgeFont,
    },
  }
}
