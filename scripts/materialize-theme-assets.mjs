import sharp from 'sharp'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const sources = [
  ['.asset-transfer/atlas-critical.webp', '.asset-transfer/atlas-critical.json'],
  ['.asset-transfer/atlas-extras.webp', '.asset-transfer/atlas-extras.json'],
]
const outDir = 'public/assets/loc'
await mkdir(outDir, { recursive: true })
const combined = { generatedFrom: 'Laurels Organized Chaos approved asset pack', backgroundCleanup: 'edge-connected near-black pixels <= 8', assets: {} }

function clearConnectedBackground(data, info) {
  const { width, height, channels } = info
  const pixelCount = width * height
  const seen = new Uint8Array(pixelCount)
  const queue = new Int32Array(pixelCount)
  let head = 0
  let tail = 0

  const isBackground = (pixel) => {
    const offset = pixel * channels
    const alpha = channels > 3 ? data[offset + 3] : 255
    return alpha === 0 || (
      data[offset] <= 8 &&
      data[offset + 1] <= 8 &&
      data[offset + 2] <= 8
    )
  }

  const seed = (pixel) => {
    if (!seen[pixel] && isBackground(pixel)) {
      seen[pixel] = 1
      queue[tail++] = pixel
    }
  }

  for (let x = 0; x < width; x++) {
    seed(x)
    seed((height - 1) * width + x)
  }
  for (let y = 0; y < height; y++) {
    seed(y * width)
    seed(y * width + width - 1)
  }

  while (head < tail) {
    const pixel = queue[head++]
    const x = pixel % width
    const y = Math.floor(pixel / width)
    if (x > 0) seed(pixel - 1)
    if (x + 1 < width) seed(pixel + 1)
    if (y > 0) seed(pixel - width)
    if (y + 1 < height) seed(pixel + width)
  }

  for (let pixel = 0; pixel < pixelCount; pixel++) {
    if (seen[pixel]) data[pixel * channels + 3] = 0
  }
  return data
}

for (const [atlasPath, manifestPath] of sources) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  for (const [name, box] of Object.entries(manifest.assets)) {
    const dest = path.join(outDir, name)
    const extracted = await sharp(atlasPath)
      .extract({ left: box.x, top: box.y, width: box.w, height: box.h })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    clearConnectedBackground(extracted.data, extracted.info)

    await sharp(extracted.data, {
      raw: {
        width: extracted.info.width,
        height: extracted.info.height,
        channels: extracted.info.channels,
      },
    })
      .webp({ quality: 84, alphaQuality: 100, effort: 6 })
      .toFile(dest)

    combined.assets[name] = { source: path.basename(atlasPath), ...box }
  }
}
await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(combined, null, 2) + '\n')
console.log('Generated', Object.keys(combined.assets).length, 'theme assets in', outDir)
