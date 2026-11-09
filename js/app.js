// Progress, quizzes, drills. Everything saves in this browser only (localStorage).
(function(){
  var KEY='wheel-progress-v1';
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
  function save(p){localStorage.setItem(KEY,JSON.stringify(p))}
  window.WP={load:load,save:save};
  document.addEventListener('DOMContentLoaded',function(){
    var p=load();
    // Mark-done buttons
    document.querySelectorAll('[data-done]').forEach(function(b){
      var id=b.getAttribute('data-done');
      function paint(){b.textContent=p[id]?'✓ Done ('+p[id]+') — tap to undo':'Mark this module done';b.classList.toggle('ghost',!!p[id])}
      paint();
      b.addEventListener('click',function(){p=load();if(p[id]){delete p[id]}else{p[id]=new Date().toISOString().slice(0,10)}save(p);paint()});
    });
    // Module tags + progress bar on home
    var mods=['m1','m2','m3','m4','m5','m6'],n=0;
    mods.forEach(function(m){var t=document.querySelector('[data-tag="'+m+'"]');if(p[m]){n++;if(t){t.textContent='Done '+p[m];t.classList.add('done-tag')}}});
    var bar=document.querySelector('.progress span');if(bar){bar.style.width=(n/6*100)+'%';var l=document.getElementById('plabel');if(l)l.textContent=n+' of 6 modules done'}
    // Re-test schedule
    var rt=document.getElementById('retests');
    if(rt){var rows='';mods.forEach(function(m,i){if(!p[m])return;var d=new Date(p[m]+'T12:00:00');var ds=[1,3,7,21].map(function(k){var x=new Date(d);x.setDate(x.getDate()+k);return x.toLocaleDateString(undefined,{month:'short',day:'numeric'})});rows+='<tr><td>Module '+(i+1)+'</td><td>'+ds.join(' · ')+'</td></tr>'});
      rt.innerHTML=rows?'<div class="tw"><table><tr><th>Module</th><th>Re-test on (days 1, 3, 7, 21)</th></tr>'+rows+'</table></div>':'<p>Your re-test dates appear here once you mark a module done.</p>'}
    // Quizzes
    document.querySelectorAll('.quiz [data-q]').forEach(function(q){
      var ans=+q.getAttribute('data-a'),fb=q.querySelector('.fb');
      q.querySelectorAll('.opt').forEach(function(o,i){o.addEventListener('click',function(){
        q.querySelectorAll('.opt').forEach(function(x){x.classList.remove('right','wrong')});
        o.classList.add(i===ans?'right':'wrong');
        fb.textContent=(i===ans?'Right. ':'Not quite. ')+q.getAttribute('data-why');
      })});
    });
    // Drill forms
    document.querySelectorAll('form.drill').forEach(function(f){
      var k='wheel-drill-'+f.id;
      try{var d=JSON.parse(localStorage.getItem(k)||'{}');Object.keys(d).forEach(function(n){if(f.elements[n])f.elements[n].value=d[n]})}catch(e){}
      f.addEventListener('input',function(){var d={};Array.prototype.forEach.call(f.elements,function(el){if(el.name)d[el.name]=el.value});localStorage.setItem(k,JSON.stringify(d))});
      f.addEventListener('submit',function(e){e.preventDefault()});
    });
  });
  if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register((document.body.getAttribute('data-root')||'')+'sw.js').catch(function(){})})}
})();
