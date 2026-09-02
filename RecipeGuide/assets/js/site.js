
(function(){
  var r=document.documentElement, KEY='larose-lang';
  var MOBILE=window.matchMedia('(max-width:759px)').matches;
  function set(m,persist){
    r.classList.remove('lang-both','lang-en','lang-ar');
    r.classList.add('lang-'+m);
    var b=document.querySelectorAll('.seg button');
    for(var i=0;i<b.length;i++){b[i].setAttribute('aria-pressed', b[i].dataset.m===m?'true':'false');}
    if(persist!==false){try{localStorage.setItem(KEY,m);}catch(e){}}
    if(typeof filter==='function' && document.getElementById('q') &&
       document.getElementById('q').value){ filter(); }
  }
  var saved=null;
  try{saved=localStorage.getItem(KEY);}catch(e){}
  if(['both','en','ar'].indexOf(saved)<0){saved=null;}
  // On a phone never start in bilingual mode - pick the reader's own language.
  var auto=false, start=saved;
  if(MOBILE && (start===null || start==='both')){
    start=/^ar/i.test(navigator.language||navigator.userLanguage||'')?'ar':'en';
    auto=true;
  }
  if(start===null){start='both';auto=true;}
  document.addEventListener('click',function(ev){
    var t=ev.target.closest?ev.target.closest('.seg button'):null;
    if(t){set(t.dataset.m,true);}
  });
  set(start, !auto);
  // ---- search over the contents index ----
  var q=document.getElementById('q'), qn=document.getElementById('qn');
  function norm(t){
    return (t||'').toLowerCase()
      .replace(/[ـً-ْٰ]/g,'')   // tatweel + tashkeel
      .replace(/[أإآٱ]/g,'ا') // alef forms
      .replace(/ى/g,'ي')                    // alef maqsura -> ya
      .replace(/ة/g,'ه')                    // ta marbuta -> ha
      .replace(/\s+/g,' ').trim();
  }
  var rows=[].slice.call(document.querySelectorAll('.chg li[data-s]'));
  rows.forEach(function(li){ li.dataset.n=norm(li.dataset.s); });
  var groups=[].slice.call(document.querySelectorAll('.chg'));
  function filter(){
    var t=norm(q.value);
    if(!t){
      rows.forEach(function(li){li.classList.remove('hide');});
      groups.forEach(function(g){g.classList.remove('hide');});
      qn.textContent='';
      return;
    }
    var hits=0;
    rows.forEach(function(li){
      var ok=li.dataset.n.indexOf(t)>-1;
      li.classList.toggle('hide',!ok);
      if(ok){hits++;}
    });
    groups.forEach(function(g){
      g.classList.toggle('hide', g.querySelectorAll('li:not(.hide)').length===0);
    });
    var ar=r.classList.contains('lang-ar');
    qn.textContent = hits ? (ar? hits+' وصفة' : hits+(hits===1?' recipe':' recipes'))
                          : (ar? 'مفيش نتائج' : 'No matches');
  }
  if(q){ q.addEventListener('input',filter); }

  var top=document.getElementById('top');
  top.addEventListener('click',function(){window.scrollTo(0,0);});
  window.addEventListener('scroll',function(){
    if(window.scrollY>700){top.classList.add('on');}else{top.classList.remove('on');}
  },{passive:true});
})();
