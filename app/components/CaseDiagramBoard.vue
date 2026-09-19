<script setup lang="ts">
import type { CaseDiagram } from '~/data/caseDiagram'
import { layoutCaseDiagram } from '~/utils/caseDiagram'

const props = withDefaults(
  defineProps<{
    diagram: CaseDiagram
    /** Smaller geometry + type for home cards. */
    dense?: boolean
    /** Visible figcaption on case page; sr-only on cards. */
    caption?: 'sr' | 'visible'
  }>(),
  {
    dense: false,
    caption: 'sr',
  },
)

const laid = computed(() =>
  layoutCaseDiagram(props.diagram, { dense: props.dense }),
)

const markerId = useId()

const viewBoxAttr = computed(() => {
  const { x, y, w, h } = laid.value.viewBox
  return `${x} ${y} ${w} ${h}`
})

/** Cards: 320px frame, content centered via meet. Detail: 16:9 full width. */
const frameStyle = computed(() => {
  if (props.dense) {
    return { height: '320px', minHeight: '320px' }
  }
  return { aspectRatio: '16 / 9' }
})

function nodeLabelY(node: { y: number; h: number; detail?: string }) {
  return node.detail ? node.y + node.h * 0.38 : node.y + node.h / 2
}

function nodeDetailY(node: { y: number; h: number }) {
  return node.y + node.h * 0.68
}

const nodeLabelById = computed(() => {
  const map = new Map<string, string>()
  for (const node of props.diagram.nodes) {
    map.set(node.id, node.label)
  }
  return map
})

const structureItems = computed(() => {
  const items: string[] = []
  for (const node of props.diagram.nodes) {
    items.push(
      node.detail ? `${node.label} (${node.detail})` : node.label,
    )
  }
  for (const edge of props.diagram.edges) {
    const from = nodeLabelById.value.get(edge.from) ?? edge.from
    const to = nodeLabelById.value.get(edge.to) ?? edge.to
    const via = edge.label ? ` via ${edge.label}` : ''
    items.push(`${from} to ${to}${via}`)
  }
  return items
})
</script>

<template>
  <figure class="case-diagram">
    <div
      class="case-diagram-frame"
      :class="{ 'case-diagram-frame-detail': !dense }"
      :style="frameStyle"
    >
      <svg
        class="case-diagram-svg"
        :viewBox="viewBoxAttr"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <marker
            :id="markerId"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        <g class="case-diagram-edges">
          <path
            v-for="edge in laid.edges"
            :key="edge.key"
            :d="edge.d"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            opacity="0.35"
            :marker-end="`url(#${markerId})`"
          />
          <g
            v-for="edge in laid.edges.filter((item) => item.label)"
            :key="`${edge.key}-label`"
          >
            <rect
              :x="edge.labelX"
              :y="edge.labelY"
              :width="edge.labelW"
              :height="edge.labelH"
              rx="2"
              class="case-diagram-edge-bg"
            />
            <text
              :x="edge.labelX + edge.labelW / 2"
              :y="edge.labelY + edge.labelH / 2"
              text-anchor="middle"
              dominant-baseline="central"
              class="case-diagram-edge-label"
              :font-size="laid.type.edge"
            >
              {{ edge.label }}
            </text>
          </g>
        </g>

        <g
          v-for="node in laid.nodes"
          :key="node.id"
          class="case-diagram-node"
        >
          <rect
            :x="node.x"
            :y="node.y"
            :width="node.w"
            :height="node.h"
            rx="4"
            ry="4"
            class="case-diagram-node-bg"
          />
          <text
            :x="node.x + node.w / 2"
            :y="nodeLabelY(node)"
            text-anchor="middle"
            dominant-baseline="central"
            class="case-diagram-node-label"
            :font-size="laid.type.label"
          >
            {{ node.label }}
          </text>
          <text
            v-if="node.detail"
            :x="node.x + node.w / 2"
            :y="nodeDetailY(node)"
            text-anchor="middle"
            dominant-baseline="central"
            class="case-diagram-node-detail"
            :font-size="laid.type.detail"
          >
            {{ node.detail }}
          </text>
        </g>
      </svg>
    </div>

    <figcaption
      class="case-diagram-caption"
      :class="caption === 'sr' ? 'sr-only' : 'case-diagram-caption-text'"
    >
      {{ diagram.label }}
    </figcaption>

    <ul class="sr-only">
      <li
        v-for="(item, index) in structureItems"
        :key="index"
      >
        {{ item }}
      </li>
    </ul>
  </figure>
</template>

<style scoped>
.case-diagram {
  margin: 0;
  width: 100%;
  /* ink.DEFAULT */
  color: #1a1a1a;
  border: 1px solid rgb(26 26 26 / 0.12);
  border-radius: var(--radius);
  background-color: color-mix(in srgb, var(--bg-base) 55%, var(--bg-elevate));
}

.case-diagram-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
}

.case-diagram-frame-detail {
  width: 100%;
}

.case-diagram-svg {
  display: block;
  width: 100%;
  height: 100%;
}

.case-diagram-node-bg {
  fill: var(--bg-elevate, #fff);
  stroke: rgb(26 26 26 / 0.16);
  stroke-width: 0.75;
}

.case-diagram-node-label {
  font-weight: 600;
  fill: currentColor;
  pointer-events: none;
}

.case-diagram-node-detail {
  font-weight: 500;
  /* ink.mute */
  fill: #5c5c5c;
  pointer-events: none;
}

.case-diagram-edge-bg {
  fill: color-mix(in srgb, var(--bg-base) 70%, var(--bg-elevate));
  stroke: none;
}

.case-diagram-edge-label {
  font-weight: 600;
  /* ink.mute */
  fill: #5c5c5c;
  pointer-events: none;
}

.case-diagram-caption-text {
  margin: 0;
  padding: 0.5rem 0.75rem 0.625rem;
  border-top: 1px solid rgb(26 26 26 / 0.1);
  font-size: 0.8125rem;
  line-height: 1.4;
  /* ink.mute */
  color: #5c5c5c;
}
</style>
