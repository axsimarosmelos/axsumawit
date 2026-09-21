import { useState } from 'react'
import { Play, ExternalLink } from 'lucide-react'
import type { Lesson } from '../data/curriculum'

export default function VideoLessons({ lessons }: { lessons: Lesson[] }) {
  const [selected, setSelected] = useState(0)
  const lesson = lessons[selected]
  return <section aria-label="Video lessons" className="mt-7 border-t border-line pt-6">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h4 className="flex items-center gap-2 text-sm font-semibold"><Play size={15} className="text-accent"/> Watch, then put it into practice</h4>
      <span className="text-xs text-muted">{lessons.length} lessons</span>
    </div>
    <div className="mb-4 flex flex-wrap gap-2" aria-label="Choose a lesson">
      {lessons.map((item, i) => <button key={item.id} onClick={() => setSelected(i)} aria-pressed={selected===i} className={`lesson-pill ${selected===i ? 'lesson-pill-active' : ''}`}>{item.title}</button>)}
    </div>
    <div className="aspect-video overflow-hidden rounded-xl border border-line bg-black">
      <iframe key={lesson.id} className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${lesson.id}?rel=0`} title={`${lesson.title} — ${lesson.teacher}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
    </div>
    <div className="mt-3 flex items-start justify-between gap-4 text-xs leading-relaxed text-muted">
      <p><span className="text-ink">{lesson.teacher}</span><br/>{lesson.focus}</p>
      <a className="shrink-0 hover:text-accent" href={`https://www.youtube.com/watch?v=${lesson.id}`} target="_blank" rel="noreferrer" aria-label={`Open ${lesson.title} on YouTube if playback is unavailable`}><ExternalLink size={15}/></a>
    </div>
    <p className="mt-2 text-[11px] text-muted">Playback requires internet and may depend on YouTube region or embed settings.</p>
  </section>
}
