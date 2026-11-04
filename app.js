/* ============ 2) MGA BAHAY ============ */
var MODELS = [
  { name:'Veta', sqm:85,  type:'2-Storey Single Detached', tag:'Where bonds blossom',
    blurb:'A warm sanctuary where family connections grow stronger.',
    features:['2-storey single detached home','Living area, dining area and kitchen','Main bedroom with private toilet and bath, plus lanai','Powder room and 2 toilet and bath','2-car park'],
    cta:'Reserve your Veta · ₱40,000' },
  { name:'Zila', sqm:96,  type:'2-Storey Partially Attached', tag:'Where families flourish',
    blurb:'A balanced home designed to embrace every milestone of family life.',
    features:['2-storey partially attached home','Living area, dining area and kitchen','1 guest room, 2 bedrooms, main bedroom with main toilet and bath','Lanai','2 toilet and bath','2-car park'],
    cta:'Reserve your Zila · ₱40,000' },
  { name:'Raya', sqm:110, type:'2-Storey Residence', tag:'Space to gather',
    blurb:'A generous home for families who love having everyone under one roof.',
    features:['2-storey home','110 sqm floor area','Floor plan and inclusions available on request'],
    cta:'Ask about the Raya' },
  { name:'Yana', sqm:130, type:'2-Storey Residence', tag:'The grandest address',
    blurb:'The largest home in the village, made for the family that wants it all.',
    features:['2-storey home','130 sqm floor area','Floor plan and inclusions available on request'],
    cta:'Ask about the Yana' }
];

/* ============ SCRIPT ============ */
function $(id){ return document.getElementById(id); }

function applyImg(el, url){
  if (url) { el.style.backgroundImage = 'url("' + url + '")'; el.classList.add('has-img'); }
}
document.querySelectorAll('[data-img]').forEach(function(el){
  applyImg(el, IMAGES[el.getAttribute('data-img')]);
});

function render(){
  var homes = $('homes');
  MODELS.forEach(function(m, i){
    var key = m.name.toLowerCase();

    var art = document.createElement('article');
    art.className = 'home' + (i % 2 ? ' rev' : '');
    art.id = 'm-' + key;
    var feats = m.features.map(function(f){ return '<li><span>' + f + '</span></li>'; }).join('');
    art.innerHTML =
      '<div class="res">' +
        '<div class="res-img">' +
          '<div class="frame"><div class="slot"><div class="big">' + m.name + '</div><div class="ph">[ ' + m.name + ' model house photo ]</div></div></div>' +
          '<div class="plan"><div class="plan-h">Floor layout · ' + m.name + ' ' + m.sqm + '</div>' +
            '<div class="plan-b"><i>Ground floor plan</i><i>Second floor plan</i></div></div>' +
          '<p class="note">For illustration purposes only. Actual floor plans subject to finalization.</p>' +
        '</div>' +
        '<div class="res-info">' +
          '<div class="eyebrow d">' + m.type + '</div>' +
          '<h3>' + m.name + '</h3>' +
          '<div class="tag">' + m.tag + '</div>' +
          '<p class="blurb">' + m.blurb + '</p>' +
          '<div class="area"><small>Floor area</small><b>' + m.sqm + ' sqm</b></div>' +
          '<ul class="feat">' + feats + '</ul>' +
          '<a class="btn btn-dark" href="#inquire" data-i="' + i + '">' + m.cta + '</a>' +
        '</div>' +
      '</div>';
    homes.appendChild(art);

    applyImg(art.querySelector('.slot'), IMAGES[key]);
    if (PLANS[key]) {
      var pb = art.querySelector('.plan-b');
      pb.style.backgroundImage = 'url("' + PLANS[key] + '")';
      pb.classList.add('has-img');
    }
    art.querySelector('.btn').addEventListener('click', function(){
      $('f-model').selectedIndex = i;
    });
  });
}
render();

