(function () {
  'use strict';
  var root = document.documentElement;

  function copyText(text, callback) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(callback);
      return;
    }
    var area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    callback();
  }

  function initTheme() {
    var button = document.getElementById('theme-toggle');
    if (!button) return;
    var theme = localStorage.getItem('kaui-theme');
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    function sync() { button.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'; }
    sync();
    button.addEventListener('click', function () {
      if (root.getAttribute('data-theme') === 'dark') { root.removeAttribute('data-theme'); localStorage.setItem('kaui-theme', 'light'); }
      else { root.setAttribute('data-theme', 'dark'); localStorage.setItem('kaui-theme', 'dark'); }
      sync();
    });
  }

  function initDrawer() {
    var sidebar = document.querySelector('.demo-sidebar');
    var toggle = document.querySelector('.demo-sidebar-toggle');
    if (!sidebar || !toggle) return;
    toggle.addEventListener('click', function () {
      var open = sidebar.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function fileLinks(version, files) {
    return files.map(function (entry) {
      var file = typeof entry === 'string' ? entry : entry.name;
      var href = typeof entry === 'string' ? 'https://longbm64.github.io/kaui/dist/versions/' + encodeURIComponent(version) + '/' + encodeURIComponent(file) : entry.url;
      return '<a class="demo-version-tree__file" href="' + href + '" target="_blank" rel="noopener noreferrer"><i data-lucide="file-code-2" aria-hidden="true"></i><span>' + file + '</span></a>';
    }).join('');
  }

  function fallbackRegistry() {
    return {
      latest: '1.0.0',
      versions: {
        '1.0.0': {
          version: '1.0.0',
          builtAt: 'Build archive available locally',
          files: ['kaui.css', 'kaui.css.map', 'kaui.min.css', 'kaui.min.css.map', 'kaui-chart.css', 'kaui-chart.js', 'kaui-chart.min.css', 'kaui-chart.min.js', 'kaui-agent-manifest.json']
        }
      }
    };
  }

  function loadRegistry(callback) {
    var urls = ['../dist/versions/index.json', 'https://longbm64.github.io/kaui/dist/versions/index.json'];
    var index = 0;
    function attempt() {
      if (index >= urls.length) { callback(fallbackRegistry()); return; }
      fetch(urls[index++], { cache: 'no-store' }).then(function (response) {
        if (!response.ok) throw new Error('registry unavailable');
        return response.json();
      }).then(callback).catch(attempt);
    }
    attempt();
  }

  function formatBuildTime(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return value || 'Release ready';
    function pad(number) { return String(number).padStart(2, '0'); }
    return date.getFullYear() + '/' + pad(date.getMonth() + 1) + '/' + pad(date.getDate());
  }

  function render(data) {


    var latest = data.latest;
    var badge = document.getElementById('latest-version-badge');
    var url = document.getElementById('manifest-url-display');
    if (badge) badge.textContent = 'Latest: v' + latest;
    if (url) url.textContent = 'https://longbm64.github.io/kaui/dist/versions/' + latest + '/kaui-agent-manifest.json';
    var container = document.getElementById('versions-container');
    container.classList.add('demo-version-tree');
    var versions = Object.keys(data.versions || {}).sort(function (a, b) { return b.localeCompare(a, undefined, { numeric: true }); });


    container.innerHTML = versions.map(function (version) {
      var item = data.versions[version];
      var isLatest = version === latest;
      var files = item.files || [];
      var built = formatBuildTime(item.builtAt);
      return '<details class="demo-version-tree__item"' + (isLatest ? ' open' : '') + '><summary class="demo-version-tree__summary"><i data-lucide="folder" aria-hidden="true"></i><span class="demo-version-tree__version">v' + version + '</span>' + (isLatest ? '<span class="k-badge k-badge--success k-badge--pill">Latest</span>' : '') + '<span class="demo-version-tree__meta">Built ' + built + '</span></summary><div class="demo-version-tree__children">' + fileLinks(version, files) + '<a class="demo-version-tree__file" href="https://longbm64.github.io/kaui/dist/versions/' + version + '/metadata.json" target="_blank" rel="noopener noreferrer"><i data-lucide="clipboard-list" aria-hidden="true"></i><span>metadata.json</span></a></div></details>';
    }).join('');
  }


  document.addEventListener('DOMContentLoaded', function () {
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
    initTheme();
    initDrawer();
    var copyButton = document.getElementById('copy-manifest-url-button');
    if (copyButton) copyButton.addEventListener('click', function () {
      var label = copyButton.querySelector('.demo-copy-label');
      copyText(document.getElementById('manifest-url-display').textContent, function () {
        if (label) label.textContent = 'Copied!';
        setTimeout(function () { if (label) label.textContent = 'Copy URL'; }, 1600);
      });
    });
    loadRegistry(render);
  });
})();
