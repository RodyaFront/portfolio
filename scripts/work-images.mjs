/**
 * Dual-res work screenshots for portfolio cases.
 *
 * Emits:
 *   public/work/{case}/{name}-preview.webp  (page / card)
 *   public/work/{case}/{name}-full.webp     (lightbox)
 * Copies the source to:
 *   assets/work/{case}/{name}{ext}
 *
 * Usage:
 *   node scripts/work-images.mjs --case ancient-lens --name detail-combat path/to/shot.png
 *   node scripts/work-images.mjs --case ancient-lens --name detail-combat ./a.png ./b.png
 *     (multiple sources require multiple --name flags in parallel pairs, or one source per run)
 *
 * Prints CaseImage-ready JSON for app/data/cases.ts.
 */
import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

/** Long edge for page/card preview. */
const PREVIEW_LONG_EDGE = 720
/** WebP quality. */
const PREVIEW_QUALITY = 78
const FULL_QUALITY = 86

function usage() {
  console.error(`Usage:
  node scripts/work-images.mjs --case <slug> --name <kebab-name> <source> [more sources...]

Example:
  node scripts/work-images.mjs --case ancient-lens --name detail-combat ./shot.png

When multiple sources are passed, pass matching --name flags in order:
  node scripts/work-images.mjs --case ancient-lens --name a --name b ./a.png ./b.png`)
  process.exit(1)
}

function parseArgs(argv) {
  const caseSlug = []
  const names = []
  const sources = []

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--case') {
      caseSlug.push(argv[++i])
      continue
    }
    if (arg === '--name') {
      names.push(argv[++i])
      continue
    }
    if (arg === '--help' || arg === '-h') usage()
    if (arg.startsWith('-')) {
      console.error(`Unknown flag: ${arg}`)
      usage()
    }
    sources.push(path.resolve(arg))
  }

  if (caseSlug.length !== 1 || !names.length || !sources.length) usage()
  if (names.length !== sources.length) {
    console.error(
      `Need one --name per source (got ${names.length} names, ${sources.length} sources)`,
    )
    usage()
  }

  return { caseId: caseSlug[0], jobs: names.map((name, i) => ({ name, source: sources[i] })) }
}

async function emitPair({ caseId, name, source }) {
  const outDir = path.join(root, 'public', 'work', caseId)
  const assetDir = path.join(root, 'assets', 'work', caseId)
  await mkdir(outDir, { recursive: true })
  await mkdir(assetDir, { recursive: true })

  const ext = path.extname(source).toLowerCase() || '.png'
  const assetPath = path.join(assetDir, `${name}${ext}`)
  await copyFile(source, assetPath)

  const meta = await sharp(source).metadata()
  if (!meta.width || !meta.height) {
    throw new Error(`No dimensions for ${source}`)
  }

  const longEdge = Math.max(meta.width, meta.height)
  const landscape = meta.width >= meta.height

  const fullPath = path.join(outDir, `${name}-full.webp`)
  const previewPath = path.join(outDir, `${name}-preview.webp`)

  // Full: keep native pixels (no upscale). Chat ~1024 sources stay ~1024.
  await sharp(source)
    .rotate()
    .webp({ quality: FULL_QUALITY })
    .toFile(fullPath)

  const previewResize = landscape
    ? { width: Math.min(PREVIEW_LONG_EDGE, meta.width), withoutEnlargement: true }
    : { height: Math.min(PREVIEW_LONG_EDGE, meta.height), withoutEnlargement: true }

  await sharp(source)
    .rotate()
    .resize(previewResize)
    .webp({ quality: PREVIEW_QUALITY })
    .toFile(previewPath)

  const fullMeta = await sharp(fullPath).metadata()
  const previewMeta = await sharp(previewPath).metadata()

  const softFull = longEdge < 1400
  const entry = {
    src: `/work/${caseId}/${name}-preview.webp`,
    srcFull: `/work/${caseId}/${name}-full.webp`,
    alt: `TODO: real alt for ${name}`,
    width: previewMeta.width,
    height: previewMeta.height,
    fullWidth: fullMeta.width,
    fullHeight: fullMeta.height,
    objectPosition: 'top center',
  }

  return {
    name,
    source: { width: meta.width, height: meta.height, longEdge },
    softFull,
    entry,
  }
}

const { caseId, jobs } = parseArgs(process.argv.slice(2))
const results = []

for (const job of jobs) {
  results.push(await emitPair({ caseId, ...job }))
}

for (const result of results) {
  if (result.softFull) {
    console.warn(
      `[warn] ${result.name}: source long edge ${result.source.longEdge}px. Lightbox zoom will stay soft until a native capture replaces assets/work/${caseId}/${result.name}.*`,
    )
  }
}

console.log(JSON.stringify(results.map((r) => r.entry), null, 2))
