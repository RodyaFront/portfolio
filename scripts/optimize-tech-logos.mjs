/**
 * Download tech logo sources, emit:
 * - source.svg   (original artwork for tooltips, no baked background)
 * - 32 / 64 / 128.webp (inline marks, same rounding for fill and glyph logos)
 *
 * Usage: node scripts/optimize-tech-logos.mjs
 */
import { access, mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const sourceDir = path.join(root, 'assets', 'tech', 'source')
const outDir = path.join(root, 'public', 'tech')

const SIZES = [32, 64, 128]
const SOURCE_SIZE = 256
const RADIUS_RATIO = 0.18
const PAD_RATIO = 0.14

/**
 * fill: square brand badge - edge to edge (flatten onto brand color).
 * mark: glyph on transparent - padded tile for inline; SVG source for tooltips.
 * local: prefer assets/tech/source/{id}.svg when present.
 */
const sources = [
  {
    id: 'typescript',
    local: 'typescript.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg',
    fill: true,
    color: '#3178c6',
  },
  {
    id: 'vue',
    local: 'vue.svg',
    url: 'https://cdn.simpleicons.org/vuedotjs/42B883',
    fill: false,
  },
  {
    id: 'nuxt',
    local: 'nuxt.svg',
    url: 'https://nuxt.com/assets/design-kit/icon-green.svg',
    fill: false,
  },
  {
    id: 'javascript',
    local: 'javascript.svg',
    url: 'https://cdn.simpleicons.org/javascript/F7DF1E',
    fill: true,
    // Simple Icons JS is a yellow square with transparent letter cutouts.
    // Flatten through the holes so letters read as black on yellow.
    color: '#000000',
  },
  { id: 'react', local: 'react.svg', url: 'https://cdn.simpleicons.org/react/61DAFB', fill: false },
  { id: 'nextjs', local: 'nextjs.svg', url: 'https://cdn.simpleicons.org/nextdotjs/000000', fill: false },
  { id: 'pinia', local: 'pinia.svg', url: 'https://pinia.vuejs.org/logo.svg', fill: false },
  { id: 'tailwind', local: 'tailwind.svg', url: 'https://cdn.simpleicons.org/tailwindcss/06B6D4', fill: false },
  { id: 'vitest', local: 'vitest.svg', url: 'https://vitest.dev/logo.svg', fill: false },
  { id: 'stripe', local: 'stripe.svg', url: 'https://cdn.simpleicons.org/stripe/635BFF', fill: false },
  { id: 'socketio', local: 'socketio.svg', url: 'https://cdn.simpleicons.org/socketdotio/010101', fill: false },
  { id: 'nodejs', local: 'nodejs.svg', url: 'https://cdn.simpleicons.org/nodedotjs/5FA04E', fill: false },
  { id: 'git', local: 'git.svg', url: 'https://cdn.simpleicons.org/git/F05032', fill: false },
  { id: 'figma', local: 'figma.svg', url: 'https://cdn.simpleicons.org/figma/F24E1E', fill: false },
]

function isSvgBuffer(buf) {
  const head = buf.subarray(0, 256).toString('utf8').trimStart()
  return head.startsWith('<svg') || head.startsWith('<?xml')
}

async function writeSourcePreview(inputBuffer, destDir) {
  const svgPath = path.join(destDir, 'source.svg')
  const webpPath = path.join(destDir, 'source.webp')

  if (isSvgBuffer(inputBuffer)) {
    await writeFile(svgPath, inputBuffer)
    if (await fileExists(webpPath)) await unlink(webpPath)
    console.log(`wrote ${path.relative(root, svgPath)}`)
    return
  }

  const webp = await sharp(inputBuffer, { density: 300 })
    .ensureAlpha()
    .resize(SOURCE_SIZE, SOURCE_SIZE, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer()

  await writeFile(webpPath, webp)
  console.log(`wrote ${path.relative(root, webpPath)} (${webp.length} bytes)`)
}

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return {
    r: Number.parseInt(h.slice(0, 2), 16),
    g: Number.parseInt(h.slice(2, 4), 16),
    b: Number.parseInt(h.slice(4, 6), 16),
  }
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'portfolio-tech-logo-optimizer/1.0',
      Accept: 'image/*,*/*',
    },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`Download failed ${res.status} ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
  return buf
}

async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function loadInput(item) {
  if (item.local) {
    const localPath = path.join(sourceDir, item.local)
    if (await fileExists(localPath)) {
      console.log(`  using local ${item.local}`)
      return readFile(localPath)
    }
  }

  const ext =
    item.url.includes('.svg') || item.url.includes('simpleicons') ? 'svg' : 'png'
  const sourcePath = path.join(sourceDir, `${item.id}.${ext}`)
  return download(item.url, sourcePath)
}

/** Drop empty margins from bad raster downloads (skip for clean local SVGs). */
async function prepareInput(inputBuffer, { trim }) {
  const base = sharp(inputBuffer, { density: 300 }).ensureAlpha()
  if (!trim) return base.png().toBuffer()

  try {
    return await base
      .trim({
        background: { r: 255, g: 255, b: 255, alpha: 1 },
        threshold: 12,
      })
      .png()
      .toBuffer()
  } catch {
    return base.png().toBuffer()
  }
}

function roundedMask(size, radius) {
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/>
    </svg>`,
  )
}

