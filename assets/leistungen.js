/* KIVONTI — Leistungen: service orb + mini website-chat demo */
window.addEventListener('load',function(){
  if(window.KivontiMarks&&window.KivontiMarks.VoiceOrb){
    const o=document.getElementById('svcOrb');
    if(o){
      const orb=window.KivontiMarks.VoiceOrb(o);
      let t=0;(function loop(){t+=0.02;orb.drive(0.35+0.4*(0.5+0.5*Math.sin(t)));requestAnimationFrame(loop);})();
    }
  }
  const mc=document.getElementById('miniChat');
  if(!mc) return;
  const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function L(){return (window.KivontiLang&&window.KivontiLang.get()==='en')?'en':'de';}
  const data={
    de:[
      {who:'a',t:'Hallo! Ich bin der Assistent von Sanitär Klein. Wie kann ich helfen?'},
      {who:'u',t:'Habt ihr am Wochenende Notdienst?'},
      {who:'a',t:'Ja, Sa & So von 8 bis 20 Uhr. Soll ich einen Rückruf für Sie einplanen?'},
      {who:'u',t:'Gerne, heute Nachmittag.'},
      {who:'a',t:'Erledigt. Sie bekommen gleich eine Bestätigung per WhatsApp. 👍'}
    ],
    en:[
      {who:'a',t:'Hi! I\'m the assistant at Klein Plumbing. How can I help?'},
      {who:'u',t:'Do you have emergency service on weekends?'},
      {who:'a',t:'Yes, Sat & Sun, 8am to 8pm. Shall I schedule a callback for you?'},
      {who:'u',t:'Yes please, this afternoon.'},
      {who:'a',t:'Done. You\'ll get a WhatsApp confirmation shortly. 👍'}
    ]
  };
  function wait(ms){return new Promise(r=>setTimeout(r,reduce?0:ms));}
  function type(el,txt,sp){return new Promise(res=>{let i=0;(function tk(){el.textContent=txt.slice(0,i++);if(i<=txt.length)setTimeout(tk,sp+Math.random()*20);else res();})();});}
  let stop=false;
  (async function play(){
    while(!stop){
      mc.innerHTML='';
      const lines=data[L()];
      for(const ln of lines){
        const row=document.createElement('div');
        row.className='mini-row'+(ln.who==='u'?' r':'');
        const av=document.createElement('div');av.className='mini-av';
        const b=document.createElement('div');b.className='mini-b';
        row.appendChild(av);row.appendChild(b);mc.appendChild(row);
        if(reduce)b.textContent=ln.t; else await type(b,ln.t,ln.who==='a'?24:16);
        await wait(ln.who==='a'?520:420);
      }
      await wait(2600);
    }
  })();
});
