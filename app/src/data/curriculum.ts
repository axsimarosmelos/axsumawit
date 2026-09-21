export type ChordName = 'G' | 'C' | 'D' | 'Em'
export type Task = { id: string; title: string; detail: string; kind: 'Learn' | 'Recall' | 'Drill' | 'Play' | 'Milestone' }
export type Lesson = { id: string; title: string; teacher: string; focus: string }
export type Phase = { id: number; title: string; subtitle: string; pace: string; goal: string; tags: string[]; tasks: Task[]; lessons: Lesson[] }

// String order is always low E -> A -> D -> G -> B -> high e.
// -1 = do not play; 0 = open string. Finger numbers: 1 index ... 4 little.
export const chords: Record<ChordName, { frets: number[]; fingers: number[]; description: string }> = {
  G: { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], description: 'Middle: low E, fret 3. Index: A, fret 2. Ring: high e, fret 3. Play all six strings.' },
  C: { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], description: 'Ring: A, fret 3. Middle: D, fret 2. Index: B, fret 1. Play from the A string; omit low E.' },
  D: { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], description: 'Index: G, fret 2. Ring: B, fret 3. Middle: high e, fret 2. Play from the open D string.' },
  Em: { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], description: 'Middle: A, fret 2. Ring: D, fret 2. All other strings open. Play all six strings.' },
}

const changes: Lesson = { id: 'mAgc7hr44WM', title: 'Faster chord changes', teacher: 'JustinGuitar', focus: 'Borrow the one-minute method; use only G, C, D and Em for your drills.' }
const rhythm: Lesson = { id: 'NNl9OpLQzmk', title: 'Four down-strums', teacher: 'JustinGuitar', focus: 'Count 1, 2, 3, 4. Keep your arm loose and use Em or G throughout.' }
const faithful: Lesson = { id: '6LmQCdt_ZhQ', title: 'The essential strumming pattern', teacher: 'JustinGuitar', focus: 'Learn the rhythm on muted strings, then transfer it to your four core chords.' }
const dynamics: Lesson = { id: 'mP4knhljqj0', title: 'Strumming with dynamics', teacher: 'JustinGuitar', focus: 'Keep time while changing volume. Apply the technique to G–D–Em–C.' }
const fretboard: Lesson = { id: 'PJddQ6Q0UDo', title: 'Memorize your fretboard', teacher: 'Tommaso Zillio · MusicTheoryForGuitar', focus: 'Start with natural notes on low E and A, then work across the strings. Name a note before you play it.' }

