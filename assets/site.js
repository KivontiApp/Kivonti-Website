/* ============================================================
   KIVONTI — Site engine
   nav · i18n (DE/EN) · scroll reveals · count-up ·
   magnetic CTAs · cursor spotlight · live Kivo demo
   ============================================================ */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  const LANG_KEY='kivonti_lang';
  function getLang(){ return localStorage.getItem(LANG_KEY)||'de'; }
  function applyLang(lang){
    document.documentElement.setAttribute('lang',lang);
    document.querySelectorAll('[data-en]').forEach(el=>{
      if(!el.hasAttribute('data-de')) el.setAttribute('data-de', el.innerHTML);
      el.innerHTML = lang==='en' ? el.getAttribute('data-en') : el.getAttribute('data-de');
    });
    document.querySelectorAll('[data-en-ph]').forEach(el=>{
      if(!el.hasAttribute('data-de-ph')) el.setAttribute('data-de-ph', el.getAttribute('placeholder')||'');
      el.setAttribute('placeholder', lang==='en' ? el.getAttribute('data-en-ph') : el.getAttribute('data-de-ph'));
    });
    document.querySelectorAll('[data-en-aria]').forEach(el=>{
      if(!el.hasAttribute('data-de-aria')) el.setAttribute('data-de-aria', el.getAttribute('aria-label')||'');
      el.setAttribute('aria-label', lang==='en' ? el.getAttribute('data-en-aria') : el.getAttribute('data-de-aria'));
    });
    document.querySelectorAll('.lang button').forEach(b=>{
      b.classList.toggle('on', b.dataset.lang===lang);
    });
    localStorage.setItem(LANG_KEY,lang);
    window.dispatchEvent(new CustomEvent('langchange',{detail:{lang}}));
  }
  window.KivontiLang = { get:getLang, set:applyLang };

  function initNav(){
    const nav=document.querySelector('.nav');
    if(nav){
      let lastY=window.scrollY,ticking=false;
      const onScroll=()=>{
        if(ticking) return;
        ticking=true;
        requestAnimationFrame(()=>{
          const y=window.scrollY;
          nav.classList.toggle('scrolled',y>24);
          // Auto-hide on mobile only, don't hide when menu is open
          const isMobile=window.innerWidth<=920;
          const menuOpen=document.querySelector('.nav-links.open');
          if(isMobile&&!menuOpen){
            if(y>lastY&&y>80) nav.classList.add('nav-hidden');
            else nav.classList.remove('nav-hidden');
          } else {
            nav.classList.remove('nav-hidden');
          }
          lastY=y; ticking=false;
        });
      };
      onScroll();
      window.addEventListener('scroll',onScroll,{passive:true});
      window.addEventListener('resize',()=>{
        if(window.innerWidth>920) nav.classList.remove('nav-hidden');
      },{passive:true});
    }
    const btn=document.querySelector('.menu-btn');
    const links=document.querySelector('.nav-links');
    if(btn&&links){
      btn.addEventListener('click',()=>{
        const open=links.classList.toggle('open');
        btn.classList.toggle('open',open);
        document.body.style.overflow=open?'hidden':'';
        // Always show nav when menu opens
        const nav=document.querySelector('.nav');
        if(nav&&open) nav.classList.remove('nav-hidden');
      });
      links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
        links.classList.remove('open');btn.classList.remove('open');document.body.style.overflow='';
      }));
    }
    document.querySelectorAll('.lang button').forEach(b=>{
      b.addEventListener('click',()=>applyLang(b.dataset.lang));
    });
  }

  function initReveals(){
    const els=document.querySelectorAll('.reveal');
    if(!els.length) return;
    if(reduce){ els.forEach(e=>e.classList.add('in')); return; }
    const io=new IntersectionObserver((ents)=>{
      ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{threshold:.16,rootMargin:'0px 0px -8% 0px'});
    els.forEach(e=>io.observe(e));
  }

  function initCounters(){
    const els=document.querySelectorAll('[data-count]');
    if(!els.length) return;
    const run=(el)=>{
      const to=parseFloat(el.getAttribute('data-count'));
      const dec=(el.getAttribute('data-dec')|0);
      if(reduce){ el.textContent=to.toFixed(dec); return; }
      const dur=1500, t0=performance.now();
      const step=(t)=>{
        const p=Math.min(1,(t-t0)/dur);
        const e=1-Math.pow(1-p,3);
        el.textContent=(to*e).toFixed(dec);
        if(p<1) requestAnimationFrame(step); else el.textContent=to.toFixed(dec);
      };
      requestAnimationFrame(step);
    };
    const io=new IntersectionObserver((ents)=>{
      ents.forEach(e=>{ if(e.isIntersecting){ run(e.target); io.unobserve(e.target);} });
    },{threshold:.6});
    els.forEach(e=>io.observe(e));
  }

  function initMagnetic(){
    if(reduce||matchMedia('(hover:none)').matches) return;
    document.querySelectorAll('[data-magnetic]').forEach(el=>{
      const strength=parseFloat(el.getAttribute('data-magnetic'))||0.32;
      el.addEventListener('mousemove',(e)=>{
        const r=el.getBoundingClientRect();
        const x=e.clientX-r.left-r.width/2;
        const y=e.clientY-r.top-r.height/2;
        el.style.transform=`translate(${x*strength}px,${y*strength}px)`;
      });
      el.addEventListener('mouseleave',()=>{ el.style.transform=''; });
    });
  }

  function initCardSpot(){
    document.querySelectorAll('.card').forEach(c=>{
      c.addEventListener('mousemove',(e)=>{
        const r=c.getBoundingClientRect();
        c.style.setProperty('--mx',(e.clientX-r.left)+'px');
        c.style.setProperty('--my',(e.clientY-r.top)+'px');
      });
    });
  }

  function initSpotlight(){
    const sp=document.querySelector('.spotlight');
    if(!sp||reduce||matchMedia('(hover:none)').matches) return;
    let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
    window.addEventListener('mousemove',(e)=>{x=e.clientX;y=e.clientY;sp.style.opacity='1';});
    (function loop(){
      cx+=(x-cx)*.08; cy+=(y-cy)*.08;
      sp.style.left=cx+'px'; sp.style.top=cy+'px';
      requestAnimationFrame(loop);
    })();
  }

  function initAccordion(){
    document.querySelectorAll('[data-acc]').forEach(item=>{
      const head=item.querySelector('[data-acc-head]');
      const body=item.querySelector('[data-acc-body]');
      if(!head||!body) return;
      head.addEventListener('click',()=>{
        const open=item.classList.toggle('open');
        body.style.maxHeight = open ? body.scrollHeight+'px' : '0px';
        head.setAttribute('aria-expanded', open?'true':'false');
      });
    });
    window.addEventListener('langchange',()=>{
      document.querySelectorAll('[data-acc].open [data-acc-body]').forEach(b=>{
        b.style.maxHeight=b.scrollHeight+'px';
      });
    });
  }

  function typeLine(node, text, speed, orb, isAgent){
    return new Promise(res=>{
      node.textContent='';
      node.classList.add('typing');
      let i=0;
      const tick=()=>{
        node.textContent=text.slice(0,i);
        if(isAgent&&orb){ orb.drive(0.5 + Math.random()*0.5); }
        i++;
        if(i<=text.length){ setTimeout(tick, speed + Math.random()*22); }
        else { node.classList.remove('typing'); if(orb) orb.idle(); res(); }
      };
      tick();
    });
  }

  window.KivontiDemo = function(opts){
    const { container, orb, scriptDe, scriptEn, loop=true } = opts;
    let stopped=false;
    function script(){ return getLang()==='en' ? scriptEn : scriptDe; }
    function wait(ms){ return new Promise(r=>setTimeout(r,reduce?0:ms)); }
    async function play(){
      while(!stopped){
        container.innerHTML='';
        const lines=script();
        for(const ln of lines){
          if(stopped) return;
          const row=document.createElement('div');
          row.className='demo-msg '+(ln.who==='agent'?'is-agent':'is-user');
          const who=document.createElement('div'); who.className='demo-who';
          who.textContent = ln.who==='agent' ? 'Kivo' : (getLang()==='en'?'Caller':'Anrufer');
          const bubble=document.createElement('div'); bubble.className='demo-bubble';
          row.appendChild(who); row.appendChild(bubble);
          container.appendChild(row);
          container.scrollTop=container.scrollHeight;
          if(reduce){ bubble.textContent=ln.t; }
          else { await typeLine(bubble, ln.t, ln.who==='agent'?26:18, orb, ln.who==='agent'); }
          container.scrollTop=container.scrollHeight;
          await wait(ln.who==='agent'?620:480);
        }
        if(!loop) return;
        await wait(2400);
      }
    }
    play();
    return { stop(){ stopped=true; } };
  };

  function initYear(){
    document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
  }

  function init(){
    applyLang(getLang());
    initNav(); initReveals(); initCounters(); initMagnetic();
    initCardSpot(); initSpotlight(); initAccordion(); initYear();
  }
  if(document.readyState!=='loading') init();
  else document.addEventListener('DOMContentLoaded',init);
})();
