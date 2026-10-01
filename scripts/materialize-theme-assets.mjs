import sharp from 'sharp'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const sources = [
  ['.asset-transfer/atlas-critical.webp', '.asset-transfer/atlas-critical.json'],
  ['.asset-transfer/atlas-extras.webp', '.asset-transfer/atlas-extras.json'],
]
const outDir = 'public/assets/loc'
await mkdir(outDir, { recursive: true })
const combined = { generatedFrom: 'Laurels Organized Chaos approved asset pack', assets: {} }

for (const [atlasPath, manifestPath] of sources) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  for (const [name, box] of Object.entries(manifest.assets)) {
    const dest = path.join(outDir, name)
    await sharp(atlasPath)
      .extract({ left: box.x, top: box.y, width: box.w, height: box.h })
      .webp({ quality: 82, alphaQuality: 95, effort: 6 })
      .toFile(dest)
    combined.assets[name] = { source: path.basename(atlasPath), ...box }
  }
}
await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(combined, null, 2) + '\n')
console.log('Generated', Object.keys(combined.assets).length, 'theme assets in', outDir)
