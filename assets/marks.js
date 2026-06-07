/* ============================================================
   KIVONTI — Marks engine
   The 11-bar symmetric "signal column" rendered as live SVG,
   plus a reactive voice-orb that responds to a driver value.
   ============================================================ */
(function(){
  const BARS = [
    {x:15, hf:0.30, role:'g'},  {x:24, hf:0.46, role:'c'},  {x:33, hf:0.62, role:'o'},
    {x:42, hf:0.80, role:'ol'}, {x:51, hf:0.93, role:'c'},  {x:60, hf:1.00, role:'o2'},
    {x:69, hf:0.93, role:'c'},  {x:78, hf:0.80, role:'ol'}, {x:87, hf:0.62, role:'o'},
    {x:96, hf:0.46, role:'c'},  {x:105, hf:0.30, role:'g'},
  ];
  let __mid = 0;

  function strokeFor(role, variant){
    if(variant==='white')      return {s:'#FFFFFF', o:({g:.34,c:.78,o:.95,ol:.55,o2:1})[role]};
    if(variant==='brandlight'){
      const map={g:['#B9B2A8',1],c:['#8A8378',1],o:['#E2742A',1],ol:['#EFA463',1],o2:['#C2551A',1]};
      return {s:map[role][0], o:map[role][1]};
    }
    const map={g:['ig',.30], c:['ig',.62], o:['og',1], ol:['og',.82], o2:['og',1]};
    return {s:map[role][0], o:map[role][1]};
  }

  function buildMark(h, {glow=false, animate=false, variant=null}={}){
    const uid='m'+(__mid++);
    const VB_W=120, VB_H=240, mid=120, maxH=214, sw=4.4;
    const w = h*(VB_W/VB_H);
    let lines='';
    BARS.forEach((b,i)=>{
      let {s,o}=strokeFor(b.role,variant);
      if(s==='og') s=`url(#og_${uid})`;
      else if(s==='ig') s=`url(#ig_${uid})`;
      const bh=b.hf*maxH;
      const sv=(0.80+0.20*(1-b.hf)).toFixed(3);
      const cls=animate?'voice':'';
      const delay=(Math.abs(i-5)*0.13).toFixed(2);
      lines+=`<line class="${cls}" x1="${b.x}" y1="${mid-bh/2}" x2="${b.x}" y2="${mid+bh/2}" stroke="${s}" stroke-opacity="${o}" stroke-width="${sw}" stroke-linecap="round" style="--sv:${sv};animation-delay:${delay}s"/>`;
    });
    const dotCol = variant==='white' ? '#fff' : (variant==='brandlight' ? '#C2551A' : '#F4AE6E');
    lines+=`<circle cx="60" cy="${mid}" r="2.6" fill="${dotCol}"/>`;
    const filter = glow ? 'filter:drop-shadow(0 0 5px rgba(226,116,42,.6)) drop-shadow(0 0 13px rgba(226,116,42,.22));' : '';
    const acls = animate ? 'animated' : '';
    const defs = `<defs>`+
      `<linearGradient id="og_${uid}" gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="230"><stop offset="0%" stop-color="#F4AE6E"/><stop offset="48%" stop-color="#E2742A"/><stop offset="100%" stop-color="#B85513"/></linearGradient>`+
      `<linearGradient id="ig_${uid}" gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="230"><stop offset="0%" stop-color="#E9E4DB"/><stop offset="100%" stop-color="#7E776D"/></linearGradient>`+
    `</defs>`;
    return `<svg class="${acls}" width="${w}" height="${h}" viewBox="0 0 ${VB_W} ${VB_H}" style="display:block;overflow:visible;${filter}">${defs}${lines}</svg>`;
  }

  // render all static marks
  function renderMarks(root=document){
    root.querySelectorAll('[data-mark]:not([data-built])').forEach(el=>{
      const h=+el.getAttribute('data-mark');
      el.innerHTML=buildMark(h,{
        glow: el.hasAttribute('data-glow'),
        animate: el.hasAttribute('data-animate'),
        variant: el.getAttribute('data-variant'),
      });
      el.setAttribute('data-built','1');
    });
  }

  /* ---------- Reactive Voice Orb ----------
     A taller signal column whose bar heights track a live amplitude.
     drive(amp 0..1) sets the target; bars ease toward it with per-bar
     phase so it reads like a breathing/listening voice. */
  function VoiceOrb(el, opts={}){
    const N = 11;
    const center = (N-1)/2;
    const VB_W=320, VB_H=320, midY=160, midX=160;
    const gap = 22, sw = 7;
    const NS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(NS,'svg');
    svg.setAttribute('viewBox',`0 0 ${VB_W} ${VB_H}`);
    svg.setAttribute('width','100%');
    svg.setAttribute('height','100%');
    svg.style.overflow='visible';
    svg.style.filter='drop-shadow(0 0 16px rgba(226,116,42,.35))';
    svg.innerHTML=`<defs>
      <linearGradient id="orb_og" gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="300">
        <stop offset="0%" stop-color="#F8C896"/><stop offset="48%" stop-color="#E2742A"/><stop offset="100%" stop-color="#A84A11"/>
      </linearGradient>
      <radialGradient id="orb_halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(226,116,42,.28)"/><stop offset="100%" stop-color="rgba(226,116,42,0)"/>
      </radialGradient>
    </defs>`;
    const halo=document.createElementNS(NS,'circle');
    halo.setAttribute('cx',midX);halo.setAttribute('cy',midY);halo.setAttribute('r',150);
    halo.setAttribute('fill','url(#orb_halo)');
    svg.appendChild(halo);

    const lines=[];
    const base=[];
    for(let i=0;i<N;i++){
      const x = midX + (i-center)*gap;
      const dist = Math.abs(i-center)/center;             // 0 center .. 1 edges
      const b = 1 - 0.62*dist;                             // base height factor
      base.push(b);
      const ln=document.createElementNS(NS,'line');
      ln.setAttribute('x1',x);ln.setAttribute('x2',x);
      ln.setAttribute('stroke','url(#orb_og)');
      ln.setAttribute('stroke-width',sw);
      ln.setAttribute('stroke-linecap','round');
      ln.setAttribute('stroke-opacity', (0.5+0.5*(1-dist)).toFixed(2));
      svg.appendChild(ln);
      lines.push(ln);
    }
    const dot=document.createElementNS(NS,'circle');
    dot.setAttribute('cx',midX);dot.setAttribute('cy',midY);dot.setAttribute('r',4.5);
    dot.setAttribute('fill','#F8C896');
    svg.appendChild(dot);
    el.appendChild(svg);

    const maxH = 230;
    let target = 0.18, cur = 0.18;
    const phase = base.map((_,i)=>i*0.7);
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    let t=0, raf;

    function frame(){
      t+=0.016;
      cur += (target-cur)*0.12;
      for(let i=0;i<N;i++){
        const wobble = reduce ? 0 : (Math.sin(t*2.1+phase[i])*0.5+0.5);
        const idle = 0.12 + 0.06*Math.sin(t*1.3 + i*0.5);   // gentle breathing
        const amp = base[i]*(idle + cur*(0.55 + 0.45*wobble));
        const h = Math.max(8, amp*maxH);
        lines[i].setAttribute('y1', midY - h/2);
        lines[i].setAttribute('y2', midY + h/2);
      }
      const hr = 120 + cur*70;
      halo.setAttribute('r', hr);
      halo.setAttribute('opacity', 0.6 + cur*0.4);
      raf=requestAnimationFrame(frame);
    }
    frame();

    return {
      drive(v){ target = Math.max(0, Math.min(1, v)); },
      idle(){ target = 0.18; },
      destroy(){ cancelAnimationFrame(raf); }
    };
  }

  window.KivontiMarks = { build:buildMark, render:renderMarks, VoiceOrb };
  if(document.readyState!=='loading') renderMarks();
  else document.addEventListener('DOMContentLoaded',()=>renderMarks());
})();
