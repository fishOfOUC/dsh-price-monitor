/**
 * Trim trailing whitespace from the generated `lib/` artifacts.
 *
 * The bundler leaves a space where a multi-line expression continues, and these
 * artifacts are committed (a git install needs no build), so an otherwise
 * cosmetic byte would keep surfacing in whitespace checks. Run by `pnpm run
 * build` after the bundler; a no-op when `lib/` is absent.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/** Every file under one directory, recursively. */
function filesUnder(directory) {
  const out = []
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) out.push(...filesUnder(path))
    else out.push(path)
  }
  return out
}

let trimmed = 0
for (const path of filesUnder('lib')) {
  if (!/\.(js|d\.ts)$/.test(path)) continue
  const source = readFileSync(path, 'utf8')
  const clean = source.replace(/[ \t]+$/gm, '')
  if (clean !== source) {
    writeFileSync(path, clean)
    trimmed += 1
  }
}
console.log(`trim-generated: ${trimmed} artifact(s) trimmed`)
