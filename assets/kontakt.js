/* KIVONTI — Kontakt: client-side form handling (demo only) */
(function(){
  const form=document.getElementById('demoForm');
  const success=document.getElementById('formSuccess');
  if(!form) return;
  form.addEventListener('input',function(e){ e.target.classList.remove('err'); });
  form.addEventListener('submit',function(e){
    e.preventDefault();
    let ok=true;
    form.querySelectorAll('[required]').forEach(f=>{
      if(!f.value.trim()){ f.classList.add('err'); ok=false; }
      else { f.classList.remove('err'); }
    });
    const email=form.querySelector('#f-email');
    if(email&&email.value&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){
      email.classList.add('err'); ok=false;
    }
    if(!ok) return;
    form.style.display='none';
    if(success){ success.classList.add('show'); if(window.KivontiMarks) window.KivontiMarks.render(success); }
  });
})();
