/* @jsxRuntime classic */
/* global React, useTweaks, TweaksPanel, TweakSection, TweakColor, TweakRadio */

const PALETTES = [
  ['#E2742A','#F4AE6E'],   // Flame — burnt orange (default)
  ['#00BFA5','#4DD0C4'],   // Pulse — electric teal
  ['#6B9FD4','#A0C4E8'],   // Frost — cool blue
];

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#E2742A","#F4AE6E"],
  "stage":   "Void",
  "motion":  "Organic"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const r = document.documentElement.style;
  const [sig, glo] = Array.isArray(t.palette) ? t.palette : [t.palette, t.palette];

  /* ── Signal (color) ── */
  const sigD = sig + 'CC'; // 80% darkened approximation via hex; real computation below
  function darken(hex) {
    const n = parseInt(hex.replace('#',''),16);
    const r2=Math.max(0,((n>>16)&255)*0.76|0);
    const g2=Math.max(0,((n>>8)&255)*0.76|0);
    const b2=Math.max(0,(n&255)*0.76|0);
    return `rgb(${r2},${g2},${b2})`;
  }
  function hex2rgba(hex,a){
    const n=parseInt(hex.replace('#',''),16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
  }
  r.setProperty('--signal', sig);
  r.setProperty('--signal-d', darken(sig));
  r.setProperty('--glow', glo);
  r.setProperty('--line-warm', hex2rgba(sig, 0.22));

  /* ── Stage (atmosphere) ── */
  const stages = {
    Void:  { void:'#0A0908', void2:'#0C0B09', panel:'#100E0C', panel2:'#16130F',
             ink:'#ECE7DF', ink2:'#A8A199', ink3:'#6A645C', mute:'#4A453F',
             line:'rgba(236,231,223,.09)', line2:'rgba(236,231,223,.05)', grain:.05 },
    Dusk:  { void:'#0D0810', void2:'#100B13', panel:'#160D1C', panel2:'#1D1226',
             ink:'#EDE8F2', ink2:'#A8A0B5', ink3:'#6A6078', mute:'#4A4055',
             line:'rgba(237,232,242,.09)', line2:'rgba(237,232,242,.05)', grain:.07 },
    Bone:  { void:'#F4F0E9', void2:'#EDE8E0', panel:'#E7E1D6', panel2:'#DDD6CA',
             ink:'#1A1714', ink2:'#5A534A', ink3:'#8A8178', mute:'#BAB3A8',
             line:'rgba(26,23,20,.10)', line2:'rgba(26,23,20,.05)', grain:.03 },
  };
  const s = stages[t.stage] || stages.Void;
  r.setProperty('--void', s.void);
  r.setProperty('--void-2', s.void2);
  r.setProperty('--panel', s.panel);
  r.setProperty('--panel-2', s.panel2);
  r.setProperty('--ink', s.ink);
  r.setProperty('--ink-2', s.ink2);
  r.setProperty('--ink-3', s.ink3);
  r.setProperty('--mute', s.mute);
  r.setProperty('--line', s.line);
  r.setProperty('--line-2', s.line2);
  document.body.style.background = s.void;
  document.body.style.color = s.ink;
  const grain = document.querySelector('.grain');
  if (grain) grain.style.opacity = s.grain;

  /* ── Motion (energy) ── */
  document.body.classList.remove('motion-electric','motion-still','motion-organic');
  document.body.classList.add('motion-' + (t.motion||'organic').toLowerCase());
}

function KivontiTweaks() {
  const [t, setTweak] = useTweaks(DEFAULTS);

  React.useEffect(() => { applyTweaks(t); }, [t]);

  return React.createElement(TweaksPanel, { title: 'Tweaks' },
    React.createElement(TweakSection, { label: 'Signal' }),
    React.createElement(TweakColor, {
      label: 'Farbe / Color',
      value: t.palette,
      options: PALETTES,
      onChange: v => setTweak('palette', v)
    }),
    React.createElement(TweakSection, { label: 'Stage' }),
    React.createElement(TweakRadio, {
      label: 'Atmosphäre',
      value: t.stage,
      options: ['Void','Dusk','Bone'],
      onChange: v => setTweak('stage', v)
    }),
    React.createElement(TweakSection, { label: 'Motion' }),
    React.createElement(TweakRadio, {
      label: 'Energie',
      value: t.motion,
      options: ['Organic','Electric','Still'],
      onChange: v => setTweak('motion', v)
    })
  );
}

const _mount = document.getElementById('tweaks-root');
if (_mount) {
  ReactDOM.createRoot(_mount).render(React.createElement(KivontiTweaks));
}
