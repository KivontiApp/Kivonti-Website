/* KIVONTI — shared nav + footer injected into every page.
   Runs immediately (script placed at end of body, after mount points). */
(function(){
  const page=document.body.getAttribute('data-page')||document.getElementById('nav-mount')?.getAttribute('data-page')||'';
  const A=(href,key,de,en)=>`<a href="${href}"${key===page?' class="active"':''} data-en="${en}">${de}</a>`;
  const navHTML=`
  <nav class="nav" aria-label="Hauptnavigation">
    <a class="brand" href="index.html" aria-label="Kivonti Startseite">
      <span data-mark="26" data-glow="1"></span><span class="wm">Kivonti</span>
    </a>
    <div class="nav-links" id="navLinks">
      ${A('index.html','home','Start','Home')}
      ${A('leistungen.html','leistungen','Leistungen','Solutions')}
      ${A('vision.html','vision','Vision','Vision')}
      ${A('referenzen.html','referenzen','Referenzen','Results')}
      ${A('faq.html','faq','FAQ','FAQ')}
      ${A('kontakt.html','kontakt','Kontakt','Contact')}
    </div>
    <div class="nav-right">
      <div class="lang" role="group" aria-label="Sprache / Language">
        <button data-lang="de" class="on">DE</button><button data-lang="en">EN</button>
      </div>
      <a href="kontakt.html" class="btn btn-primary nav-cta" data-magnetic="0.3" data-en='Book demo <span class="ico">&#8594;</span>'>Demo buchen <span class="ico">&#8594;</span></a>
      <button class="menu-btn" aria-label="Menü" data-en-aria="Menu"><span></span><span></span><span></span></button>
    </div>
  </nav>`;
  const socials=[
    ['Instagram','https://www.instagram.com/kivonti.de/','M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.26 2.2.43.6.2 1 .47 1.4.9.4.4.7.8.9 1.4.17.4.37 1 .43 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.26 1.8-.43 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .37-2.2.43-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.26-2.2-.43-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.37-1-.43-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.26-1.8.43-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.37 2.2-.43C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-.9.04-1.4.2-1.7.32-.43.17-.74.37-1.06.7-.32.3-.52.62-.7 1.05-.12.3-.28.8-.32 1.7C3.25 8.5 3.24 8.9 3.24 12s0 3.5.06 4.7c.04.9.2 1.4.32 1.7.17.43.37.74.7 1.06.32.32.63.52 1.06.7.3.12.8.28 1.7.32 1.2.06 1.6.07 4.7.07s3.5 0 4.7-.07c.9-.04 1.4-.2 1.7-.32.43-.17.74-.37 1.06-.7.32-.32.52-.63.7-1.06.12-.3.28-.8.32-1.7.06-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.04-.9-.2-1.4-.32-1.7a2.85 2.85 0 0 0-.7-1.06 2.85 2.85 0 0 0-1.06-.7c-.3-.12-.8-.28-1.7-.32C15.5 4 15.1 4 12 4Zm0 3.06A4.94 4.94 0 1 1 12 17a4.94 4.94 0 0 1 0-9.88Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.14-.3a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z'],
    ['TikTok','https://www.tiktok.com/@kivonti','M16.6 5.8c-.9-.6-1.5-1.5-1.7-2.6 0-.2-.05-.4-.05-.6h-2.9v11.6c0 1.4-1.1 2.5-2.5 2.5a2.5 2.5 0 0 1 0-5c.26 0 .5.04.74.1v-3a5.5 5.5 0 0 0-.74-.05 5.45 5.45 0 1 0 5.45 5.45V8.9c1.1.78 2.4 1.24 3.8 1.24V7.2c-.76 0-1.47-.2-2.1-.55-.07-.04-.13-.08-.2-.13l.2.27-.05-.06Z'],
    ['YouTube','https://www.youtube.com/@Kivonti','M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 0 0 .5 7.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-4.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z'],
    ['WhatsApp','https://wa.me/message/YVMAUH7ITOFMH1','M17.5 14.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.2 3.05c.15.2 2.08 3.17 5.04 4.45.7.3 1.25.48 1.68.61.7.22 1.34.19 1.85.12.56-.08 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.34Z M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.76 0-3.41-.46-4.84-1.26L2 22l1.3-4.87A9.96 9.96 0 0 1 2 12 10 10 0 0 1 12 2Zm0 1.8a8.2 8.2 0 1 0 0 16.4A8.2 8.2 0 0 0 12 3.8Z']
  ];
  const socialHTML=`<div class="foot-social" aria-label="Social Media">${socials.map(([name,url,d])=>`<a href="${url}" target="_blank" rel="noopener" aria-label="Kivonti auf ${name}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg></a>`).join('')}</div>`;
  const footHTML=`
  <footer class="foot">
    <div class="wrap">
      <div class="foot-grid">
        <div class="foot-col">
          <div class="brand"><span data-mark="30" data-glow="1"></span><span class="wm">Kivonti</span></div>
          <p class="foot-tag" data-en="Individually tailored AI &amp; voice solutions for small and mid-sized businesses.">Individuell anpassbare KI &amp; Voice Lösungen für kleine und mittlere Unternehmen.</p>
          ${socialHTML}
        </div>
        <div class="foot-col">
          <h4 data-en="Navigate">Navigation</h4>
          <a href="index.html" data-en="Home">Start</a>
          <a href="leistungen.html" data-en="Solutions">Leistungen</a>
          <a href="vision.html" data-en="Vision">Vision</a>
          <a href="referenzen.html" data-en="Results">Referenzen</a>
        </div>
        <div class="foot-col">
          <h4 data-en="Company">Unternehmen</h4>
          <a href="faq.html" data-en="FAQ">FAQ</a>
          <a href="kontakt.html" data-en="Contact">Kontakt</a>
          <a href="impressum.html" data-en="Imprint">Impressum</a>
          <a href="datenschutz.html" data-en="Privacy">Datenschutz</a>
        </div>
        <div class="foot-col">
          <h4 data-en="Contact">Kontakt</h4>
          <a href="mailto:Info@Kivonti.de">Info@Kivonti.de</a>
          <a href="tel:+4915129680889">+49 151 29680889</a>
        </div>
      </div>
      <div class="foot-bottom">
        <span>&copy; <span data-year>2026</span> Kivonti &middot; Robin Schäfer</span>
        <span class="slog">KI &middot; Voice &middot; Technology</span>
        <span><a href="impressum.html" data-en="Imprint">Impressum</a> &middot; <a href="datenschutz.html" data-en="Privacy">Datenschutz</a></span>
      </div>
    </div>
  </footer>`;
  const navMount=document.getElementById('nav-mount');
  const footMount=document.getElementById('foot-mount');
  if(navMount) navMount.outerHTML=navHTML;
  if(footMount) footMount.outerHTML=footHTML;

  // WhatsApp floating button
  const wa=document.createElement('a');
  wa.href='https://wa.me/message/YVMAUH7ITOFMH1';
  wa.target='_blank';
  wa.rel='noopener';
  wa.className='wa-float';
  wa.setAttribute('aria-label','WhatsApp öffnen');
  wa.innerHTML=`<span class="wa-tip">Schreib uns auf WhatsApp</span><svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.2 3.05c.15.2 2.08 3.17 5.04 4.45.7.3 1.25.48 1.68.61.7.22 1.34.19 1.85.12.56-.08 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.34ZM12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.76 0-3.41-.46-4.84-1.26L2 22l1.3-4.87A9.96 9.96 0 0 1 2 12 10 10 0 0 1 12 2Zm0 1.8a8.2 8.2 0 1 0 0 16.4A8.2 8.2 0 0 0 12 3.8Z"/></svg>`;
  document.body.appendChild(wa);

  // Cookie notice
  if(!localStorage.getItem('kv_cookie_ok')){
    const bar=document.createElement('div');
    bar.className='cookie-bar';
    const lang=localStorage.getItem('kv_lang')||'de';
    bar.innerHTML=`
      <p>${lang==='en'
        ?'We use only technically necessary local storage (language preference). No tracking, no ads. <a href="datenschutz.html">Privacy policy</a>.'
        :'Wir nutzen ausschließlich technisch notwendigen lokalen Speicher (Sprachpräferenz). Kein Tracking, keine Werbung. <a href="datenschutz.html">Datenschutz</a>.'}
      </p>
      <div class="cookie-bar-btns">
        <button class="btn-xs info" id="cookieInfo">${lang==='en'?'More info':'Mehr erfahren'}</button>
        <button class="btn-xs accept" id="cookieOk">${lang==='en'?'Got it':'Verstanden'}</button>
      </div>`;
    document.body.appendChild(bar);
    requestAnimationFrame(()=>requestAnimationFrame(()=>bar.classList.add('show')));
    document.getElementById('cookieOk').addEventListener('click',()=>{
      localStorage.setItem('kv_cookie_ok','1');
      bar.classList.remove('show');
      setTimeout(()=>bar.remove(),500);
    });
    document.getElementById('cookieInfo').addEventListener('click',()=>{
      window.location.href='datenschutz.html#cookies';
    });
  }
})();
