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
    var select = document.getElementById('theme-preset');
    var container = document.querySelector('[data-k-theme-preset]');
    if (!select) return;
    var root = document.documentElement;
    var presets = ['default', 'ocean', 'forest', 'sunset', 'dark'];
    var theme = localStorage.getItem('kaui-theme') || 'default';

    function syncDropdown(value) {
      if (!container) return;
      var item = container.querySelector('.k-dropdown__item[data-value="' + value + '"]');
      var display = container.querySelector('.k-dropdown__value');
      if (display && item) display.textContent = item.textContent.trim();
      container.querySelectorAll('.k-dropdown__item').forEach(function (option) {
        var active = option === item;
        option.classList.toggle('is-selected', active);
        option.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    function apply(value) {
      var selected = presets.indexOf(value) >= 0 ? value : 'default';
      if (selected === 'default') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', selected);
      select.value = selected;
      syncDropdown(selected);
    }

    apply(theme);
    select.addEventListener('change', function () {
      apply(select.value);
      localStorage.setItem('kaui-theme', select.value);
    });
    if (container) {
      container.addEventListener('change', function () {
        apply(select.value);
        localStorage.setItem('kaui-theme', select.value);
      });
    }
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
      var href = typeof entry === 'string' ? 'https://kaui.filekat.com/dist/versions/' + encodeURIComponent(version) + '/' + encodeURIComponent(file) : entry.url;
      return '<a class="demo-version-tree__file" href="' + href + '" target="_blank" rel="noopener noreferrer"><i data-kaui-icon="file-code-2" aria-hidden="true"></i><span>' + file + '</span></a>';
    }).join('');
  }

  function fallbackRegistry() {
    return {
      latest: '1.1.1',
      versions: {
        '1.1.1': {
          version: '1.1.1',
          builtAt: 'Build archive available locally',
          files: ['kaui.css', 'kaui.css.map', 'kaui.min.css', 'kaui.min.css.map', 'kaui-chart.css', 'kaui-chart.js', 'kaui-chart.min.css', 'kaui-chart.min.js', 'kaui-agent-manifest.json', 'metadata.json']
        }
      }
    };
  }

  function loadRegistry(callback) {
    var urls = ['../dist/versions/index.json', 'https://kaui.filekat.com/dist/versions/index.json'];
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
    if (url) url.textContent = 'https://kaui.filekat.com/dist/versions/' + latest + '/kaui-agent-manifest.json';
    var container = document.getElementById('versions-container');
    container.classList.add('demo-version-tree');
    var versions = Object.keys(data.versions || {}).sort(function (a, b) { return b.localeCompare(a, undefined, { numeric: true }); });


    container.innerHTML = versions.map(function (version) {
      var item = data.versions[version];
      var isLatest = version === latest;
      var files = item.files || [];
      var built = formatBuildTime(item.builtAt);
      var install = '<div class="k-card k-card--bordered k-p-4 k-mt-4"><h3 class="demo-subheading k-mt-0">Install this version</h3><div class="k-grid k-gap-4"><div class="k-col-12 k-col-md-6"><p class="k-text-muted k-fs-sm k-mb-2">Web / React / Next.js — npm</p><pre class="demo-code"><code>npm install filekat@' + version + '\n\nimport \'filekat/kaui\';</code></pre><a class="k-btn k-btn--sm k-btn--outline-primary" href="https://www.npmjs.com/package/filekat/v/' + version + '" target="_blank" rel="noopener noreferrer">View npm version</a></div><div class="k-col-12 k-col-md-6"><p class="k-text-muted k-fs-sm k-mb-2">Flutter — pub.dev</p><pre class="demo-code"><code>flutter pub add filekat@' + version + '\n\nimport \'package:filekat/kaui.dart\';</code></pre><a class="k-btn k-btn--sm k-btn--outline-primary" href="https://pub.dev/packages/filekat/versions/' + version + '" target="_blank" rel="noopener noreferrer">View pub version</a></div></div><p class="k-text-muted k-fs-xs k-mt-3 k-mb-0">KAUI 1.1.0+ is Personal / Non-Commercial. Commercial use requires written permission: contact@filekat.com.</p></div>';
      return '<div class="k-accordion__item' + (isLatest ? ' is-open' : '') + '"><button type="button" class="k-accordion__trigger" aria-expanded="' + (isLatest ? 'true' : 'false') + '"><span class="k-flex k-items-center k-gap-2"><i data-kaui-icon="folder" aria-hidden="true"></i><span class="demo-version-tree__version">v' + version + '</span>' + (isLatest ? '<span class="k-badge k-badge--success k-badge--pill">Latest</span>' : '') + '</span><span class="demo-version-tree__meta">Built ' + built + '</span></button><div class="k-accordion__body"><div class="demo-version-tree__children">' + fileLinks(version, files) + '<a class="demo-version-tree__file" href="https://kaui.filekat.com/dist/versions/' + version + '/metadata.json" target="_blank" rel="noopener noreferrer"><i data-kaui-icon="clipboard-list" aria-hidden="true"></i><span>metadata.json</span></a></div>' + install + '</div></div>';
    }).join('');
    container.querySelectorAll('.k-accordion__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.k-accordion__item');
        if (!item) return;
        var open = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(open));
      });
    });
    if (window.renderKauiIcons) window.renderKauiIcons();
  }


  document.addEventListener('DOMContentLoaded', function () {
    if (window.renderKauiIcons) window.renderKauiIcons();
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
