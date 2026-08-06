/* ================================================================
   CESA · Barra de navegación unificada — inyector
   Añade la misma topbar a todas las páginas del proyecto.
   ================================================================ */
(function(){
  if (window.__cesaTopbarLoaded) return;
  window.__cesaTopbarLoaded = true;

  var DOCS = [
    { key:'arquitectura', href:'/arquitectura-macroprocesos.html', label:'Inicio',
      icon:'<path d="M4 6h16M4 12h16M4 18h10"/>' },
    { key:'entrenamiento', href:'/entrenamiento-daruma.html', label:'Contenido Tutorial',
      icon:'<path d="M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1 3 3 6 3s6-2 6-3v-5"/>' },
    { key:'glosario', href:'/glosario.html', label:'Glosario',
      icon:'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>' }
  ];

  var path = location.pathname.toLowerCase();
  var currentKey =
    path.indexOf('entrenamiento') > -1 ? 'entrenamiento' :
    path.indexOf('glosario') > -1 ? 'glosario' : 'arquitectura';

  var docsHTML = DOCS.map(function(d){
    var on = d.key === currentKey ? ' on' : '';
    var aria = on ? ' aria-current="page"' : '';
    return '<a href="'+d.href+'" class="'+on.trim()+'"'+aria+' title="'+d.label+'">'+
             '<svg viewBox="0 0 24 24">'+d.icon+'</svg><span>'+d.label+'</span>'+
           '</a>';
  }).join('');

  var drawerDocsHTML = DOCS.map(function(d){
    var on = d.key === currentKey ? ' class="on"' : '';
    return '<a href="'+d.href+'"'+on+'>'+
             '<svg viewBox="0 0 24 24" fill="none">'+d.icon+'</svg>'+d.label+
           '</a>';
  }).join('');

  var sunIcon  = '<circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>';
  var moonIcon = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
  var logoSVG  = '<svg class="tb-logo-img" width="96" height="102" viewBox="0 0 96 102" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_32_27)"><path d="M92.0608 0.000854492C93.3896 0.95047 94.5799 2.05672 95.626 3.32819V0.000854492H92.0608Z" fill="currentColor"/><path d="M91.5552 41.7827C91.9019 41.9363 92.2471 42.0923 92.5769 42.2686C93.7376 42.897 94.744 43.6973 95.622 44.6469V38.5813C94.882 39.4013 94.0881 40.1249 93.2318 40.7373C92.6948 41.1193 92.1303 41.4609 91.5552 41.7827Z" fill="currentColor"/><path d="M81.068 6.06946C79.2719 6.06946 77.7813 6.40668 76.6032 7.07436C75.4144 7.75063 74.4588 8.57679 73.7658 9.57554C73.0454 10.5608 72.5506 11.6124 72.2536 12.7198C71.9682 13.8371 71.7853 14.8187 71.7356 15.7106H89.9859C89.469 12.5552 88.5308 10.1628 87.1977 8.51966C85.8414 6.88763 83.7991 6.06946 81.068 6.06946Z" fill="currentColor"/><path d="M60.2821 6.32569C61.0818 7.86498 61.6162 9.61802 61.9201 11.5682C61.9656 11.4288 61.9978 11.2832 62.0444 11.1462C63.0412 8.23229 64.4625 5.71329 66.2988 3.59293C67.5092 2.19062 68.8909 1.00759 70.41 0.000854492H54.6233C55.0874 0.307975 55.5356 0.632294 55.9706 0.988553C57.7397 2.40991 59.1737 4.20165 60.2821 6.32569Z" fill="currentColor"/><path d="M88.1116 84.2669C87.9953 83.5378 87.8901 82.7994 87.8473 82.0464C86.0433 84.0973 83.9465 85.515 81.5346 86.3461C79.1164 87.1581 76.6443 87.5592 74.1278 87.5592C72.1885 87.5592 70.3771 87.2987 68.691 86.7828C67.0213 86.2502 65.5471 85.4351 64.2843 84.3326C63.1701 83.3473 62.2784 82.1139 61.5939 80.6705C60.5722 82.4094 59.2973 83.8529 57.7428 84.9524C56.0155 86.1735 54.0365 87.0512 51.8128 87.534C49.5818 88.034 47.3163 88.2766 45.0075 88.2766C42.6475 88.2766 40.3456 88.0149 38.0965 87.4904C35.8348 86.9585 33.8289 86.0967 32.0772 84.8645C30.3203 83.6545 28.8778 82.0304 27.7499 80.012C26.623 78.0028 26.0178 75.4869 25.9115 72.4618H36.5584C36.5584 73.7947 36.801 74.9421 37.2942 75.9009C37.8 76.8646 38.4375 77.6417 39.2272 78.2559C40.0115 78.8757 40.9106 79.3198 41.9345 79.6152C42.9557 79.9131 44.016 80.0501 45.1159 80.0501C45.9014 80.0501 46.7249 79.9481 47.5822 79.7375C48.4543 79.5452 49.2408 79.216 49.9475 78.7798C50.6489 78.3401 51.2378 77.7504 51.7135 77.0373C52.1828 76.2977 52.4212 75.388 52.4212 74.2689C52.4212 72.3924 51.3065 70.9962 49.0717 70.0687C46.8374 69.1301 43.7237 68.1953 39.7362 67.2622C38.1045 66.8531 36.5235 66.3704 34.9801 65.8188C33.423 65.2592 32.0566 64.5276 30.8393 63.629C29.6347 62.7132 28.6601 61.583 27.9227 60.1929C27.1928 58.8422 26.8281 57.1574 26.8281 55.1709C26.8281 52.2527 27.3344 49.8565 28.3598 47.9862C29.3784 46.1225 30.732 44.6478 32.4113 43.5526C33.0524 43.1466 33.7375 42.7952 34.4383 42.4801C31.962 41.3438 29.8393 39.7774 28.0934 37.7744C26.3254 35.737 24.9347 33.3058 23.9463 30.4895C22.9405 27.6671 22.4558 24.5615 22.4558 21.1789C22.4558 17.6918 22.914 14.4456 23.8316 11.4585C24.7376 8.44874 26.0886 5.86893 27.8662 3.67733C29.0401 2.23939 30.4059 1.02442 31.9287 0.00109863H0.0012207V110.303H95.6246V86.4148L88.6163 86.3878C88.4155 85.6956 88.2437 84.9861 88.1116 84.2669Z" fill="currentColor"/><path d="M42.6602 34.9928C45.3374 34.9928 47.4157 34.1587 48.8635 32.4886C50.3075 30.8338 51.2135 28.6029 51.5877 25.8044H60.9629C60.6981 24.1404 60.558 22.4027 60.558 20.576C60.558 18.2406 60.8149 16.0238 61.2906 13.9029H51.1918C50.4561 8.68735 47.6869 6.06946 42.9018 6.06946C41.111 6.06946 39.6035 6.50741 38.3873 7.42017C37.1785 8.32618 36.1922 9.48832 35.4189 10.9127C34.6625 12.3366 34.1207 13.9139 33.8073 15.6338C33.4933 17.3518 33.3311 19.0637 33.3311 20.7406C33.3311 22.3677 33.4933 24.0378 33.8073 25.7258C34.1207 27.4155 34.6345 28.9401 35.3459 30.3098C36.0563 31.6876 37.0236 32.8012 38.2388 33.6839C39.4418 34.5518 40.916 34.9928 42.6602 34.9928Z" fill="currentColor"/><path d="M74.5085 32.2798C76.1925 34.0906 78.6144 34.9935 81.7815 34.9935C84.0512 34.9935 85.9952 34.3658 87.6211 33.1109C89.2644 31.8468 90.2587 30.5108 90.6276 29.1171H95.6241V23.5422H71.7356C71.9037 27.5698 72.8292 30.4801 74.5085 32.2798Z" fill="currentColor"/><path d="M56.0801 39.5321C55.0494 40.4707 53.9231 41.244 52.719 41.9025C54.0267 42.3582 55.2403 42.9479 56.3534 43.6991C57.9914 44.7937 59.3419 46.2679 60.4218 48.1106C61.0407 49.1738 61.5048 50.4134 61.8405 51.804C62.1761 50.3004 62.6677 48.9509 63.3574 47.7955C64.515 45.8698 65.9971 44.3189 67.7836 43.1512C68.725 42.5419 69.7351 42.0284 70.8081 41.5972C69.03 40.5628 67.4702 39.2649 66.1361 37.6943C64.358 35.6004 62.9763 33.1035 62.0043 30.1821C61.9108 29.907 61.8447 29.6164 61.7612 29.332C60.7321 33.636 58.8498 37.0438 56.0801 39.5321Z" fill="currentColor"/><path d="M83.2266 66.0422C82.4148 66.2308 81.5569 66.3604 80.6536 66.4869C79.764 66.6061 78.8649 66.7504 77.9616 66.92C77.1185 67.0956 76.2876 67.337 75.4641 67.6135C74.6443 67.9077 73.9281 68.3057 73.3208 68.8124C72.7262 69.3124 72.2288 69.9261 71.8577 70.6791C71.492 71.4365 71.3059 72.399 71.3059 73.5704C71.3059 74.6766 71.492 75.6066 71.8577 76.3694C72.2288 77.1311 72.7304 77.7324 73.37 78.1692C74.0085 78.5905 74.7395 78.9087 75.5794 79.0764C76.433 79.2607 77.302 79.3405 78.2063 79.3405C80.4252 79.3405 82.1293 78.9394 83.3461 78.1194C84.5634 77.2994 85.4561 76.3307 86.0428 75.1944C86.6243 74.0501 86.9816 72.9008 87.1148 71.7325C87.2422 70.5686 87.3156 69.6447 87.3156 68.9365V64.2892C86.8336 64.764 86.2437 65.1313 85.5296 65.3917C84.8145 65.6522 84.0528 65.8745 83.2266 66.0422Z" fill="currentColor"/><path d="M62.3666 55.0415H51.6779C51.5162 52.6675 50.6953 51.0404 49.2201 50.1983C47.7348 49.3592 45.9985 48.9311 43.9799 48.9311C43.3467 48.9311 42.6648 48.9722 41.9259 49.0601C41.1891 49.1534 40.5189 49.3481 39.9068 49.6387C39.3037 49.9218 38.7793 50.3549 38.3708 50.9034C37.9352 51.4581 37.728 52.2013 37.728 53.1313C37.728 54.2486 38.0954 55.1564 38.8422 55.8499C39.5722 56.5581 40.5305 57.1257 41.7192 57.5618C42.9096 58.0046 44.2632 58.3916 45.7865 58.7528C47.3231 59.0931 48.8792 59.48 50.4601 59.8861C52.0939 60.2994 53.6849 60.7939 55.2489 61.3676C56.7908 61.9603 58.1714 62.7386 59.3918 63.6993C60.4146 64.515 61.2582 65.499 61.9416 66.6323C62.6594 65.467 63.5088 64.4984 64.5078 63.73C65.7896 62.7386 67.269 61.9911 68.9335 61.4862C70.5905 60.9948 72.273 60.5967 73.9617 60.3142C75.6436 60.0187 77.3039 59.7816 78.9382 59.617C80.5604 59.4383 82.0218 59.1619 83.283 58.8179C84.5442 58.4733 85.5463 57.9555 86.2826 57.2854C87.0215 56.6128 87.3693 55.6472 87.3191 54.3493C87.3191 53.0078 87.1183 51.9359 86.7192 51.1509C86.3212 50.358 85.7947 49.7542 85.1282 49.3254C84.4717 48.8764 83.7069 48.5828 82.8369 48.4323C81.9711 48.2917 81.0313 48.21 80.0318 48.21C77.8155 48.21 76.0691 48.7419 74.8011 49.7922C73.5436 50.8408 72.7962 52.5834 72.5801 55.0379H62.3666V55.0415Z" fill="currentColor"/></g><defs><clipPath id="clip0_32_27"><rect width="95.625" height="102" fill="white"/></clipPath></defs></svg>';


  var nav = document.createElement('nav');
  nav.className = 'cesa-topbar';
  nav.id = 'cesaTopbar';
  nav.setAttribute('aria-label', 'Navegación principal');
  nav.innerHTML =
    '<div class="tb-in">'+
      '<a class="tb-logo" href="/arquitectura-macroprocesos.html" aria-label="Inicio · Arquitectura de Procesos">'+
        logoSVG +
        '<span class="tb-logo-text">'+
          '<strong>Arquitectura de Procesos</strong>'+
          '<small>Oficina de Transformación</small>'+
        '</span>'+
      '</a>'+

      '<div class="tb-spacer"></div>'+
      '<nav class="tb-docs" aria-label="Documentos">'+ docsHTML +'</nav>'+
      '<div class="tb-actions">'+
        '<button class="tb-icon" id="cesaTheme" data-tip="Cambiar tema" aria-label="Cambiar tema">'+
          '<svg id="cesaThemeIcon" viewBox="0 0 24 24">'+sunIcon+'</svg>'+
        '</button>'+
        '<button class="tb-icon tb-burger" id="cesaBurger" aria-label="Abrir menú" aria-expanded="false">'+
          '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'+
        '</button>'+
      '</div>'+
    '</div>';

  var drawer = document.createElement('div');
  drawer.className = 'cesa-drawer';
  drawer.id = 'cesaDrawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Menú');
  drawer.innerHTML =
    '<div class="panel">'+
      '<button class="close" id="cesaDrawerClose" aria-label="Cerrar menú">'+
        '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18"/></svg>'+
      '</button>'+
      '<h4>Documentos</h4>'+
      drawerDocsHTML +
    '</div>';

  function mount(){
    // Evitar duplicados si la página ya trajo su vieja barra
    var old = document.getElementById('topbar');
    if (old && old !== nav) { try{ old.remove(); }catch(e){} }
    document.body.insertBefore(nav, document.body.firstChild);
    document.body.appendChild(drawer);
    wire();
  }

  function wire(){
    // Sombra al hacer scroll
    var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });

    // Drawer móvil
    var burger = document.getElementById('cesaBurger');
    var closeBtn = document.getElementById('cesaDrawerClose');
    var openDrawer  = function(){ drawer.classList.add('open');  burger.setAttribute('aria-expanded','true');  };
    var closeDrawer = function(){ drawer.classList.remove('open');burger.setAttribute('aria-expanded','false'); };
    burger.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    drawer.addEventListener('click', function(e){ if (e.target === drawer) closeDrawer(); });
    drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeDrawer); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });

    // Tema unificado
    var themeBtn = document.getElementById('cesaTheme');
    var themeIcon = document.getElementById('cesaThemeIcon');

    function applyTheme(t){
      document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
      if (themeIcon) themeIcon.innerHTML = (t === 'dark') ? moonIcon : sunIcon;
      if (themeBtn) themeBtn.setAttribute('data-tip', t === 'dark' ? 'Modo claro' : 'Modo oscuro');
      // Notifica a los scripts existentes de cada página
      window.dispatchEvent(new CustomEvent('cesa-theme-change', { detail:{ theme:t } }));
    }
    // Por preferencia de los usuarios, cada visita a la página siempre inicia en modo claro
    // (el cambio a oscuro con el botón solo aplica durante esa sesión, no se recuerda entre visitas).
    applyTheme('light');

    themeBtn.addEventListener('click', function(){
      var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(cur);
    });

    // El menú hamburguesa solo tiene sentido en móvil
    var mq = window.matchMedia('(max-width: 560px)');
    var syncBurger = function(){ burger.style.display = mq.matches ? 'grid' : 'none'; };
    syncBurger();
    if (mq.addEventListener) mq.addEventListener('change', syncBurger);
    else mq.addListener(syncBurger);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

