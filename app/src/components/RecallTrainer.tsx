import { useState } from 'react'
import { Brain, Eye, Check, RotateCcw, CalendarDays } from 'lucide-react'
import { recallCards } from '../data/curriculum'
import type { Review } from '../lib/progress'
import ChordDiagram from './ChordDiagram'

type Props = { reviews: Record<string,Review>; now: number; onRate: (id: string, recalled: boolean) => void }
export default function RecallTrainer({ reviews, now, onRate }: Props) {
  const [category, setCategory] = useState<'chords'|'notes'>('chords')
  const [revealedId, setRevealedId] = useState<string|null>(null)
  const [message, setMessage] = useState('')
  const cards=recallCards.filter(card=>card.category===category)
  // Previously studied cards come first, then new cards. Rating removes the
  // current card from this queue until its next real due time.
  const due=cards.filter(card=>!reviews[card.id]||reviews[card.id].dueAt<=now).sort((a,b)=>(reviews[a.id]?.dueAt??Number.MAX_SAFE_INTEGER)-(reviews[b.id]?.dueAt??Number.MAX_SAFE_INTEGER))
  const card=due[0]
  const revealed=!!card && revealedId===card.id
  const nextDue=cards.reduce((min,c)=>Math.min(min,reviews[c.id]?.dueAt??Infinity),Infinity)

  function rate(recalled:boolean) {
    if(!card||!revealed)return
    onRate(card.id,recalled)
    setRevealedId(null)
    setMessage(recalled ? 'Recall recorded. Your next review is scheduled.' : 'Scheduled again in 10 minutes. Rebuild it slowly once now.')
  }

  return <section id="recall" className="panel scroll-mt-28 p-5" aria-labelledby="recall-heading">
    <div className="flex items-center justify-between"><h2 id="recall-heading" className="flex items-center gap-2 text-sm font-semibold"><Brain size={17} className="text-sage"/> Recall studio</h2><span className="rounded-full bg-sage/10 px-2 py-1 text-[10px] text-sage">{due.length} due / new</span></div>
    <p className="mt-2 text-xs leading-relaxed text-muted">Try it before you see it. That’s where learning happens.</p>
    <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-canvas p-1" aria-label="Recall deck">{([{id:'chords',label:'Chord shapes'},{id:'notes',label:'Fretboard notes'}] as const).map(tab=><button key={tab.id} aria-pressed={category===tab.id} className={`rounded-md px-1 py-2 text-[11px] transition-colors ${category===tab.id ? 'bg-raised text-ink shadow-sm' : 'text-muted hover:text-ink'}`} onClick={()=>{setCategory(tab.id);setRevealedId(null);setMessage('')}}>{tab.label}</button>)}</div>
    {category==='notes' && <p className="mt-2 text-[10px] text-muted">Start this deck in Phase 3.</p>}
    {card ? <div className="mt-4">
      <div className="recall-face"><span className="eyebrow text-sage">{revealed ? 'CHECK YOUR ANSWER' : 'FROM MEMORY'}</span><p className="mt-3 text-base leading-relaxed">{card.prompt}</p><p className="mt-3 text-[11px] text-muted">Say your answer and play it first.</p>
        {revealed && <div className="mt-4 border-t border-line pt-4">{card.chord && <div className="mb-3 flex justify-center"><ChordDiagram name={card.chord}/></div>}<p className="text-xs leading-relaxed text-sage">{card.answer}</p></div>}
      </div>
      {revealed ? <div className="mt-3 grid grid-cols-2 gap-2"><button className="button-secondary text-xs" onClick={()=>rate(false)}><RotateCcw size={13}/>Again</button><button className="button-sage text-xs" onClick={()=>rate(true)}><Check size={13}/>Got it</button></div> : <button className="button-secondary mt-3 w-full text-xs" onClick={()=>{setRevealedId(card.id);setMessage('')}}><Eye size={14}/>Reveal answer</button>}
    </div> : <div className="recall-face mt-4 text-center"><Check size={26} className="mx-auto mb-3 text-sage"/><p className="text-sm">You’re caught up.</p><p className="mt-2 text-xs leading-relaxed text-muted">Next review: {Number.isFinite(nextDue) ? new Date(nextDue).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}) : 'when you add a new card'}.</p></div>}
    <p role="status" className="mt-3 text-[11px] leading-relaxed text-sage">{message}</p>
    <div className="mt-4 flex items-start gap-2 border-t border-line pt-4"><CalendarDays size={14} className="mt-0.5 shrink-0 text-muted"/><p className="text-[10px] leading-relaxed text-muted">Next intervals: 1 → 3 → 7 → 14 → 30 days. Missed cards return in 10 minutes, then restart at 1 day. Self-rate only after revealing.</p></div>
  </section>
}
