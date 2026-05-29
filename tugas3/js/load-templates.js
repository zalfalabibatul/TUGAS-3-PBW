/* ================================================
   Template Loader — Muat template dari folder templates/
   Catatan: sidebar, topbar, dashboard, tracking, dan laporan
   sudah menggunakan inline template di JS masing-masing.
   ================================================ */
(function() {
  var templateFiles = [
    { id: 'tpl-stock',        url: 'templates/stok-table.html' },
    { id: 'tpl-history',      url: 'templates/history-page.html' },
    { id: 'tpl-status-badge', url: 'templates/status-badge.html' }
  ];

  var loaded = 0;
  var total  = templateFiles.length;

  function inject(id, html) {
    var s = document.createElement('script');
    s.type = 'text/x-template';
    s.id   = id;
    s.text = html;
    document.body.appendChild(s);
  }

  function onAllLoaded() {
    window.__templatesReady = true;
    document.dispatchEvent(new Event('templates-ready'));
  }

  templateFiles.forEach(function(tpl) {
    fetch(tpl.url)
      .then(function(r) { return r.text(); })
      .then(function(html) {
        inject(tpl.id, html);
        loaded++;
        if (loaded === total) onAllLoaded();
      })
      .catch(function() {
        loaded++;
        if (loaded === total) onAllLoaded();
      });
  });
})();