function borderOverlay(size, radius) {
  const stroke = Math.max(1, Math.round(size * 0.04))
  const inset = stroke / 2
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="${inset}" y="${inset}"
        width="${size - stroke}" height="${size - stroke}"
        rx="${Math.max(0, radius - inset)}" ry="${Math.max(0, radius - inset)}"
        fill="none" stroke="rgba(26,26,26,0.14)" stroke-width="${stroke}"
      />
    </svg>`,
  )
}

async function renderFillTile(prepared, size, brandColor, rounded) {
  const rgb = hexToRgb(brandColor)
  let tile = await sharp(prepared)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .ensureAlpha()
    .flatten({ background: rgb })
    .png()
    .toBuffer()

  if (!rounded) {
    return sharp(tile).webp({ quality: 92, alphaQuality: 100 }).toBuffer()
  }

  const radius = Math.round(size * RADIUS_RATIO)
  tile = await sharp(tile)
    .composite([{ input: await roundedMask(size, radius), blend: 'dest-in' }])
    .png()
    .toBuffer()

  return sharp(tile)
    .composite([{ input: await borderOverlay(size, radius), blend: 'over' }])
    .webp({ quality: 90, alphaQuality: 100 })
    .toBuffer()
}

async function renderMarkTile(prepared, size) {
  const radius = Math.round(size * RADIUS_RATIO)
  const pad = Math.round(size * PAD_RATIO)
  const inner = size - pad * 2

  const logo = await sharp(prepared)
    .resize(inner, inner, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  let tile = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: logo, left: pad, top: pad }])
    .png()
    .toBuffer()

  tile = await sharp(tile)
    .composite([{ input: await roundedMask(size, radius), blend: 'dest-in' }])
    .png()
    .toBuffer()

  return sharp(tile)
    .composite([{ input: await borderOverlay(size, radius), blend: 'over' }])
    .webp({ quality: 90, alphaQuality: 100 })
    .toBuffer()
}

async function optimizeOne(item, inputBuffer) {
  const fill = !!item.fill
  const prepared = await prepareInput(inputBuffer, { trim: !item.local })
  const destDir = path.join(outDir, item.id)
  await mkdir(destDir, { recursive: true })
  await writeSourcePreview(inputBuffer, destDir)

  const render = (size) =>
    fill
      ? renderFillTile(prepared, size, item.color || '#ffffff', true)
      : renderMarkTile(prepared, size)

  for (const size of SIZES) {
    const webp = await render(size, true)
    const dest = path.join(destDir, `${size}.webp`)
    await writeFile(dest, webp)
    console.log(`wrote ${path.relative(root, dest)} (${webp.length} bytes)`)
  }
}

async function main() {
  await mkdir(sourceDir, { recursive: true })
  await mkdir(outDir, { recursive: true })

  for (const item of sources) {
    console.log(`fetch ${item.id}...`)
    try {
      const buf = await loadInput(item)
      await optimizeOne(item, buf)
    } catch (err) {
      console.error(`failed ${item.id}: ${err.message}`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
