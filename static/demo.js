(function () {
  var clean = /[?&]clean/.test(location.search);
  if (clean) { return; }

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  var tm, toastEl;
  function toast(m) {
    if (!toastEl) { return; }
    toastEl.textContent = m;
    toastEl.classList.add('on');
    clearTimeout(tm);
    tm = setTimeout(function () { toastEl.classList.remove('on'); }, 2600);
  }

  ready(function () {
    // Banner y aviso
    var b = document.createElement('div');
    b.id = 'demo-banner';
    b.innerHTML = '<span><b>DEMO</b> · Datos 100% ficticios · versión de muestra: podés navegar y filtrar, pero no guardar cambios</span><a href="index.html">← Volver a la presentación</a>';
    document.body.prepend(b);
    toastEl = document.createElement('div');
    toastEl.id = 'demo-toast';
    document.body.appendChild(toastEl);

    // Dashboard: los indicadores se recalculan con páginas pre-generadas
    var anio = document.getElementById('anio'), sede = document.getElementById('sede');
    if (anio && sede) {
      var go = function () {
        location.href = 'dashboard-' + anio.value + '-' + (sede.value || 'todas') + '.html';
      };
      anio.addEventListener('change', go);
      sede.addEventListener('change', go);
    }

    // Dashboard: filtro del tablero por sede (el año no cambia nada: todos son de 2026)
    var ks = document.getElementById('k_sede');
    if (ks) {
      ks.addEventListener('change', function () {
        var v = ks.value;
        var label = ks.options[ks.selectedIndex].text.toLowerCase();
        document.querySelectorAll('button[data-meta]').forEach(function (btn) {
          var show = !v || btn.dataset.meta.toLowerCase().indexOf(label) === 0;
          btn.style.display = show ? '' : 'none';
        });
        document.querySelectorAll('.w-64.shrink-0').forEach(function (col) {
          var n = [].filter.call(col.querySelectorAll('button[data-meta]'), function (x) {
            return x.style.display !== 'none';
          }).length;
          var badge = col.querySelector('span.rounded-full');
          if (badge) { badge.textContent = n; }
        });
        document.querySelectorAll('h3').forEach(function (h) {
          if (h.textContent.indexOf('Hallazgos por estado') === 0) {
            var sp = h.querySelector('span');
            if (sp) { sp.textContent = '· Todos los años · ' + (v ? ks.options[ks.selectedIndex].text : 'Ambas sedes'); }
          }
        });
      });
    }

    // Listado: filtros del lado del cliente
    var fs = document.querySelector('select[name=site]');
    if (fs && fs.form) {
      var f = fs.form;
      var cols = { 2: f.elements.site, 3: f.elements.type, 4: f.elements.severity, 5: f.elements.status };
      var applyFilters = function () {
        var rows = document.querySelectorAll('tbody tr'), visible = 0;
        rows.forEach(function (tr) {
          var ok = true;
          Object.keys(cols).forEach(function (i) {
            var s = cols[i];
            if (s && s.value) {
              var txt = s.options[s.selectedIndex].text.trim();
              if (tr.children[i].textContent.trim() !== txt) { ok = false; }
            }
          });
          tr.style.display = ok ? '' : 'none';
          if (ok) { visible++; }
        });
        if (!visible) { toast('No hay hallazgos con esos filtros.'); }
      };
      Object.keys(cols).forEach(function (i) { cols[i].addEventListener('change', applyFilters); });
      f.addEventListener('submit', function (e) { e.preventDefault(); applyFilters(); });
    }
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-disabled]');
    if (a) {
      e.preventDefault();
      toast('Esto es una demo: acá no se guardan cambios.');
    }
  });

  document.addEventListener('submit', function (e) {
    if (e.target.matches('form[method=get]')) { e.preventDefault(); return; }
    e.preventDefault();
    toast('Esto es una demo: acá no se guardan cambios.');
  }, true);
})();
