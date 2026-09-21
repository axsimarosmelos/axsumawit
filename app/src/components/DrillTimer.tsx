import { useEffect, useRef, useState } from 'react'
import { Timer, Play, Pause, RotateCcw, TrendingUp, Check, History } from 'lucide-react'
import { pairs } from '../data/curriculum'
import type { Pair } from '../data/curriculum'
import { remainingSeconds } from '../lib/progress'
import type { DrillScore } from '../lib/progress'

type Props = { scores: DrillScore[]; onSave: (pair: Pair, count: number) => void }
export default function DrillTimer({ scores, onSave }: Props) {
  const [pair, setPair] = useState<Pair>(pairs[0])
  const [seconds, setSeconds] = useState(60)
  const [status, setStatus] = useState<'idle'|'running'|'paused'|'finished'>('idle')
  const [count, setCount] = useState('')
  const [saved, setSaved] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const deadline = useRef(0)
  const remainingMs = useRef(60_000)
  const filtered = scores.filter(score => score.pair===pair)
  const best = filtered.length ? Math.max(...filtered.map(s=>s.count)) : null

  useEffect(() => {
    if (status!=='running') return
    const update = () => {
      const left = remainingSeconds(deadline.current, Date.now())
      setSeconds(left)
      if (left===0) { remainingMs.current=0; setStatus('finished') }
    }
    const interval = window.setInterval(update, 100)
    // On return from a background tab, calculate from the deadline, not ticks.
    document.addEventListener('visibilitychange', update)
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', update) }
  }, [status])

  function reset() { remainingMs.current=60_000; setSeconds(60); setStatus('idle'); setCount(''); setSaved(false) }
  function toggle() {
    if (status==='running') {
      remainingMs.current=Math.max(0,deadline.current-Date.now())
      setSeconds(Math.ceil(remainingMs.current/1000))
      setStatus(remainingMs.current===0 ? 'finished' : 'paused')
    } else { deadline.current=Date.now()+remainingMs.current; setStatus('running') }
  }
  const validCount = /^\d{1,3}$/.test(count) && Number(count)<=300

  return <section id="drill" className="panel scroll-mt-28 p-5" aria-labelledby="drill-heading">
    <div className="flex items-center justify-between"><h2 id="drill-heading" className="flex items-center gap-2 text-sm font-semibold"><Timer size={17} className="text-accent"/> One-minute changes</h2><span className="eyebrow text-accent">DRILL</span></div>
    <p className="mt-2 text-xs leading-relaxed text-muted">One focused minute. Count clean changes, then beat your own baseline.</p>
    <label className="mt-5 block text-[11px] text-muted" htmlFor="chord-pair">Chord pair</label>
    <select id="chord-pair" className="field mt-2 w-full" value={pair} disabled={status==='running'||status==='paused'} onChange={event => {setPair(event.target.value as Pair);reset()}}>{pairs.map(p=><option key={p}>{p}</option>)}</select>
    <div className="relative mx-auto my-5 flex h-44 w-44 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="81" fill="none" stroke="#2d3330" strokeWidth="3"/><circle cx="90" cy="90" r="81" fill="none" stroke="#edb77c" strokeWidth="3" strokeLinecap="round" strokeDasharray={2*Math.PI*81} strokeDashoffset={2*Math.PI*81*(1-seconds/60)} className="transition-[stroke-dashoffset] duration-200"/></svg>
      <div className="text-center"><div role="timer" aria-label={`${seconds} seconds remaining`} className="font-mono text-5xl font-light tracking-[-.06em]">{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</div><span className="mt-2 block text-[9px] uppercase tracking-[.22em] text-muted">{status==='finished' ? 'Nice work' : status==='running' ? 'Keep it clean' : status==='paused' ? 'Paused' : 'Make every change count'}</span></div>
    </div>
    <div className="flex gap-2">
      {status==='finished' ? <button onClick={reset} className="button-primary flex-1"><RotateCcw size={15}/>New round</button> : <button onClick={toggle} className="button-primary flex-1">{status==='running' ? <Pause size={15}/> : <Play size={15}/>} {status==='running' ? 'Pause' : status==='paused' ? 'Resume' : 'Start drill'}</button>}
      <button className="button-secondary px-3" aria-label="Reset timer" onClick={reset}><RotateCcw size={16}/></button>
    </div>
    <div className="sr-only" role="status">{status==='finished' ? 'Your one-minute drill is complete. Enter your clean-change count.' : ''}</div>
    {status==='finished' && <form className="mt-4" onSubmit={event => {event.preventDefault();if(validCount&&!saved){onSave(pair,Number(count));setSaved(true)}}}>
      <label htmlFor="drill-score" className="mb-2 block text-xs text-soft">How many clean changes?</label><div className="flex gap-2"><input id="drill-score" type="number" min="0" max="300" step="1" value={count} onChange={e=>setCount(e.target.value)} disabled={saved} required className="field min-w-0 flex-1" placeholder="e.g. 24"/><button className="button-secondary" type="submit" disabled={!validCount||saved}>{saved ? <><Check size={14}/>Saved</> : 'Save'}</button></div>
    </form>}
    <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs"><span className="flex items-center gap-1.5 text-muted"><TrendingUp size={14}/>Personal best</span><span className="font-mono text-accent">{best===null ? '—' : best} <span className="font-sans text-[10px] text-muted">changes / min</span></span></div>
    <p className="mt-3 text-[11px] leading-relaxed text-muted">G → C → G = 2 changes. Count only clean arrivals. Rest between rounds; speed follows accuracy.</p>
    <button onClick={()=>setShowHistory(!showHistory)} aria-expanded={showHistory} className="mt-4 flex items-center gap-1.5 text-[11px] text-soft hover:text-accent"><History size={13}/>{showHistory ? 'Hide' : 'View'} saved rounds ({filtered.length})</button>
    {showHistory && <div className="mt-3 space-y-2 text-xs text-muted">{filtered.length===0 ? <p>No rounds for this pair yet.</p> : [...filtered].reverse().slice(0,5).map(score=><div key={score.id} className="flex justify-between"><span>{new Date(score.at).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span><span className="text-soft">{score.count} clean changes</span></div>)}</div>}
  </section>
}
