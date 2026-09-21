import { useEffect, useRef, useState } from 'react'
import type { SetStateAction } from 'react'

// Writes happen only when an action changes state. This preserves unreadable
// stored data at startup and avoids duplicate writes from StrictMode effects.
export function useLocalStorage<T>(key: string, initial: T, parse: (value: unknown) => T | null) {
  const [loaded] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return { value: initial, error: '' }
      const parsed = parse(JSON.parse(raw))
      return parsed === null ? { value: initial, error: 'Saved data could not be read. New progress will replace it when you make a change.' } : { value: parsed, error: '' }
    } catch {
      return { value: initial, error: 'Saved progress is unavailable. Changes may only last for this visit.' }
    }
  })
  const [value, setValue] = useState<T>(loaded.value)
  const [error, setError] = useState(loaded.error)
  const lastSaved = useRef(value)
  useEffect(() => {
    if (value === lastSaved.current) return
    try { localStorage.setItem(key, JSON.stringify(value)); lastSaved.current = value; setError('') }
    catch { setError('Progress is kept for this visit, but your browser could not save it. Allow site storage to keep it after a refresh.') }
  }, [key, value])
  return { value, setValue: (action: SetStateAction<T>) => setValue(action), error }
}
