import { pairs, recallCards, taskIds } from '../data/curriculum.ts'
import type { Pair } from '../data/curriculum.ts'

export const STORAGE_KEY = 'axsumawit.progress.v1'
export const DAY = 86_400_000
export const INTERVALS = [1, 3, 7, 14, 30] as const
export type Review = { step: number; dueAt: number; lastReviewed: number }
export type DrillScore = { id: string; pair: Pair; count: number; at: number }
export type Progress = { version: 1; completed: Record<string, boolean>; reviews: Record<string, Review>; drills: DrillScore[] }
export const emptyProgress: Progress = { version: 1, completed: {}, reviews: {}, drills: [] }

export function scheduleReview(previous: Review | undefined, recalled: boolean, now: number): Review {
  const step = recalled ? Math.min((previous?.step ?? 0) + 1, INTERVALS.length) : 0
  return { step, dueAt: now + (recalled ? INTERVALS[step - 1] * DAY : 10 * 60_000), lastReviewed: now }
}

export function remainingSeconds(deadline: number, now: number): number {
  return Math.max(0, Math.min(60, Math.ceil((deadline - now) / 1000)))
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const validTime = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0

// Treat saved browser data as untrusted input. Reject incompatible versions and
// malformed entries rather than letting one bad value break the entire app.
export function parseProgress(value: unknown): Progress | null {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.completed) || !isRecord(value.reviews) || !Array.isArray(value.drills)) return null
  const completed: Progress['completed'] = {}
  for (const [key, checked] of Object.entries(value.completed)) {
    if (taskIds.has(key) && typeof checked === 'boolean') completed[key] = checked
  }
  const reviews: Progress['reviews'] = {}
  const cardIds = new Set(recallCards.map(card => card.id))
  for (const [key, item] of Object.entries(value.reviews)) {
    if (cardIds.has(key) && isRecord(item) && typeof item.step === 'number' && Number.isInteger(item.step) && item.step >= 0 && item.step <= INTERVALS.length && validTime(item.dueAt) && validTime(item.lastReviewed)) {
      reviews[key] = { step: item.step, dueAt: item.dueAt, lastReviewed: item.lastReviewed }
    }
  }
  const drills = value.drills.filter((item): item is DrillScore => isRecord(item) && typeof item.id === 'string' && typeof item.pair === 'string' && (pairs as readonly string[]).includes(item.pair) && typeof item.count === 'number' && Number.isInteger(item.count) && item.count >= 0 && item.count <= 300 && validTime(item.at)).slice(-200)
  return { version: 1, completed, reviews, drills }
}
