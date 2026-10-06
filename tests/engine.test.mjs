import assert from 'node:assert/strict';
import {ChocolateSurface,arc} from '../public/engine.js';
import {recipes} from '../public/recipes.js';
import {applyOperation,OperationRunner,RecipeReplay} from '../public/operations.js';
const canvas=()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}})});
function seeded(){const s=new ChocolateSurface(canvas());s.pipe(arc(.11),9);s.dab(.5,.5,7);return s;}
const blank=new ChocolateSurface(canvas());blank.drag([[.5,.1],[.5,.9]],8,.78);assert.equal(blank.ink.reduce((a,b)=>a+b,0),0,'skewer cannot create chocolate');
const a=seeded(),b=seeded();a.drag([[.5,.25],[.5,.75]],7,.78);b.drag(Array.from({length:257},(_,i)=>[.5,.25+.5*i/256]),7,.78);let maxDifference=0;for(let i=0;i<a.ink.length;i++)maxDifference=Math.max(maxDifference,Math.abs(a.ink[i]-b.ink[i]));assert.ok(maxDifference<1e-5,'dense and sparse straight paths must agree');
const original=a.snapshot();a.pipe([[.1,.5],[.9,.5]],15);a.restore(original);assert.deepEqual(a.ink,original.ink);assert.deepEqual(a.milk,original.milk);
const edge=new ChocolateSurface(canvas());edge.pipe([[-.5,.5],[1.5,.5]],22);edge.drag([[.5,.5],[1.5,.5]],20,.78);for(let y=0;y<512;y++)for(let x=0;x<512;x++)if(Math.hypot(x-256,y-256)>512*.474)assert.equal(edge.ink[y*512+x],0,'chocolate must stay inside foam');
for(const r of recipes){
 const s=new ChocolateSurface(canvas()),animated=new ChocolateSurface(canvas());
 for(const op of r.commands){
  applyOperation(s,op);
  const runner=new OperationRunner(animated,op);
  // Uneven time chunks deliberately cross segment boundaries.
  for(const fraction of [.013,.13,.31,.62,.91,1])runner.advanceTo(runner.length*fraction);
 }
 assert.deepEqual(animated.ink,s.ink,r.id+' progressive and immediate chocolate must match exactly');
 assert.deepEqual(animated.milk,s.milk,r.id+' progressive and immediate foam must match exactly');
 assert.ok(s.ink.some(v=>v>.3),r.id+' retains visible chocolate');assert.ok(s.ink.every(Number.isFinite)&&s.milk.every(Number.isFinite),r.id+' stays finite');assert.equal(typeof r.seedDescription,'string');assert.equal(typeof r.pullDescription,'string');
}
const spiral=new ChocolateSurface(canvas());for(const op of recipes[0].seed)applyOperation(spiral,op);const run=new OperationRunner(spiral,recipes[0].pull[0]),base=spiral.snapshot();run.advanceTo(run.length*.25);const quarter=spiral.snapshot();run.advanceTo(run.length*.5);assert.notDeepEqual(quarter.ink,base.ink);assert.notDeepEqual(spiral.ink,quarter.ink,'spiral keeps developing within its final stroke');assert.ok(!run.done);
let time=0,sequence=0,frames=new Map(),completed=0;
const requestFrame=fn=>{const id=++sequence;frames.set(id,fn);return id;},cancelFrame=id=>frames.delete(id);
const tick=(dt=16)=>{time+=dt;const pending=[...frames.values()];frames.clear();for(const fn of pending)fn(time);};
const replaySurface=new ChocolateSurface(canvas()),player=new RecipeReplay(replaySurface,{requestFrame,cancelFrame,onComplete:()=>completed++});
player.start([{type:'pipe',points:[[.2,.5],[.8,.5]],width:5,label:'Pipe'}, {type:'drag',points:[[.5,.2],[.5,.8]],radius:7,strength:.78,label:'Drag'}]);
tick();tick(10000);assert.ok(player.runner.progress<.1,'long frames are capped rather than jumping to the end');
player.pause();const paused=replaySurface.snapshot();tick(500);assert.deepEqual(replaySurface.ink,paused.ink,'pause freezes a partial stroke');
player.step();player.step();for(let i=0;i<200&&player.playing;i++)tick();assert.equal(player.index,1,'one step finishes exactly one command');assert.equal(player.playing,false);assert.equal(player.runner,null);
player.speed=2;player.resume();for(let i=0;i<200&&player.active;i++)tick();assert.equal(completed,1);assert.equal(player.active,false);
player.start(recipes[0].commands);const stale=[...frames.values()][0];player.cancel();const cancelled=replaySurface.snapshot();stale(time+50);tick();assert.deepEqual(replaySurface.ink,cancelled.ink,'cancel invalidates queued frames');assert.equal(completed,1);
console.log('PASS: material invariants, all six exact replay outcomes, progressive spiral, long-frame cap, pause/resume, single-step and stale-frame cancellation');
