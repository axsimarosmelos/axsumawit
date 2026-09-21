import test from 'node:test'
import assert from 'node:assert/strict'
import { DAY, emptyProgress, INTERVALS, parseProgress, remainingSeconds, scheduleReview } from '../src/lib/progress.ts'
import type { Review } from '../src/lib/progress.ts'

test('successful recall advances through 1, 3, 7, 14, 30 days and stays at 30',()=>{
  const now=1_000_000
  let review:Review|undefined
  for(const days of [...INTERVALS,30]){
    review=scheduleReview(review,true,now)
    assert.equal(review.dueAt,now+days*DAY)
  }
  assert.equal(review?.step,5)
})
test('a miss returns in ten minutes and restarts the ladder',()=>{
  const failed=scheduleReview({step:4,dueAt:100,lastReviewed:10},false,1000)
  assert.equal(failed.dueAt,601000)
  assert.equal(failed.step,0)
  assert.equal(scheduleReview(failed,true,700000).dueAt,700000+DAY)
})
test('timer uses the deadline after tab throttling and never goes negative',()=>{
  assert.equal(remainingSeconds(60000,0),60)
  assert.equal(remainingSeconds(60000,20001),40)
  assert.equal(remainingSeconds(60000,59000),1)
  assert.equal(remainingSeconds(60000,60000),0)
  assert.equal(remainingSeconds(60000,240000),0)
})
test('progress survives a JSON round trip with a false checkbox intact',()=>{
  const state={...emptyProgress,completed:{'p1-em':true,'p1-d':false},reviews:{'chord-G':scheduleReview(undefined,true,100)},drills:[{id:'round1',pair:'G ↔ C',count:28,at:100}]}
  assert.deepEqual(parseProgress(JSON.parse(JSON.stringify(state))),state)
})
test('malformed, incompatible, and stale saved data cannot corrupt the UI',()=>{
  assert.equal(parseProgress(null),null)
  assert.equal(parseProgress({version:2}),null)
  const result=parseProgress({version:1,completed:{'p1-em':true,'missing':true,'p1-d':'yes'},reviews:{'chord-G':{step:900,dueAt:100,lastReviewed:0}},drills:[{id:'bad',pair:'G ↔ C',count:-1,at:0}]})
  assert.deepEqual(result,{version:1,completed:{'p1-em':true},reviews:{},drills:[]})
})