export const phases: Phase[] = [
  {
    id: 1, title: 'Your four-chord foundation', subtitle: 'Build the small set of skills that opens up a world of songs.', pace: 'Suggested weeks 1–2',
    goal: 'Recall all four shapes and play a clean, steady four-chord loop.', tags: ['G · C · D · Em', 'Down-strums', '80/20 focus'],
    tasks: [
      { id: 'p1-em', title: 'Make Em ring clearly', detail: 'Watch the Em lesson. Form the shape, pick each string, adjust any muted notes, then lift and rebuild it five times.', kind: 'Learn' },
      { id: 'p1-d', title: 'Build a clean D chord', detail: 'Watch the D lesson. Start your strum at string 4. Pick the four sounding strings, then rebuild the shape five times.', kind: 'Learn' },
      { id: 'p1-g', title: 'Find your G chord', detail: 'Watch the G lesson. Use the 320003 shape shown below. Pick all six strings, then lift and replace your fingers five times.', kind: 'Learn' },
      { id: 'p1-c', title: 'Get comfortable with C', detail: 'Watch the C lesson. Keep fingertips curved and omit low E. Pick strings 5 to 1, then rebuild the shape five times.', kind: 'Learn' },
      { id: 'p1-rhythm', title: 'Keep four down-strums moving', detail: 'Watch the rhythm lesson. Count 1–2–3–4 aloud and play Em for eight bars at 60 BPM. Use a metronome; slow down if you lose the beat.', kind: 'Play' },
      { id: 'p1-recall', title: 'Rebuild the shapes from memory', detail: 'Hide the diagrams. Use the Chord shapes recall deck: say each fingering, form the chord, then reveal and check. Rate honestly; revisit when due.', kind: 'Recall' },
      { id: 'p1-drill', title: 'Log your first one-minute changes', detail: 'Watch Faster chord changes. Time G ↔ C and D ↔ Em separately. Count each clean arrival as one change; G → C → G is two. Save both scores.', kind: 'Drill' },
      { id: 'p1-gate', title: 'Milestone: four shapes, one steady loop', detail: 'Without diagrams, form all four chords and play G–D–Em–C for eight bars, one chord per bar, with four down-strums at 60 BPM. Repeat cleanly on two separate days.', kind: 'Milestone' },
    ],
    lessons: [
      { id: 'Hfm4-yOI6oA', title: 'The E minor chord', teacher: 'JustinGuitar', focus: 'Start here: two fingers, six ringing strings.' },
      { id: 'QkrIZBLZEXw', title: 'The D chord', teacher: 'JustinGuitar', focus: 'A compact shape. Strum only the top four strings.' },
      { id: 'gEzwpqmt2gc', title: 'The G chord', teacher: 'JustinGuitar', focus: 'Use the 320003 voicing; choose a comfortable fingering and stay consistent.' },
      { id: 'f18EV2dr008', title: 'The C chord', teacher: 'JustinGuitar', focus: 'Curve your fingers so the open G and high e can ring.' }, rhythm, changes,
    ],
  },
  {
    id: 2, title: 'Make the rhythm feel natural', subtitle: 'Same four chords. Smoother changes. Much more music.', pace: 'Suggested weeks 3–4',
    goal: 'Keep a reliable pulse while moving between your four core chords.', tags: ['Eighth notes', 'One-minute changes', 'First arrangements'],
    tasks: [
      { id: 'p2-down', title: 'Connect all four chords at 60 BPM', detail: 'Play G–C–D–Em for 16 bars, one chord per bar, using four down-strums. Move the fretting hand just before the next beat 1.', kind: 'Play' },
      { id: 'p2-eighth', title: 'Add even down-up motion', detail: 'On muted strings, count 1 & 2 & 3 & 4 & and alternate down-up strokes for one minute. Then try Em, keeping each upstroke light.', kind: 'Learn' },
      { id: 'p2-pattern', title: 'Learn the essential five-stroke pattern', detail: 'Watch the strumming lesson. Use D – D U – U D – over 1 & 2 & 3 & 4 &. A dash means miss the strings but keep the arm moving. Try G for eight bars before changing chords.', kind: 'Learn' },
      { id: 'p2-drill', title: 'Train your two slowest transitions', detail: 'Rotate through G↔C, G↔D, G↔Em, C↔D, C↔Em and D↔Em across sessions. Run one minute for each weak pair, rest, then repeat. Aim toward 30 clean changes without squeezing harder.', kind: 'Drill' },
      { id: 'p2-recall', title: 'Recall the shapes and strum without cues', detail: 'Complete due chord cards. Turn away from the screen, form each shape, and clap or strum the five-stroke rhythm from memory before checking.', kind: 'Recall' },
      { id: 'p2-arrange', title: 'Play two four-chord arrangements', detail: 'Make a 16-bar study from G–D–Em–C and another from Em–C–G–D. Repeat each four-bar loop four times. Start with down-strums, then add the pattern. These are practice arrangements, not exact recordings.', kind: 'Play' },
      { id: 'p2-gate', title: 'Milestone: stay in time for two minutes', detail: 'Play a four-chord arrangement at 60–80 BPM for two minutes without stopping. Record it on your phone and listen for steady timing and clear chords on two separate days.', kind: 'Milestone' },
    ], lessons: [faithful, changes, rhythm],
  },
  {
    id: 3, title: 'Know the notes. Trust your hands.', subtitle: 'Connect the shapes you know to the notes underneath them.', pace: 'Suggested weeks 5–6',
    goal: 'Recall useful fretboard landmarks and maintain your chord fluency.', tags: ['Fretboard recall', 'Spaced repetition', 'Dynamics'],
    tasks: [
      { id: 'p3-strings', title: 'Recall all six open-string notes', detail: 'Say and play E–A–D–G–B–E from thickest to thinnest. Then answer in a shuffled string order without a diagram. Check using the Fretboard notes deck.', kind: 'Recall' },
      { id: 'p3-landmarks', title: 'Learn the low E and A landmarks', detail: 'Watch the fretboard lesson. Low E frets 0,1,3,5,7,8,10,12: E,F,G,A,B,C,D,E. A string: A,B,C,D,E,F,G,A at frets 0,2,3,5,7,8,10,12. Say each note before playing it.', kind: 'Learn' },
      { id: 'p3-random', title: 'Retrieve ten notes from memory', detail: 'Use the Fretboard notes deck. Read a string/fret prompt, say and play your answer before Reveal. For a named-note prompt, find it without counting up from fret 0. Mark misses Again.', kind: 'Recall' },
      { id: 'p3-space', title: 'Return for three spaced review sessions', detail: 'Complete due cards on three different days. Successful recalls get the next 1, 3, 7, 14 or 30-day interval. A miss returns in 10 minutes and restarts the interval ladder.', kind: 'Recall' },
      { id: 'p3-drill', title: 'Retest your weakest chord pair', detail: 'Run two one-minute trials with a short rest. Compare clean changes with your earlier saved scores. Accuracy comes before speed; keep the same four shapes.', kind: 'Drill' },
      { id: 'p3-dynamics', title: 'Give your playing a quiet and loud voice', detail: 'Watch the dynamics lesson. Play eight quiet bars and eight stronger bars of G–D–Em–C at the same tempo. Keep the fretting pressure relaxed and the pulse unchanged.', kind: 'Play' },
      { id: 'p3-gate', title: 'Milestone: recall and rhythm together', detail: 'Answer at least 8 of 10 mixed note prompts before revealing. Then play both arrangements from memory with a clear change in volume. Repeat on another day.', kind: 'Milestone' },
    ], lessons: [fretboard, dynamics, changes],
  },
  {
    id: 4, title: 'Turn practice into performance', subtitle: 'Play from memory, listen closely, and build your own repertoire.', pace: 'Week 7 onward',
    goal: 'Perform a small set confidently and use recordings to guide your next steps.', tags: ['Play from memory', 'Record & reflect', 'Keep it musical'],
    tasks: [
      { id: 'p4-map', title: 'Build a three-piece mini set', detail: 'Use your two arrangements plus a third using G–C–G–D. Make each piece 32 bars with a quiet 16-bar section and a stronger 16-bar section. Write the forms once, then put the sheet away.', kind: 'Play' },
      { id: 'p4-recall', title: 'Retrieve the whole set before playing', detail: 'From a blank page, write the chord order and section lengths for all three pieces. Check against your original map, then play each opening without looking.', kind: 'Recall' },
      { id: 'p4-drill', title: 'Repair the transition that breaks the flow', detail: 'Choose the weak pair from your recording. Run a one-minute trial, work on relaxed movement slowly, and run a second trial. Return it to a full musical phrase.', kind: 'Drill' },
      { id: 'p4-record', title: 'Record a complete performance', detail: 'Watch the dynamics refresher. Record your three-piece set on your phone at a comfortable tempo, without tabs. Keep going through small mistakes; note one timing issue and one tone issue afterward.', kind: 'Play' },
      { id: 'p4-space', title: 'Keep the memory alive', detail: 'Check both recall decks for due cards at each practice. Retrieve the full set again after 1, 3 and 7 days; tick this task after completing all three returns.', kind: 'Recall' },
      { id: 'p4-song', title: 'Apply your skills to a full song', detail: 'Work through the embedded Wonderful Tonight lesson. Keep your core chord approach for the accompaniment, then learn any extra detail the actual arrangement needs. Write the song form and play it from memory.', kind: 'Play' },
      { id: 'p4-gate', title: 'Milestone: a repeatable, musical performance', detail: 'Perform your mini set and full song from memory twice on separate days. Keep the beat through changes and use deliberate dynamics. Next, expand toward new chords, ear training and lead playing based on the songs you want to play.', kind: 'Milestone' },
    ], lessons: [
      { id: 'd4_8TJaGBHo', title: 'Wonderful Tonight: song lesson', teacher: 'JustinGuitar', focus: 'Put familiar chord skills into a complete song. Follow the lesson for the actual arrangement and any added details.' }, dynamics, faithful,
    ],
  },
]

