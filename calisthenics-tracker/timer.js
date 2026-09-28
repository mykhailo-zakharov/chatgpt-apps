(function(){
  const STORAGE_KEY='ct-rest-duration';
  const DEFAULT=90;
  let duration=Number(localStorage.getItem(STORAGE_KEY))||DEFAULT;
  let remaining=duration;
  let interval=null;
  let running=false;
  let paused=false;
  let pendingScroll=null;
  const byId=id=>document.getElementById(id);
  const format=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const setTitle=t=>{document.title=t?`${t} · Calisthenics Tracker`:'Calisthenics Tracker';};
  function beep(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=880;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.18,c.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.16);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.17);setTimeout(()=>c.close(),250);}catch(e){}}
  function renderTimer(){const display=byId('timerDisplay'),start=byId('timerStart'),reset=byId('timerReset'),presets=byId('timerPresets'),title=byId('timerTitle');if(display)display.textContent=format(remaining);if(start)start.textContent=running?(paused?'Resume':'Pause'):'Start';if(reset)reset.hidden=!running;if(presets)presets.hidden=running;if(display)display.hidden=!running;if(title)title.textContent=running?(paused?'Paused':'Rest'):'Rest';document.querySelectorAll('.timer-preset').forEach(b=>b.classList.toggle('active',Number(b.dataset.seconds)===duration));setTitle(running?`⏱ ${format(remaining)}`:'');}
  function finish(){clearInterval(interval);interval=null;running=false;paused=false;remaining=0;renderTimer();beep();setTimeout(beep,220);const d=byId('timerDisplay');if(d){d.classList.add('finished');setTimeout(()=>d.classList.remove('finished'),1200);}if(navigator.vibrate)navigator.vibrate([100,80,180]);if(pendingScroll){setTimeout(()=>{pendingScroll.scrollIntoView({behavior:'smooth',block:'center'});pendingScroll=null;},300);}}
  function tick(){if(!running||paused)return;remaining=Math.max(0,remaining-1);if(remaining>0&&remaining<=3)beep();if(remaining===0)finish();else renderTimer();}
  function start(){if(running){paused=!paused;renderTimer();return;}remaining=duration;running=true;paused=false;renderTimer();beep();clearInterval(interval);interval=setInterval(tick,1000);}
  function reset(){clearInterval(interval);interval=null;running=false;paused=false;pendingScroll=null;remaining=duration;renderTimer();}
  function choose(seconds){duration=seconds;remaining=seconds;localStorage.setItem(STORAGE_KEY,String(seconds));if(!running)renderTimer();}
  function markSetDone(card,setIndex,button){
    const index=Number(card.dataset.index),k=`${currentDay}-${index}`,s=state[k]||{},done=[...(s.setsDone||[])];done[setIndex]=!done[setIndex];state[k]={...s,setsDone:done};save();button.classList.toggle('done',!!done[setIndex]);button.textContent=done[setIndex]?'Done ✓':'Done';
    if(done[setIndex]){const rows=card.querySelectorAll('.set-row');const next=rows[setIndex+1];if(next){pendingScroll=next;start();}else{const nextExercise=document.querySelector(`.exercise[data-index="${index+1}"]`);pendingScroll=nextExercise||null;start();}}
  }
  function enhanceSets(){document.querySelectorAll('.exercise').forEach(card=>card.querySelectorAll('.sets label').forEach((label,i)=>{if(label.querySelector('.set-done'))return;label.classList.add('set-row');const b=document.createElement('button');b.type='button';b.className='set-done';b.textContent='Done';const s=state[`${currentDay}-${Number(card.dataset.index)}`]||{};if(s.setsDone?.[i]){b.classList.add('done');b.textContent='Done ✓';}b.addEventListener('click',()=>markSetDone(card,i,b));label.appendChild(b);}));}
  function init(){byId('timerStart')?.addEventListener('click',start);byId('timerReset')?.addEventListener('click',reset);document.querySelectorAll('.timer-preset').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.seconds))));remaining=duration;renderTimer();enhanceSets();const workout=byId('workout');if(workout)new MutationObserver(()=>enhanceSets()).observe(workout,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();