/* ================================================================
   CESA · Modal de bienvenida reutilizable (primera visita, por página)
   Uso: cesaShowIntro('diagrama', {
     eyebrow: 'Cómo usar esta página',
     title: 'Título',
     items: ['Primer punto…', 'Segundo punto…']
   });
   Guarda en localStorage que ya se mostró, para no repetir en próximas visitas.
   ================================================================ */
function cesaShowIntro(key, opts){
  var STORAGE_KEY = 'cesa-intro-seen-' + key;
  try { if (localStorage.getItem(STORAGE_KEY)) return; } catch(e){}

  var run = function(){
    var overlay = document.createElement('div');
    overlay.className = 'cs-intro-overlay';
    var itemsHTML = (opts.items || []).map(function(text, i){
      return '<li><span class="cs-intro-num">' + (i + 1) + '</span><span>' + text + '</span></li>';
    }).join('');
    overlay.innerHTML =
      '<div class="cs-intro" role="dialog" aria-modal="true" aria-labelledby="cs-intro-title">' +
        (opts.mascot ? '<img class="cs-intro-mascot" src="/mascota-cesa.png" alt="" aria-hidden="true">' : '') +
        (opts.eyebrow ? '<span class="cs-intro-eyebrow">' + opts.eyebrow + '</span>' : '') +
        '<h2 id="cs-intro-title">' + opts.title + '</h2>' +
        (opts.lede ? '<p style="font-size:13.5px;line-height:1.55;opacity:.85">' + opts.lede + '</p>' : '') +
        '<ul>' + itemsHTML + '</ul>' +
        '<button type="button" class="cs-intro-close">Entendido, empezar</button>' +
      '</div>';
    document.body.appendChild(overlay);

    var dismiss = function(){
      overlay.classList.remove('show');
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch(e){}
      setTimeout(function(){ overlay.remove(); }, 220);
    };
    overlay.querySelector('.cs-intro-close').addEventListener('click', dismiss);
    overlay.addEventListener('click', function(e){ if (e.target === overlay) dismiss(); });
    document.addEventListener('keydown', function onKey(e){
      if (e.key === 'Escape') { dismiss(); document.removeEventListener('keydown', onKey); }
    });
    requestAnimationFrame(function(){ overlay.classList.add('show'); });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
}

/* ================================================================
   CESA · Puerta de acceso (nombre + correo institucional)
   Uso: cesaMountVisitorGate('arquitectura', onDone)
   Bloquea el contenido hasta que la persona escribe su nombre y un
   correo @cesa.edu.co. Guarda el registro en Supabase (tabla
   page_visitors, solo INSERT anónimo) para que el administrador vea
   quién ha ingresado, y recuerda en localStorage para no volver a
   pedirlo en ese navegador. onDone se invoca cuando ya se puede
   mostrar el resto de la página (de inmediato si ya estaba registrado,
   o tras el envío exitoso del formulario).
   ================================================================ */
function cesaMountVisitorGate(key, onDone){
  var STORAGE_KEY = 'cesa-visitor';
  var done = function(){ if (typeof onDone === 'function') onDone(); };

  try {
    if (localStorage.getItem(STORAGE_KEY)) { done(); return; }
  } catch(e){}

  var SUPABASE_URL = 'https://mbvubjijrgcgnbxztbvy.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idnViamlqcmdjZ25ieHp0YnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNjc1NzQsImV4cCI6MjA5ODk0MzU3NH0.PltsAos0prjHtzawopdfgEwRvT1eqdNFiPAEYqjMce8';

  var run = function(){
    var overlay = document.createElement('div');
    overlay.className = 'cs-gate-overlay';
    overlay.innerHTML =
      '<form class="cs-gate" role="dialog" aria-modal="true" aria-labelledby="cs-gate-title" novalidate>' +
        '<span class="cs-gate-eyebrow">Acceso</span>' +
        '<h2 id="cs-gate-title">Escribe tu nombre y correo CESA para ingresar</h2>' +
        '<label class="cs-gate-field">' +
          '<span>Nombre completo</span>' +
          '<input type="text" name="name" autocomplete="name" required placeholder="Ej. Juana Pérez">' +
        '</label>' +
        '<label class="cs-gate-field">' +
          '<span>Correo institucional CESA</span>' +
          '<input type="email" name="email" autocomplete="email" required placeholder="nombre@cesa.edu.co">' +
        '</label>' +
        '<span class="cs-gate-error" hidden></span>' +
        '<button type="submit">Ingresar</button>' +
      '</form>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function(){ overlay.classList.add('show'); });

    var form = overlay.querySelector('.cs-gate');
    var errorEl = overlay.querySelector('.cs-gate-error');
    var nameInput = form.querySelector('[name="name"]');
    var emailInput = form.querySelector('[name="email"]');
    var btn = form.querySelector('button');

    function showError(msg){
      errorEl.textContent = msg;
      errorEl.hidden = false;
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = nameInput.value.trim();
      var email = emailInput.value.trim().toLowerCase();

      if (name.length < 3) { showError('Escribe tu nombre completo.'); return; }
      if (!/^[^\s@]+@cesa\.edu\.co$/.test(email)) { showError('Usa tu correo institucional @cesa.edu.co.'); return; }

      errorEl.hidden = true;
      btn.disabled = true;
      btn.textContent = 'Ingresando…';

      fetch(SUPABASE_URL + '/rest/v1/page_visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ name: name, email: email, page: key })
      }).catch(function(){}).then(function(){
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: name, email: email })); } catch(e){}
        overlay.classList.remove('show');
        setTimeout(function(){ overlay.remove(); }, 220);
        done();
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
}

