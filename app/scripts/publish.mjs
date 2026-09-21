import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(appRoot, '..')

// Only the generated assets directory is replaced. Source and docs stay intact.
await mkdir(resolve(repoRoot, 'assets'), { recursive: true })
await rm(resolve(repoRoot, 'assets'), { recursive: true, force: true })
await cp(resolve(appRoot, 'dist'), repoRoot, { recursive: true })
await writeFile(resolve(repoRoot, '.nojekyll'), '')
console.log('Production site refreshed at the repository root. Commit and push to publish.')
