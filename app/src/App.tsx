import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, BookOpen, Brain, Check, CheckCheck, ChevronRight, CircleHelp, Clock3, Guitar, LayoutDashboard, Menu, Music2, Sparkles, Target, Timer, X } from 'lucide-react'
import { phases, recallCards, taskIds } from './data/curriculum'
import type { Pair } from './data/curriculum'
import { emptyProgress, parseProgress, scheduleReview, STORAGE_KEY } from './lib/progress'
import { useLocalStorage } from './hooks/useLocalStorage'
import PhaseModule from './components/PhaseModule'
import DrillTimer from './components/DrillTimer'
import RecallTrainer from './components/RecallTrainer'

export default function App() {
  const {value:progress,setValue:setProgress,error:storageError}=useLocalStorage(STORAGE_KEY,emptyProgress,parseProgress)
  const [expanded,setExpanded]=useState<number[]>([1])
  const [mobileMenu,setMobileMenu]=useState(false)
  const [now,setNow]=useState(Date.now())
  const [methodOpen,setMethodOpen]=useState(false)
  useEffect(()=>{
    const update=()=>setNow(Date.now())
    const interval=window.setInterval(update,30_000)
    window.addEventListener('focus',update)
    return ()=>{clearInterval(interval);window.removeEventListener('focus',update)}
  },[])
  const completedCount=Object.values(progress.completed).filter(Boolean).length
  const percentage=Math.round(completedCount/taskIds.size*100)
  const currentPhase=phases.find(phase=>phase.tasks.some(t=>!progress.completed[t.id]))??phases[3]
  const dueCount=recallCards.filter(c=>progress.reviews[c.id]&&progress.reviews[c.id].dueAt<=now).length
  const newCount=recallCards.filter(c=>!progress.reviews[c.id]).length
  const finished=completedCount===taskIds.size

  function navigate(id:string) {
    setMobileMenu(false)
    const phase=Number(id.replace('phase-',''))
    if(id.startsWith('phase-'))setExpanded(previous=>previous.includes(phase)?previous:[...previous,phase])
    // Wait for an expanded module and a dismissed mobile nav to finish rendering.
    requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}))
  }
  function saveDrill(pair:Pair,count:number) {
    setProgress(previous=>({...previous,drills:[...previous.drills,{id:crypto.randomUUID(),pair,count,at:Date.now()}].slice(-200)}))
  }

  return <div className="min-h-screen bg-canvas text-ink">
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="app-header">
      <div className="flex items-center gap-3"><span className="brand-icon"><Guitar size={24} strokeWidth={1.6}/></span><div><div className="flex flex-wrap items-baseline gap-x-2"><span className="text-lg font-semibold tracking-[-.04em]">Axsumawit</span><span className="text-xs text-muted">- Guitar Mastery</span></div><div className="mt-0.5 text-[9px] uppercase tracking-[.24em] text-muted">Your personal practice studio</div></div></div>
      <div className="flex items-center gap-4"><span role="status" className={`hidden items-center gap-1.5 text-[11px] sm:flex ${storageError?'text-accent':'text-muted'}`}><span className={`h-1.5 w-1.5 rounded-full ${storageError?'bg-accent':'bg-sage'}`}/>{storageError?'Storage needs attention':'Progress saved on this device'}</span><span className="hidden h-7 w-px bg-line sm:block"/><div className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel text-xs text-accent" aria-label="Personal studio">AX</div><button onClick={()=>setMobileMenu(!mobileMenu)} aria-expanded={mobileMenu} aria-controls="main-nav" aria-label={mobileMenu?'Close navigation':'Open navigation'} className="button-secondary p-2 lg:hidden">{mobileMenu?<X size={18}/>:<Menu size={18}/>}</button></div>
    </header>

    <aside className={`sidebar ${mobileMenu?'sidebar-open':''}`} id="main-nav">
      <nav aria-label="Main navigation">
        <p className="eyebrow mb-4 px-3 text-muted">YOUR WORKSPACE</p>
        <button className="nav-item nav-active" onClick={()=>navigate('main')}><LayoutDashboard size={17}/>My learning path<span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"/></button>
        <button className="nav-item" onClick={()=>navigate('drill')}><Timer size={17}/>Practice timer</button>
        <button className="nav-item" onClick={()=>navigate('recall')}><Brain size={17}/>Recall studio</button>
        <p className="eyebrow mb-3 mt-10 px-3 text-muted">THE FOUR PHASES</p>
        <div className="phase-navigation">{phases.map(phase=>{
          const complete=phase.tasks.every(t=>progress.completed[t.id])
          return <button key={phase.id} className={`phase-nav-item ${currentPhase.id===phase.id?'phase-nav-current':''}`} onClick={()=>navigate(`phase-${phase.id}`)}><span className="phase-nav-dot">{complete?<Check size={11}/>:phase.id}</span><span>{['Foundation','Rhythm & flow','Fretboard & recall','Performance'][phase.id-1]}</span>{currentPhase.id===phase.id&&<ChevronRight className="ml-auto" size={14}/>}</button>
        })}</div>
      </nav>
      <div className="mt-auto pt-10"><div className="rounded-xl border border-line bg-raised/50 p-4"><span className="mb-3 flex items-center gap-2 text-xs font-medium text-accent"><Sparkles size={15}/>A little, every day.</span><p className="text-[11px] leading-[1.8] text-muted">Twenty focused minutes beat a practice session you never start.</p><div className="mt-4 flex items-center gap-1.5 text-[10px] text-soft"><Clock3 size={12}/>20 min / session</div></div><button className="nav-item mt-5 text-xs" onClick={()=>{setMethodOpen(true);navigate('method')}}><CircleHelp size={16}/>How this path works</button></div>
    </aside>

    <main id="main" className="main-content scroll-mt-24">
      <div className="mb-6 flex items-center gap-2 text-[11px] text-muted"><span>My workspace</span><ChevronRight size={12}/><span className="text-soft">Learning path</span></div>
      {storageError&&<div role="alert" className="mb-5 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm text-accent">{storageError}</div>}

      <section className="hero-panel">
        <div className="relative z-10 max-w-xl"><div className="mb-5 flex items-center gap-2.5"><span className="h-px w-6 bg-accent"/><span className="eyebrow text-accent">LESS SCROLLING. MORE STRUMMING.</span></div><h1 className="text-[38px] leading-[1.12] font-medium tracking-[-.055em] sm:text-[48px] xl:text-[52px]">Small practice.<br/><span className="text-accent">Big progress.</span></h1><p className="mt-4 max-w-sm text-[13px] leading-[1.85] text-soft">Four essential chords. A clear path forward.<br/>Build the habits that turn “I wish” into “I can play.”</p><button onClick={()=>navigate(`phase-${currentPhase.id}`)} className="button-primary mt-6">{finished?'Revisit your practice':'Continue learning'}<ArrowRight size={16}/></button></div>
        <div className="hero-art" aria-hidden="true"><div className="hero-art-ring ring-one"/><div className="hero-art-ring ring-two"/><div className="hero-art-ring ring-three"/><div className="guitar-strings">{[0,1,2,3,4,5].map(n=><span key={n}/>)}</div><div className="chord-orbit chord-orbit-g">G<span>I</span></div><div className="chord-orbit chord-orbit-d">D<span>V</span></div><div className="chord-orbit chord-orbit-em">Em<span>vi</span></div><div className="chord-orbit chord-orbit-c">C<span>IV</span></div><span className="hero-art-caption">FOUR CHORDS. ENDLESS POSSIBILITIES.</span></div>
      </section>

      <div className="mb-8 mt-5 grid gap-3 sm:grid-cols-3">
        <div className="stat-card"><span className="stat-icon"><Target size={19}/></span><div className="min-w-0 flex-1"><p className="text-[10px] text-muted">Your progress</p><div className="mt-1 flex items-baseline gap-2"><span className="text-2xl font-medium tracking-tight">{percentage}%</span><span className="text-[10px] text-muted">{completedCount}/{taskIds.size} tasks</span></div><div className="mt-2 h-1 w-full rounded-full bg-line" role="progressbar" aria-label="Curriculum completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}><div className="h-1 rounded-full bg-accent transition-[width]" style={{width:`${percentage}%`}}/></div></div></div>
        <button onClick={()=>navigate('recall')} className="stat-card text-left transition-colors hover:border-sage/40"><span className="stat-icon text-sage"><Brain size={19}/></span><div><p className="text-[10px] text-muted">Ready to recall</p><div className="mt-1 flex items-baseline gap-2"><span className="text-2xl font-medium tracking-tight">{dueCount}</span><span className="text-[10px] text-muted">due · {newCount} new cards</span></div><p className="mt-1 text-[10px] text-sage">Keep what you learn <ArrowRight className="ml-1 inline" size={11}/></p></div></button>
        <div className="stat-card"><span className="stat-icon text-soft"><Timer size={19}/></span><div><p className="text-[10px] text-muted">Focused practice</p><div className="mt-1 flex items-baseline gap-2"><span className="text-2xl font-medium tracking-tight">{progress.drills.length}</span><span className="text-[10px] text-muted">one-minute rounds logged</span></div><p className="mt-1 text-[10px] text-muted">Clean changes add up.</p></div></div>
      </div>

      <div className="workspace-grid">
        <div className="min-w-0">
          <div className="mb-5 flex items-end justify-between gap-3"><div><h2 className="text-xl font-medium tracking-tight">Your learning path</h2><p className="mt-1.5 text-xs text-muted">Four phases. Move on when it feels solid.</p></div><span className="mb-0.5 shrink-0 rounded-full border border-line px-2.5 py-1 text-[10px] text-soft">{finished?'Path completed':`Phase ${currentPhase.id} of 4`}</span></div>
          <div className="space-y-4">{phases.map(phase=><PhaseModule key={phase.id} phase={phase} expanded={expanded.includes(phase.id)} onExpand={()=>setExpanded(previous=>previous.includes(phase.id)?previous.filter(id=>id!==phase.id):[...previous,phase.id])} completed={progress.completed} onToggle={id=>setProgress(previous=>({...previous,completed:{...previous.completed,[id]:!previous.completed[id]}}))}/>)}</div>
          <section id="method" className="panel mt-6 scroll-mt-28 p-5"><button className="flex w-full items-center gap-3 text-left" onClick={()=>setMethodOpen(!methodOpen)} aria-expanded={methodOpen} aria-controls="method-content"><BookOpen size={18} className="text-accent"/><span className="flex-1 text-sm font-medium">The method behind your progress</span><ArrowDown size={16} className={`text-muted ${methodOpen?'rotate-180':''}`}/></button>{methodOpen&&<div id="method-content" className="mt-5 space-y-4 text-xs leading-[1.85] text-muted"><p><strong className="text-soft">80/20 focus.</strong> Spend the first two phases on G, C, D, Em and rhythm. These common building blocks support many pop arrangements, sometimes with transposition or a capo. The 80/20 rule guides priorities; it is not a measured claim that four shapes play exactly 80% of songs.</p><p><strong className="text-soft">Retrieve, then check.</strong> Say a fingering or note and play it before revealing the answer. Honest self-rating schedules the next attempt. Check both decks for due cards when you practice; start the note deck in Phase 3.</p><p><strong className="text-soft">Short trials, useful feedback.</strong> Count clean chord changes for one minute, save the score, and revisit the weakest pair. Record full phrases too: a higher count alone does not measure timing or musicality.</p><p><strong className="text-soft">Milestones over deadlines.</strong> Week labels are suggestions. Repeat a phase until its milestone is comfortable on two days. This path builds a strong accompaniment foundation; broader guitar mastery develops through ongoing repertoire, listening, technique and musicianship.</p><p>Tune to E–A–D–G–B–E before each session. Use light pressure, pause when tense, and stop if playing hurts. A tuner and metronome app are useful companions.</p><p>Task checkboxes record your own completion, including video-and-practice tasks. Recall reviews and drill scores are separate from those milestones. Progress stays in this browser; it does not sync between devices.</p></div>}</section>
        </div>

        <aside className="space-y-5" aria-label="Practice tools">
          <div className="mb-5 flex items-center gap-2 text-xs text-muted"><span className="h-1.5 w-1.5 rounded-full bg-accent"/>YOUR DAILY PRACTICE COMPANION</div>
          <DrillTimer scores={progress.drills} onSave={saveDrill}/>
          <RecallTrainer reviews={progress.reviews} now={now} onRate={(id,recalled)=>{const time=Date.now();setNow(time);setProgress(previous=>({...previous,reviews:{...previous.reviews,[id]:scheduleReview(previous.reviews[id],recalled,time)}}))}}/>
          <section className="panel p-5" aria-labelledby="routine-title"><h2 id="routine-title" className="flex items-center gap-2 text-sm font-semibold"><Music2 size={16} className="text-accent"/>Your 20-minute mix</h2><p className="mt-2 text-xs leading-relaxed text-muted">A time budget for each session.</p><div className="mt-4 space-y-3">{[['Recall','3 min','bg-sage'],['Chord clarity','5 min','bg-accent'],['Rhythm','5 min','bg-[#c8bd9d]'],['Transition drills','2 min','bg-[#af9bc6]'],['Play something','5 min','bg-[#7eaaaa]']].map(([label,time,color])=><div key={label} className="flex items-center gap-2 text-xs"><span className={`h-1.5 w-1.5 rounded-full ${color}`}/><span className="flex-1 text-soft">{label}</span><span className="font-mono text-[10px] text-muted">{time}</span></div>)}</div><p className="mt-4 border-t border-line pt-3 text-[10px] leading-relaxed text-muted">In Phase 1, “play something” means a simple chord loop. Add brief rests whenever you need them.</p></section>
        </aside>
      </div>
      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 text-[10px] text-muted"><span className="flex items-center gap-2"><Guitar size={13}/>Axsumawit · Built for the joy of playing.</span><span className="flex items-center gap-1.5"><CheckCheck size={13}/>Your pace. Your progress.</span></footer>
    </main>
  </div>
}