/* ================================================================
   CESA · Widget de retroalimentación (¿te fue útil?) por página
   Uso: cesaMountFeedback('glosario');
   Guarda el voto en Supabase (tabla page_feedback, solo INSERT anónimo)
   y recuerda en localStorage para no volver a preguntar en esa página.
   ================================================================ */
function cesaMountFeedback(key){
  var STORAGE_KEY = 'cesa-feedback-' + key;
  try { if (localStorage.getItem(STORAGE_KEY)) return; } catch(e){}

  var SUPABASE_URL = 'https://mbvubjijrgcgnbxztbvy.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idnViamlqcmdjZ25ieHp0YnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNjc1NzQsImV4cCI6MjA5ODk0MzU3NH0.PltsAos0prjHtzawopdfgEwRvT1eqdNFiPAEYqjMce8';

  function remember(){ try { localStorage.setItem(STORAGE_KEY, '1'); } catch(e){} }

  var run = function(){
    var widget = document.createElement('div');
    widget.className = 'cs-feedback';
    widget.innerHTML =
      '<button type="button" class="cs-feedback-close" aria-label="Cerrar">✕</button>' +
      '<span class="cs-feedback-q">¿Te fue útil este contenido?</span>' +
      '<div class="cs-feedback-actions">' +
        '<button type="button" class="cs-feedback-btn" data-useful="1" aria-label="Sí, fue útil">👍</button>' +
        '<button type="button" class="cs-feedback-btn" data-useful="0" aria-label="No fue útil">👎</button>' +
      '</div>';
    document.body.appendChild(widget);
    requestAnimationFrame(function(){ widget.classList.add('show'); });

    var goAway = function(){
      widget.classList.remove('show');
      setTimeout(function(){ widget.remove(); }, 260);
    };

    widget.querySelector('.cs-feedback-close').addEventListener('click', function(){
      remember();
      goAway();
    });

    widget.querySelectorAll('.cs-feedback-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var useful = btn.getAttribute('data-useful') === '1';
        remember();
        widget.innerHTML = '<span class="cs-feedback-thanks">✓ ¡Gracias por tu opinión!</span>';
        setTimeout(goAway, 1800);
        fetch(SUPABASE_URL + '/rest/v1/page_feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
          },
          body: JSON.stringify({ page: key, useful: useful })
        }).catch(function(){});
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
}