/* Vercel form: collect a validated inquiry and open the visitor's email app. */
function submitInquiryByEmail(name, mobile, email, model, notes, msg){
  name = name.trim(); mobile = mobile.trim(); email = email.trim();
  msg.className = 'msg'; msg.textContent = '';
  if (!name || !mobile || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    msg.className = 'msg err';
    msg.textContent = 'Pakilagay ang pangalan, mobile number at tamang email.';
    return;
  }
  var subject = 'Alara Village inquiry — ' + model;
  var body = [
    'Alara Village inquiry', '',
    'Name: ' + name,
    'Mobile: ' + mobile,
    'Email: ' + email,
    'Home of interest: ' + model,
    'Budget / Notes: ' + (notes || '—')
  ].join('\n');
  msg.className = 'msg ok';
  msg.textContent = 'Bubuksan ang email app mo. Ipadala ang email para matanggap namin ang inquiry.';
  window.location.href = 'mailto:violentamanny@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

$('leadForm').addEventListener('submit', function(e){
  e.preventDefault();
  submitInquiryByEmail($('f-name').value, $('f-mobile').value, $('f-email').value,
    $('f-model').value, $('f-notes').value, $('msg'));
});

/* ============ POPUP FORM ============ */
(function(){
  var modal = $('modal'), lastFocus = null;

  function openModal(modelIndex){
    lastFocus = document.activeElement;
    $('m-model').selectedIndex = (typeof modelIndex === 'number' && !isNaN(modelIndex)) ? modelIndex : 4; // 4 = Not sure yet
    $('m-formBody').style.display = 'block';
    $('m-success').style.display = 'none';
    $('m-msg').textContent = ''; $('m-msg').className = 'msg';
    $('m-send').disabled = false; $('m-send').textContent = 'Yes, send me details';
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    setTimeout(function(){ $('m-name').focus(); }, 60);
  }
  function closeModal(){
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Lahat ng button/link na papunta sa #inquire (Private Viewing, Request Sample Computation,
  // Reserve/Ask about ng bawat bahay) ay magbubukas na ng popup.
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a[href="#inquire"]') : null;
    if (!a) return;
    e.preventDefault();
    var idx = a.getAttribute('data-i');
    openModal(idx === null ? undefined : parseInt(idx, 10));
  });

  $('modalClose').addEventListener('click', closeModal);
  $('m-done').addEventListener('click', closeModal);
  modal.addEventListener('mousedown', function(e){ if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  $('modalForm').addEventListener('submit', function(e){
    e.preventDefault();
    submitInquiryByEmail($('m-name').value, $('m-mobile').value, $('m-email').value,
      $('m-model').value, $('m-notes').value, $('m-msg'));
  });
})();
/* ============ LOADING SCREEN ============ */
(function(){
  var MIN_MS = 2400;   // pinakamaikling oras ng loading screen
  var MAX_MS = 6000;   // failsafe: tatanggalin kahit hindi pa tapos mag-load
  var start = Date.now(), finished = false;
  var loader = $('loader');
  if (!loader) { document.body.classList.remove('loading'); return; }

  function fill(id, url, alt, title, sub){
    var box = $(id);
    if (url) {
      var img = document.createElement('img');
      img.src = url; img.alt = alt;
      box.appendChild(img);
    } else {
      box.innerHTML = '<div class="ld-text">' + title + '</div><div class="ld-sub">' + sub + '</div>';
    }
  }
  var L = (typeof LOGOS !== 'undefined') ? LOGOS : {};
  fill('ld-alara', L.alara, 'Alara Village', 'ALARA', 'Village · Imus, Cavite');
  fill('ld-partners', L.partners, 'Homes Partners PH', 'HOMES PARTNERS PH', 'Real Partners');

  function hide(){
    if (finished) return; finished = true;
    loader.classList.add('done');
    document.body.classList.remove('loading');
    setTimeout(function(){ if (loader.parentNode) loader.parentNode.removeChild(loader); }, 1000);
  }
  function whenReady(){
    var wait = Math.max(0, MIN_MS - (Date.now() - start));
    setTimeout(hide, wait);
  }
  if (document.readyState === 'complete') whenReady();
  else window.addEventListener('load', whenReady);
  setTimeout(hide, MAX_MS);
})();
/* ============ SITE PLAN: ENLARGE ============ */
(function(){
  var box = $('lightbox'), img = $('lbImg'), zb = $('lbZoom'), hint = $('lbHint'), scroller, last = null;
  if (!box) return;
  scroller = box.querySelector('.lb-scroll');
  var isTouch = window.matchMedia && matchMedia('(hover: none)').matches;

  function setZoom(on){
    box.classList.toggle('zoomed', on);
    zb.textContent = on ? '− Fit to screen' : '+ Zoom in';
    hint.textContent = on ? (isTouch ? 'Drag to move around the map' : 'Scroll or drag to move around') : (isTouch ? 'Tap to zoom · Rotate phone for a bigger view' : 'Click the map to zoom in');
    if (on) {
      scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;
      scroller.scrollTop = (scroller.scrollHeight - scroller.clientHeight) / 2;
    } else { scroller.scrollLeft = 0; scroller.scrollTop = 0; }
  }
  function open(){
    var src = (typeof IMAGES !== 'undefined') ? IMAGES.amenitymap : '';
    if (!src) return;
    last = document.activeElement;
    img.src = src;
    setZoom(false);
    box.classList.add('open'); box.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    setTimeout(function(){ $('lbClose').focus(); }, 50);
  }
  function close(){
    box.classList.remove('open'); box.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    if (last && last.focus) last.focus();
  }
  var zoom = $('amZoom'), pic = document.querySelector('.am-img');
  if (zoom) zoom.addEventListener('click', open);
  if (pic) pic.addEventListener('click', open);
  img.addEventListener('click', function(){ setZoom(!box.classList.contains('zoomed')); });
  zb.addEventListener('click', function(){ setZoom(!box.classList.contains('zoomed')); });
  $('lbClose').addEventListener('click', close);
  box.addEventListener('mousedown', function(e){ if (e.target === box) close(); });
  document.addEventListener('keydown', function(e){ var vb = $('vbox'); if (e.key === 'Escape' && box.classList.contains('open') && !(vb && vb.classList.contains('open'))) close(); });
})();
/* ============ SITE PLAN: PINDUTIN ANG MGA BILOG PARA SA VIDEO ============ */
(function(){
  var RATIO = 1024 / 1536;   // taas / lapad ng bagong site plan
  var D = 11.7;              // lapad ng bilog, bilang % ng lapad ng larawan
  // x, y = gitna ng bilog sa larawan (sa %)
  var SPOTS = [
    { id: 'midpark1',  name: 'Midpark 1',            x: 10.2,  y: 21.7,  desc: 'Isa sa dalawang pocket park sa pagitan ng mga block, para laging malapit ang luntian.' },
    { id: 'forest',    name: 'Forest Park',          x: 36.1,  y: 16.7,  desc: 'Isang preserved na luntian sa gilid ng Ylang-Ylang River, para sa lakad at lilim.' },
    { id: 'play',      name: 'Play Area & Tri-Court', x: 88.5,  y: 20.9,  desc: 'Playground para sa mga bata, at court para sa basketball, volleyball at tennis.' },
    { id: 'clubhouse', name: 'Clubhouse & Pool',     x: 90.4,  y: 45.7,  desc: 'Resort-style na clubhouse at swimming pool, sa timog-silangang sulok ng village.' },
    { id: 'gate',      name: 'Gated Entrance',       x: 11.5,  y: 77.6,  desc: 'Isang guarded gate na may perimeter security para sa buong village.' },
    { id: 'midpark2',  name: 'Midpark 2',            x: 53.0,  y: 81.4,  desc: 'Isa pang pocket park sa gitna ng mga block, malapit sa bawat kalye.' }
  ];
  var vbox = $('vbox'); if (!vbox) return;
  var vFrame = $('vFrame'), vTitle = $('vTitle'), vDesc = $('vDesc'), vChips = $('vChips'), last = null, chips = [], token = 0, blobCache = {};

  function videoOf(id){ return (typeof VIDEOS !== 'undefined' && VIDEOS[id]) ? String(VIDEOS[id]).replace(/^\s+|\s+$/g, '') : ''; }

  // Ginagawang embed ang link: YouTube, Google Drive, Facebook, o direktang file
  function embed(url){
    var m;
    if (/^local:/.test(url)) return { kind: 'local', id: url.slice(6) };
    if ((m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/))) {
      var origin = (location.protocol.indexOf('http') === 0) ? '&origin=' + encodeURIComponent(location.origin) : '';
      // vq / hd ay hinihiling na HD (maaaring hindi na sundin ng YouTube), enablejsapi para makapagpadala ng utos sa player
      return { kind: 'iframe', yt: true, src: 'https://www.youtube.com/embed/' + m[1] + '?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&hd=1&vq=hd1080&enablejsapi=1' + origin };
    }
    if ((m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)) || (m = url.match(/drive\.google\.com\/open\?id=([\w-]+)/))) {
      return { kind: 'iframe', src: 'https://drive.google.com/file/d/' + m[1] + '/preview' };
    }
    if (/facebook\.com|fb\.watch/.test(url)) {
      return { kind: 'iframe', src: 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&show_text=false&autoplay=true' };
    }
    if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url)) return { kind: 'video', src: url };
    return { kind: 'iframe', src: url };
  }

  function soonHtml(s){
    var dw = D / 100, cx = s.x / 100, cy = s.y / 100, k = RATIO / dw;
    var px = (cx - dw / 2) / (1 - dw) * 100, py = (cy * k - 0.5) / (k - 1) * 100;
    var bg = (typeof IMAGES !== 'undefined' && IMAGES.amenitymap)
      ? 'background-image:url(\'' + IMAGES.amenitymap + '\');background-size:' + (100 / dw) + '% auto;background-position:' + px + '% ' + py + '%;' : '';
    return '<div class="v-circle" style="' + bg + '"></div><div class="v-soon-t">Video coming soon</div>';
  }

  function playBlob(src){
    var v = document.createElement('video');
    v.src = src; v.controls = true; v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
    vFrame.innerHTML = ''; vFrame.className = 'v-frame'; vFrame.appendChild(v);
    var p = v.play(); if (p && p.catch) p.catch(function(){});
  }

  // Sa Vercel static site, local Apps Script video ay gagamitin ang naka-configure na public fallback.
  function loadLocal(id, s, my, fb){
    if (my !== token) return;
    if (fb) { mount(fb, s, my, ''); return; }
    vFrame.className = 'v-frame v-soon';
    vFrame.innerHTML = soonHtml(s);
  }

  // Humihiling sa YouTube player na gamitin ang pinakamataas na kalidad (hindi ito garantisado, pero walang masama)
  function askHd(f, my){
    f.addEventListener('load', function(){
      [300, 1200, 2600, 5000].forEach(function(ms){
        setTimeout(function(){
          if (my !== token || !f.contentWindow) return;
          try {
            f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setPlaybackQualityRange', args: ['hd1080', 'highres'] }), '*');
            f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['hd1080'] }), '*');
          } catch (err) {}
        }, ms);
      });
    });
  }

  // Ginagawa ang player. Ang url ay maaaring 'local:gate' (sariling video), YouTube, Drive, Facebook o .mp4
  function mount(url, s, my, fb){
    var e = embed(url);
    vFrame.innerHTML = '';
    vFrame.className = 'v-frame';
    if (e.kind === 'local') {
      loadLocal(e.id, s, my, fb);
    } else if (e.kind === 'video') {
      var v = document.createElement('video');
      v.src = e.src; v.controls = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline', '');
      vFrame.appendChild(v);
    } else {
      var f = document.createElement('iframe');
      f.src = e.src; f.title = s.name;
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      f.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
      f.setAttribute('allowfullscreen', '');
      vFrame.appendChild(f);
      if (e.yt) askHd(f, my);
    }
  }

  function show(i){
    var my = ++token;
    var s = SPOTS[i], raw = videoOf(s.id).split('|');
    var url = raw[0].replace(/^\s+|\s+$/g, ''), fb = (raw[1] || '').replace(/^\s+|\s+$/g, '');   // 'local:gate|https://youtu.be/XXXX' = sariling video, YouTube kung hindi ma-load
    vTitle.textContent = s.name;
    vDesc.textContent = s.desc;
    vFrame.innerHTML = '';
    if (url) {
      mount(url, s, my, fb);
    } else {
      vFrame.className = 'v-frame v-soon';
      vFrame.innerHTML = soonHtml(s);
    }
    chips.forEach(function(c, k){ c.classList.toggle('on', k === i); });
  }

  function open(i){
    last = document.activeElement;
    show(i);
    vbox.classList.add('open'); vbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    vbox.scrollTop = 0;
    setTimeout(function(){ $('vClose').focus(); }, 50);
  }
  function close(){
    vFrame.innerHTML = '';   // titigil ang video
    vbox.classList.remove('open'); vbox.setAttribute('aria-hidden', 'true');
    var lb = $('lightbox');
    if (!(lb && lb.classList.contains('open'))) document.body.classList.remove('modal-open');
    if (last && last.focus) last.focus();
  }

  // mga chip para lumipat sa ibang lugar
  SPOTS.forEach(function(s, i){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'v-chip'; b.textContent = s.name;
    b.addEventListener('click', function(){ show(i); });
    vChips.appendChild(b); chips.push(b);
  });

  // mga pinipindot na bilog sa ibabaw ng site plan (sa page at sa enlarged view)
  function addSpots(container){
    if (!container) return;
    SPOTS.forEach(function(s, i){
      var b = document.createElement('button'), has = !!videoOf(s.id);
      b.type = 'button';
      b.className = 'hs' + (has ? ' has-video' : '');
      b.style.left = s.x + '%'; b.style.top = s.y + '%'; b.style.width = D + '%';
      b.setAttribute('aria-label', 'Tingnan ang ' + s.name + (has ? ' (video)' : ''));
      b.addEventListener('click', function(e){ e.stopPropagation(); open(i); });
      container.appendChild(b);
    });
  }
  addSpots(document.querySelector('.am-img'));
  addSpots($('lbWrap'));

  $('vClose').addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && vbox.classList.contains('open')) close(); });
})();
/* ============ MOBILE QUICK-CONTACT BAR ============ */
(function(){
  var bar = $('stickybar'), inq = $('inquire');
  if (!bar) return;
  var inInquire = false;
  function update(){ bar.classList.toggle('show', (window.pageYOffset || document.documentElement.scrollTop) > 520 && !inInquire); }
  if ('IntersectionObserver' in window && inq) {
    new IntersectionObserver(function(es){ es.forEach(function(e){ inInquire = e.isIntersecting; update(); }); }, { threshold: .12 }).observe(inq);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
/* ============ PREMIUM POLISH: STICKY NAV, REVEAL, COUNT-UP, BACK TO TOP ============ */
(function(){
  var header = document.querySelector('header'), totop = $('totop');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav: nagiging solid pag nag-scroll, at may gintong guhit ang kasalukuyang seksyon
  var spy = [['residences', 'a[href="#residences"]'], ['community', 'a[href="#community"]'], ['process', 'a[href="#process"]'], ['faq', 'a[href="#faq"]']]
    .map(function(p){ return { el: document.getElementById(p[0]), link: document.querySelector('nav ' + p[1]) }; })
    .filter(function(x){ return x.el && x.link; });
  function onScroll(){
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (totop) totop.classList.toggle('show', y > 900);
    var mid = y + window.innerHeight * 0.3;
    spy.forEach(function(x){
      var top = x.el.offsetTop, bottom = top + x.el.offsetHeight;
      x.link.classList.toggle('active', mid >= top && mid < bottom);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // count-up ng mga numero sa "key facts"
  function countUp(b){
    var target = parseInt(b.getAttribute('data-count'), 10);
    if (!target || reduce) return;
    var start = null, dur = 1100;
    b.textContent = '0';
    function step(t){
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / dur);
      b.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step); else b.textContent = target;
    }
    requestAnimationFrame(step);
  }

  // dahan-dahang paglabas ng mga bahagi habang nag-i-scroll
  var targets = [].slice.call(document.querySelectorAll(
    'section:not(.hero) .eyebrow, section:not(.hero) .h2, .cmp-h, .fact, .pain, .pain-end, .home, .compare .cmp-wrap, .comm-copy > *, .am-row, .am-right, .step, .pt2-photo, .pt2-body > *, .pt-lead, .pt-mission, .pt-cta, .pt-conn, .faq-left > *, .faq-item, .inq-copy > *, .ft-grid > div'));
  if (!('IntersectionObserver' in window) || reduce) { targets.forEach(function(el){ el.classList.add('in'); }); return; }
  var seen = new WeakMap();
  targets.forEach(function(el){
    el.classList.add('reveal');
    var sib = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = (Math.min(sib, 5) * 70) + 'ms';
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      var el = e.target; el.classList.add('in'); io.unobserve(el);
      var n = el.querySelector ? el.querySelector('[data-count]') : null;
      if (n) countUp(n);
      if (el.firstElementChild === null && el.hasAttribute && el.hasAttribute('data-count')) countUp(el);
      setTimeout(function(){ el.style.transitionDelay = ''; }, 1200);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(function(el){ io.observe(el); });
})();