export const taskIds = new Set(phases.flatMap(p => p.tasks.map(t => t.id)))
export const pairs = ['G ↔ C', 'G ↔ D', 'G ↔ Em', 'C ↔ D', 'C ↔ Em', 'D ↔ Em'] as const
export type Pair = typeof pairs[number]

export type RecallCard = { id: string; category: 'chords' | 'notes'; prompt: string; answer: string; chord?: ChordName }
export const recallCards: RecallCard[] = [
  ...(['G', 'C', 'D', 'Em'] as ChordName[]).map(chord => ({ id: `chord-${chord}`, category: 'chords' as const, prompt: `Build ${chord} from memory. Which strings do you play?`, answer: chords[chord].description, chord })),
  ...['low E', 'A', 'D', 'G', 'B', 'high e'].map((name, i) => ({ id: `open-${6-i}`, category: 'notes' as const, prompt: `What is the open-string note on string ${6-i}?`, answer: `${name === 'low E' || name === 'high e' ? 'E' : name}. String 6 is the thickest; string 1 is the thinnest.` })),
  ...[ { name: 'low E', positions: [[1,'F'],[3,'G'],[5,'A'],[7,'B'],[8,'C'],[10,'D'],[12,'E']] }, { name: 'A', positions: [[2,'B'],[3,'C'],[5,'D'],[7,'E'],[8,'F'],[10,'G'],[12,'A']] } ].flatMap(string => string.positions.map(([fret, note]) => ({ id: `${string.name}-${fret}`, category: 'notes' as const, prompt: `Name and play the note on the ${string.name} string, fret ${fret}.`, answer: `${note}. Say the note first, then play and check.` }))),
  { id: 'find-c', category: 'notes', prompt: 'Find C on the A string without counting from the nut.', answer: 'A string, fret 3. This is the lowest note of your open C chord.' },
  { id: 'find-g', category: 'notes', prompt: 'Find G on the low E string without counting from the nut.', answer: 'Low E string, fret 3. This is the lowest note of your open G chord.' },
  { id: 'semitones', category: 'notes', prompt: 'Which pairs of natural notes have no sharp or flat between them?', answer: 'B–C and E–F. These pairs are one fret apart.' },
]
