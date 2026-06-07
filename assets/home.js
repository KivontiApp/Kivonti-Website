/* KIVONTI — Homepage: marquee + reactive orbs + live Kivo demo */
(function(){
  const items=['WhatsApp','Website','E Mail','Telefon','CRM Systeme','Kalender','Outlook','HubSpot'];
  const row=document.getElementById('marqRow');
  if(row){
    const make=()=>items.map(t=>'<span class="marquee-item"><span class="dot"></span>'+t+'</span>').join('');
    row.innerHTML=make()+make();
  }
})();
window.addEventListener('load',function(){
  if(!(window.KivontiMarks&&window.KivontiMarks.VoiceOrb)) return;
  const heroEl=document.getElementById('heroOrb');
  const howEl=document.getElementById('howOrb');
  let orb=null;
  if(heroEl) orb=window.KivontiMarks.VoiceOrb(heroEl);
  if(howEl) window.KivontiMarks.VoiceOrb(howEl);
  const log=document.getElementById('demoLog');
  if(log&&window.KivontiDemo){
    window.KivontiDemo({
      container:log, orb:orb,
      scriptDe:[
        {who:'agent',t:'Guten Tag, hier ist Kivo von Maler Berg. Wie kann ich helfen?'},
        {who:'user',t:'Hi, ich bräuchte einen Termin zum Ausmalen meiner Wohnung.'},
        {who:'agent',t:'Sehr gern. Wie viele Räume sind es ungefähr?'},
        {who:'user',t:'Drei Zimmer und ein Flur.'},
        {who:'agent',t:'Perfekt. Passt Ihnen Donnerstag um 14 Uhr für die Besichtigung?'},
        {who:'user',t:'Ja, das passt gut.'},
        {who:'agent',t:'Erledigt. Donnerstag 14 Uhr ist eingetragen. Die Bestätigung kommt per WhatsApp.'}
      ],
      scriptEn:[
        {who:'agent',t:'Hello, this is Kivo at Berg Painting. How can I help?'},
        {who:'user',t:'Hi, I need an appointment to repaint my flat.'},
        {who:'agent',t:'Happy to help. Roughly how many rooms are we talking about?'},
        {who:'user',t:'Three rooms and a hallway.'},
        {who:'agent',t:'Perfect. Does Thursday at 2pm work for the walkthrough?'},
        {who:'user',t:'Yes, that works.'},
        {who:'agent',t:'Done. Thursday 2pm is booked. Confirmation is on its way via WhatsApp.'}
      ]
    });
  }
});
