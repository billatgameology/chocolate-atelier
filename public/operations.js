import {PathSampler} from './engine.js?v=4';

const distance=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1]);
const blend=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];

// Spatial samples are compiled once. Frame rate and replay speed only decide
// when to apply them; they never change the resulting material deformation.
export class OperationRunner {
  constructor(surface,op){
    this.surface=surface;this.op=op;this.samples=[];this.cursor=0;this.distance=0;this.done=false;
    this.position=op.point||op.points[0];this.previous=this.position;
    if(op.type==='dot'){this.length=.04;this.base=surface.snapshot();return;}
    let total=0;
    if(op.type==='pipe'){
      this.samples.push({point:op.points[0],distance:0});
      for(let i=1;i<op.points.length;i++){
        const a=op.points[i-1],b=op.points[i],d=distance(a,b),steps=Math.max(1,Math.ceil(d*surface.n/1.3));
        for(let j=1;j<=steps;j++)this.samples.push({point:blend(a,b,j/steps),distance:total+d*j/steps});
        total+=d;
      }
    }else{
      const sampler=new PathSampler(op.points[0]);
      const add=segments=>{for(const [a,b] of segments){total+=distance(a,b);this.samples.push({a,b,distance:total});}};
      for(const p of op.points.slice(1))add(sampler.feed(p));add(sampler.finish());
    }
    this.length=total;
  }
  advanceTo(value){
    if(this.done)return;
    this.distance=Math.min(this.length,Math.max(this.distance,value));
    const {surface:s,op}=this;
    if(op.type==='dot'){
      s.restore(this.base,false);s.dab(...op.point,op.radius*this.distance/this.length);
    }else{
      while(this.cursor<this.samples.length&&this.samples[this.cursor].distance<=this.distance+1e-12){
        const sample=this.samples[this.cursor++];this.previous=this.position;
        if(op.type==='pipe'){s.dab(...sample.point,op.width/2);this.position=sample.point;}
        else{
          const {a,b}=sample,r=Math.hypot((a[0]+b[0])/2-.5,(a[1]+b[1])/2-.5);
          const t=Math.min(1,r/.23),smooth=t*t*(3-2*t),floor=op.taperFloor??.42,radius=op.radius*(op.taper ? floor+(1-floor)*smooth : 1);
          s.dragStep(a,b,radius,op.strength??1);this.position=b;
        }
      }
    }
    this.done=this.distance>=this.length;
  }
  get progress(){return this.length?this.distance/this.length:1;}
}

export function applyOperation(surface,op){const run=new OperationRunner(surface,op);run.advanceTo(Infinity);}

// Pause preserves the partial operation. A step animates its remainder and
// stops at the boundary. Capped elapsed time avoids jumps after hidden tabs.
export class RecipeReplay {
  constructor(surface,{onFrame=()=>{},onState=()=>{},onComplete=()=>{},requestFrame=fn=>requestAnimationFrame(fn),cancelFrame=id=>cancelAnimationFrame(id)}={}){
    Object.assign(this,{surface,onFrame,onState,onComplete,requestFrame,cancelFrame});this.active=false;this.playing=false;this.speed=.5;this.generation=0;
  }
  start(commands){this.cancel();this.commands=commands;this.index=0;this.runner=null;this.gap=0;this.active=true;this.playing=true;this.stopAtBoundary=false;this.last=null;this.surface.reset();this.onState();this.schedule();}
  schedule(){if(!this.active||!this.playing||this.frame!=null)return;const token=this.generation;this.frame=this.requestFrame(time=>{this.frame=null;if(token!==this.generation)return;this.tick(time);});}
  tick(time){
    if(!this.active||!this.playing)return;
    const dt=this.last==null?0:Math.max(0,Math.min(.06,(time-this.last)/1000));this.last=time;
    if(this.gap>0){this.gap=Math.max(0,this.gap-dt);this.schedule();return;}
    if(!this.runner)this.runner=new OperationRunner(this.surface,this.commands[this.index]);
    const rate={pipe:1.7,drag:1.3,dot:.12}[this.runner.op.type];
    this.runner.advanceTo(this.runner.distance+dt*rate*this.speed);this.onFrame(this.runner,this.index,this.commands.length);
    if(this.runner.done){
      this.index++;this.runner=null;
      if(this.index===this.commands.length){this.active=false;this.playing=false;this.last=null;this.onState();this.onComplete();return;}
      this.gap=.18/this.speed;
      if(this.stopAtBoundary){this.stopAtBoundary=false;this.pause();return;}
    }
    this.schedule();
  }
  pause(){if(!this.active)return;this.playing=false;this.last=null;if(this.frame!=null)this.cancelFrame(this.frame);this.frame=null;this.onState();}
  resume(){if(!this.active||this.playing)return;this.stopAtBoundary=false;this.playing=true;this.last=null;this.onState();this.schedule();}
  step(){if(!this.active||this.playing)return;this.stopAtBoundary=true;this.gap=0;this.playing=true;this.last=null;this.onState();this.schedule();}
  cancel(){this.generation++;if(this.frame!=null)this.cancelFrame(this.frame);this.frame=null;this.active=false;this.playing=false;this.runner=null;this.last=null;}
}
