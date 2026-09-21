import { chords } from '../data/curriculum'
import type { ChordName } from '../data/curriculum'

export default function ChordDiagram({ name, compact = false }: { name: ChordName; compact?: boolean }) {
  const chord = chords[name]
  return <svg viewBox="0 0 116 142" className={compact ? 'h-24 w-auto' : 'h-32 w-auto'} role="img" aria-label={`${name} chord. ${chord.description}`}>
    <text x="58" y="17" textAnchor="middle" fill="currentColor" fontSize="19" fontWeight="600">{name}</text>
    {['E','A','D','G','B','e'].map((label, i) => <text key={i} x={23+i*14} y="140" textAnchor="middle" fontSize="8" fill="#a3adaa">{label}</text>)}
    {[0,1,2,3,4].map(i => <line key={i} x1="23" y1={46+i*19} x2="93" y2={46+i*19} stroke={i===0 ? '#bec5be' : '#65716a'} strokeWidth={i===0 ? 3 : 1} />)}
    {chord.frets.map((fret, i) => <g key={i}>
      <line x1={23+i*14} x2={23+i*14} y1="46" y2="122" stroke="#65716a" strokeWidth="1" />
      {fret > 0 ? <><circle cx={23+i*14} cy={46+(fret-.5)*19} r="6" fill="#edb77c"/><text x={23+i*14} y={49+(fret-.5)*19} textAnchor="middle" fill="#1b221e" fontSize="8" fontWeight="700">{chord.fingers[i]}</text></> : <text x={23+i*14} y="37" textAnchor="middle" fontSize="12" fill="#c9d0c9">{fret===0 ? '○' : '×'}</text>}
    </g>)}
  </svg>
}
