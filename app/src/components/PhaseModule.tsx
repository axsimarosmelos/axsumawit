import { Check, ChevronDown, Flag, Target } from 'lucide-react'
import { useState } from 'react'
import type { Phase, ChordName } from '../data/curriculum'
import ChordDiagram from './ChordDiagram'
import VideoLessons from './VideoLessons'

type Props = { phase: Phase; expanded: boolean; onExpand: () => void; completed: Record<string, boolean>; onToggle: (id: string) => void }
export default function PhaseModule({ phase, expanded, onExpand, completed, onToggle }: Props) {
  const count = phase.tasks.filter(t => completed[t.id]).length
  const [showShapes, setShowShapes] = useState(false)
  return <article id={`phase-${phase.id}`} className={`phase-card scroll-mt-28 ${expanded ? 'phase-expanded' : ''}`}>
    <h3>
      <button onClick={onExpand} aria-expanded={expanded} aria-controls={`phase-content-${phase.id}`} className="flex w-full items-center gap-4 p-5 text-left sm:p-6">
        <span className={`phase-number ${count === phase.tasks.length ? 'phase-done' : ''}`}>{count === phase.tasks.length ? <Check size={22}/> : `0${phase.id}`}</span>
        <span className="min-w-0 flex-1"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.16em] text-muted">Phase {phase.id} <span className="mx-1 text-line">/</span> {phase.pace}</span><span className="block text-base font-semibold sm:text-lg">{phase.title}</span><span className="mt-1.5 block text-xs font-normal text-muted">{count} of {phase.tasks.length} tasks complete</span></span>
        <ChevronDown size={18} className={`shrink-0 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}/>
      </button>
    </h3>
    <div className="mx-6 h-[2px] bg-line"><div className="h-full bg-accent transition-[width]" style={{width:`${count/phase.tasks.length*100}%`}}/></div>
    {expanded && <div id={`phase-content-${phase.id}`} className="px-5 pb-6 pt-5 sm:px-6">
      <p className="text-sm leading-relaxed text-muted">{phase.subtitle}</p>
      <div className="my-4 flex flex-wrap gap-2">{phase.tags.map(tag => <span key={tag} className="rounded-md border border-line px-2.5 py-1 text-[10px] tracking-wide text-soft">{tag}</span>)}</div>
      <div className="mb-4 flex items-start gap-2.5 rounded-lg bg-accent/5 p-3 text-xs leading-relaxed text-soft"><Target className="mt-0.5 shrink-0 text-accent" size={15}/><p><strong className="font-medium text-accent">Your goal: </strong>{phase.goal}</p></div>
      <div className="divide-y divide-line/80">
        {phase.tasks.map(task => <label key={task.id} className={`task-row group ${completed[task.id] ? 'task-complete' : ''}`}>
          <input type="checkbox" checked={!!completed[task.id]} onChange={() => onToggle(task.id)} className="task-check"/>
          <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="task-title text-[13px] font-medium">{task.title}</span>{task.kind==='Milestone' && <Flag size={12} className="text-accent"/>}</span><span className="mt-1 block text-xs leading-[1.75] text-muted">{task.detail}</span></span>
          <span className={`task-tag ${task.kind==='Recall' ? 'text-sage' : task.kind==='Drill' ? 'text-accent' : 'text-muted'}`}>{task.kind}</span>
        </label>)}
      </div>
      {phase.id <= 2 && <div className="mt-5 rounded-lg border border-line bg-canvas/50 p-4">
        <button className="flex w-full items-center justify-between text-xs font-medium text-soft" onClick={() => setShowShapes(!showShapes)} aria-expanded={showShapes}><span>{showShapes ? 'Hide' : 'Show'} chord reference · try from memory first</span><ChevronDown size={14} className={showShapes ? 'rotate-180' : ''}/></button>
        {showShapes && <><div className="mt-4 grid grid-cols-4 justify-items-center">{(['G','C','D','Em'] as ChordName[]).map(name => <ChordDiagram key={name} name={name} compact/>)}</div><p className="mt-3 text-[11px] text-muted">Low E → high e · ○ open · × omit · 1 index, 2 middle, 3 ring, 4 little</p></>}
      </div>}
      {phase.id===2 && <div className="mt-4 rounded-lg border border-line p-4"><p className="mb-3 text-xs text-soft">Your essential strum · keep moving through the rests</p><div className="grid grid-cols-8 text-center font-mono text-xs text-muted">{['1','&','2','&','3','&','4','&'].map((beat,i) => <span key={i}>{beat}</span>)}</div><div className="mt-2 grid grid-cols-8 text-center font-mono text-lg text-accent">{['↓','–','↓','↑','–','↑','↓','–'].map((stroke,i) => <span key={i}>{stroke}</span>)}</div></div>}
      <VideoLessons lessons={phase.lessons}/>
    </div>}
  </article>
}
