/* ============================================================
   KIVONTI Tweaks Panel — vanilla JS, host protocol v2
   Three expressive controls: Signal · Stage · Motion
   ============================================================ */
(function(){
  const STORE='kv_tweaks_v2';

  /* ── Palette definitions ── */
  const PALETTES={
    Flame:{ signal:'#E2742A', signalD:'#B85513', glow:'#F4AE6E', lineWarm:'rgba(226,116,42,.22)' },
    Pulse:{ signal:'#00BFA5', signalD:'#008F7A', glow:'#4DD0C4', lineWarm:'rgba(0,191,165,.22)' },
    Frost:{ signal:'#6B9FD4', signalD:'#4A7FB5', glow:'#A0C4E8', lineWarm:'rgba(107,159,212,.22)' },
  };

  const STAGES={
    Void:{  void:'#0A0908', void2:'#0C0B09', panel:'#100E0C', panel2:'#16130F',
            ink:'#ECE7DF', ink2:'#A8A199', ink3:'#6A645C', mute:'#4A453F',
            line:'rgba(236,231,223,.09)', line2:'rgba(236,231,223,.05)', bg:'#0A0908', grain:.05 },
    Dusk:{  void:'#0D0810', void2:'#100B13', panel:'#160D1C', panel2:'#1D1226',
            ink:'#EDE8F2', ink2:'#A8A0B5', ink3:'#6A6078', mute:'#4A4055',
            line:'rgba(237,232,242,.09)', line2:'rgba(237,232,242,.05)', bg:'#0D0810', grain:.07 },
    Bone:{  void:'#F4F0E9', void2:'#EDE8E0', panel:'#E7E1D6', panel2:'#DDD6CA',
            ink:'#1A1714', ink2:'#5A534A', ink3:'#8A8178', mute:'#BAB3A8',
            line:'rgba(26,23,20,.10)', line2:'rgba(26,23,20,.05)', bg:'#F4F0E9', grain:.02 },
  };

  const DEFAULTS={palette:'Flame',stage:'Void',motion:'Organic'};
  let state=Object.assign({},DEFAULTS,JSON.parse(localStorage.getItem(STORE)||'{}'));

  /* ── Apply state to CSS vars ── */
  function apply(){
    const r=document.documentElement.style;
    const p=PALETTES[state.palette]||PALETTES.Flame;
    const s=STAGES[state.stage]||STAGES.Void;
    r.setProperty('--signal',p.signal);
    r.setProperty('--signal-d',p.signalD);
    r.setProperty('--glow',p.glow);
    r.setProperty('--line-warm',p.lineWarm);
    r.setProperty('--void',s.void); r.setProperty('--void-2',s.void2);
    r.setProperty('--panel',s.panel); r.setProperty('--panel-2',s.panel2);
    r.setProperty('--ink',s.ink); r.setProperty('--ink-2',s.ink2);
    r.setProperty('--ink-3',s.ink3); r.setProperty('--mute',s.mute);
    r.setProperty('--line',s.line); r.setProperty('--line-2',s.line2);
    document.body.style.background=s.bg;
    document.body.style.color=s.ink;
    const g=document.querySelector('.grain');
    if(g) g.style.opacity=s.grain;
    document.body.classList.remove('motion-organic','motion-electric','motion-still');
    document.body.classList.add('motion-'+(state.motion||'organic').toLowerCase());
    localStorage.setItem(STORE,JSON.stringify(state));
    renderPanel();
  }

  /* ── Panel DOM ── */
  const PAN_W=230;
  let panEl=null, visible=false;

  const css=`
    #kv-tweaks{
      position:fixed;bottom:88px;right:20px;width:${PAN_W}px;z-index:9999;
      background:rgba(14,12,10,.94);border:1px solid rgba(226,116,42,.22);
      border-radius:16px;overflow:hidden;
      box-shadow:0 24px 64px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.04);
      backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
      font-family:'Space Mono',monospace;
    }
    #kv-tweaks-head{
      display:flex;justify-content:space-between;align-items:center;
      padding:14px 16px 10px;border-bottom:1px solid rgba(236,231,223,.08);
    }
    #kv-tweaks-head span{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#A8A199;}
    #kv-tweaks-head button{
      width:22px;height:22px;border-radius:50%;border:1px solid rgba(236,231,223,.12);
      background:transparent;color:#6A645C;cursor:pointer;font-size:13px;
      display:flex;align-items:center;justify-content:center;transition:.2s;
    }
    #kv-tweaks-head button:hover{border-color:rgba(226,116,42,.4);color:#ECE7DF;}
    .kv-section{
      padding:12px 16px 4px;font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:#6A645C;
    }
    .kv-row{padding:6px 16px 10px;display:flex;flex-direction:column;gap:8px;}
    .kv-label{font-size:10px;letter-spacing:.08em;color:#A8A199;}
    .kv-swatches{display:flex;gap:8px;}
    .kv-swatch{
      width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid transparent;
      transition:transform .2s,border-color .2s,box-shadow .2s;
      position:relative;
    }
    .kv-swatch:hover{transform:scale(1.12);}
    .kv-swatch.active{border-color:#ECE7DF;box-shadow:0 0 0 1px rgba(236,231,223,.3);}
    .kv-swatch-inner{width:100%;height:100%;border-radius:50%;background:var(--c1);}
    .kv-radio{display:flex;gap:4px;}
    .kv-opt{
      flex:1;padding:6px 4px;text-align:center;font-size:9.5px;letter-spacing:.06em;
      border:1px solid rgba(236,231,223,.1);border-radius:8px;cursor:pointer;
      color:#6A645C;transition:.2s;
    }
    .kv-opt:hover{border-color:rgba(226,116,42,.3);color:#A8A199;}
    .kv-opt.active{background:rgba(226,116,42,.12);border-color:rgba(226,116,42,.4);color:#ECE7DF;}
    #kv-toggle{
      position:fixed;bottom:28px;right:90px;z-index:9999;
      width:40px;height:40px;border-radius:12px;
      background:rgba(14,12,10,.9);border:1px solid rgba(226,116,42,.3);
      display:flex;align-items:center;justify-content:center;cursor:pointer;
      backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
      transition:border-color .25s,transform .25s,box-shadow .25s;
      box-shadow:0 4px 16px rgba(0,0,0,.5);
    }
    #kv-toggle:hover{border-color:rgba(226,116,42,.7);transform:scale(1.08);box-shadow:0 6px 20px rgba(226,116,42,.25);}
    #kv-toggle svg{width:16px;height:16px;fill:none;stroke:#E2742A;stroke-width:1.5;stroke-linecap:round;}
  `;

  const SWATCH_COLORS={Flame:'#E2742A',Pulse:'#00BFA5',Frost:'#6B9FD4'};

  function buildPanel(){
    const el=document.createElement('div');
    el.id='kv-tweaks';
    el.innerHTML=`
      <div id="kv-tweaks-head">
        <span>Tweaks</span>
        <button id="kv-close" aria-label="Schließen">&times;</button>
      </div>
      <div class="kv-section">Signal</div>
      <div class="kv-row">
        <div class="kv-label">Farbe</div>
        <div class="kv-swatches" id="kv-palette"></div>
      </div>
      <div class="kv-section">Stage</div>
      <div class="kv-row">
        <div class="kv-label">Atmosphäre</div>
        <div class="kv-radio" id="kv-stage"></div>
      </div>
      <div class="kv-section">Motion</div>
      <div class="kv-row" style="padding-bottom:16px">
        <div class="kv-label">Energie</div>
        <div class="kv-radio" id="kv-motion"></div>
      </div>`;
    return el;
  }

  function buildToggle(){
    const btn=document.createElement('button');
    btn.id='kv-toggle';
    btn.setAttribute('aria-label','Tweaks öffnen');
    btn.innerHTML=`<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="2"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M11.1 4.9l-1.4 1.4M4.9 11.1l-1.4 1.4"/></svg>`;
    return btn;
  }

  function renderPanel(){
    if(!panEl) return;
    /* palette swatches */
    const pal=panEl.querySelector('#kv-palette');
    if(pal){
      pal.innerHTML='';
      Object.keys(SWATCH_COLORS).forEach(k=>{
        const s=document.createElement('div');
        s.className='kv-swatch'+(state.palette===k?' active':'');
        s.title=k;
        s.style.background=SWATCH_COLORS[k];
        s.style.boxShadow=state.palette===k?`0 0 14px ${SWATCH_COLORS[k]}88`:'';
        s.addEventListener('click',()=>{ state.palette=k; apply(); });
        pal.appendChild(s);
      });
    }
    /* stage radio */
    const stg=panEl.querySelector('#kv-stage');
    if(stg){
      stg.innerHTML='';
      ['Void','Dusk','Bone'].forEach(k=>{
        const o=document.createElement('div');
        o.className='kv-opt'+(state.stage===k?' active':'');
        o.textContent=k;
        o.addEventListener('click',()=>{ state.stage=k; apply(); });
        stg.appendChild(o);
      });
    }
    /* motion radio */
    const mot=panEl.querySelector('#kv-motion');
    if(mot){
      mot.innerHTML='';
      ['Organic','Electric','Still'].forEach(k=>{
        const o=document.createElement('div');
        o.className='kv-opt'+(state.motion===k?' active':'');
        o.textContent=k;
        o.addEventListener('click',()=>{ state.motion=k; apply(); });
        mot.appendChild(o);
      });
    }
  }

  function showPanel(){
    visible=true;
    if(!panEl) return;
    panEl.style.visibility='visible';
    panEl.style.clipPath='inset(0% 0% 0% 0% round 16px)';
    panEl.style.transform='translateY(0) scale(1)';
    panEl.style.pointerEvents='all';
  }
  function hidePanel(){
    visible=false;
    if(!panEl) return;
    panEl.style.visibility='hidden';
    panEl.style.transform='translateY(10px) scale(.97)';
    panEl.style.pointerEvents='none';
    window.parent?.postMessage({type:'__edit_mode_dismissed'},'*');
  }

  function init(){
    /* inject CSS */
    const style=document.createElement('style');
    style.textContent=css;
    document.head.appendChild(style);

    /* build elements */
    panEl=buildPanel();
    const toggle=buildToggle();
    panEl.style.cssText='display:block;visibility:hidden;transform:translateY(10px) scale(.97);pointer-events:none;transition:transform .28s cubic-bezier(.16,1,.3,1),visibility 0s .28s;';
    document.body.appendChild(panEl);
    document.body.appendChild(toggle);

    panEl.querySelector('#kv-close').addEventListener('click',hidePanel);
    toggle.addEventListener('click',()=>{ visible?hidePanel():showPanel(); });

    /* apply saved state */
    apply();

    /* host protocol */
    window.parent?.postMessage({type:'__edit_mode_available',keys:['palette','stage','motion']},'*');
    window.addEventListener('message',(e)=>{
      if(!e.data) return;
      if(e.data.type==='__activate_edit_mode') showPanel();
      if(e.data.type==='__deactivate_edit_mode') hidePanel();
      if(e.data.type==='__set_tweak'){
        const {key,value}=e.data;
        if(key==='palette') state.palette=value;
        if(key==='stage')   state.stage=value;
        if(key==='motion')  state.motion=value;
        apply();
      }
    });
  }

  if(document.readyState!=='loading') init();
  else document.addEventListener('DOMContentLoaded',init);
})();
