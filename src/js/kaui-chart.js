/* KAUI Chart: dependency-free SVG renderer with realtime batching. */
(function (global) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var palette = ['var(--k-chart-1)','var(--k-chart-2)','var(--k-chart-3)','var(--k-chart-4)','var(--k-chart-5)'];
  function el(tag, attrs) { var n = document.createElementNS(NS, tag); for (var k in (attrs || {})) n.setAttribute(k, attrs[k]); return n; }
  function max(a) { return a.reduce(function (m, v) { return Math.max(m, Number(v) || 0); }, 0); }
  function vals(s) { return Array.prototype.map.call(s.data || [], function (v) { return Number(v) || 0; }); }
  function Chart(target, opts) {
    this.root = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this.root) throw new Error('KauiChart target not found'); opts = opts || {};
    this.type = opts.type || this.root.getAttribute('data-k-chart') || 'line';
    this.labels = (opts.labels || []).slice(); this.series = (opts.datasets || []).map(function (s, i) { return Object.assign({ id: 'series-' + i, data: [] }, s, { data: (s.data || []).slice() }); });
    this.maxPoints = opts.maxPoints || 0; this.window = opts.window || 0; this.maxPending = opts.maxPending || 1000; this.pending = []; this.frame = 0; this.paused = false; this.destroyed = false;
    this.root.classList.add('k-chart--' + this.type); this.root.setAttribute('role', 'img'); if (opts.label) this.root.setAttribute('aria-label', opts.label);
    var isDonut = this.type === 'donut';
    this.svg = el('svg', {
      class: 'k-chart__svg',
      viewBox: isDonut ? '0 0 300 300' : '0 0 800 300',
      preserveAspectRatio: isDonut ? 'xMidYMid meet' : 'none'
    });
    this.root.replaceChildren(this.svg);
    this.tip = document.createElement('div'); this.tip.className = 'k-chart__tooltip'; this.tip.hidden = true; this.root.appendChild(this.tip);
    this._move = this._move.bind(this); this._hide = this._hide.bind(this); this.root.addEventListener('pointermove', this._move); this.root.addEventListener('pointerleave', this._hide);
    this.ro = typeof ResizeObserver === 'function' ? new ResizeObserver(this._schedule.bind(this)) : null; if (this.ro) this.ro.observe(this.root);
    this._visibility = function () { if (document.hidden) this.pause(); else this.resume(); }.bind(this); if (opts.pauseWhenHidden !== false) document.addEventListener('visibilitychange', this._visibility); this.render();
  }
  Chart.prototype._schedule = function () { if (!this.frame && !this.destroyed) this.frame = requestAnimationFrame(this.flush.bind(this)); };
  Chart.prototype.flush = function () { this.frame = 0; if (this.pending.length) { var p = this.pending.splice(0); for (var i=0;i<p.length;i++) this._insert(p[i]); } if (!this.paused) this.render(); };
  Chart.prototype._insert = function (p) { var time = p.time == null ? p.label : p.time; if (time != null) this.labels.push(time); var valsIn = Array.isArray(p.values) ? p.values : this.series.map(function (s) { return p.values && p.values[s.id]; }); this.series.forEach(function (s, i) { s.data.push(Number(valsIn[i]) || 0); }); this._trim(); };
  Chart.prototype._trim = function () { var count = this.labels.length, cut = this.maxPoints ? Math.max(0, count - this.maxPoints) : 0; if (this.window && count) { var last = Number(this.labels[count - 1]); while (cut < count && last - Number(this.labels[cut]) > this.window) cut++; } if (cut) { this.labels.splice(0, cut); this.series.forEach(function (s) { s.data.splice(0, cut); }); } };
  Chart.prototype.push = function (p) { if (typeof p === 'number') p = { values: [p], time: Date.now() }; this.pending.push(p || {}); if (this.pending.length > this.maxPending) this.pending.splice(0, this.pending.length - this.maxPending); this._schedule(); return this; };
  Chart.prototype.pushBatch = function (a) { for (var i=0;i<(a || []).length;i++) this.push(a[i]); return this; };
  Chart.prototype.appendData = function (label, values) { return this.push({ label: label, values: values }); };
  Chart.prototype.addSeries = function (s) { if (!s || !s.id) throw new Error('Series id is required'); this.series.push(Object.assign({ data: [] }, s, { data: (s.data || []).slice() })); this._schedule(); return this; };
  Chart.prototype.updateSeries = function (id, patch) { var s = this.series.find(function (x) { return x.id === id; }); if (!s) return this; Object.assign(s, patch || {}); if (patch && patch.data) s.data = patch.data.slice(); this._schedule(); return this; };
  Chart.prototype.removeSeries = function (id) { this.series = this.series.filter(function (s) { return s.id !== id; }); this._schedule(); return this; };
  Chart.prototype.updatePoint = function (id, index, value) { var s = this.series.find(function (x) { return x.id === id; }); if (s && index >= 0) s.data[index] = Number(value) || 0; this._schedule(); return this; };
  Chart.prototype.removeData = function (index) { if (index < 0 || index >= this.labels.length) return this; this.labels.splice(index, 1); this.series.forEach(function (s) { s.data.splice(index, 1); }); this._schedule(); return this; };
  Chart.prototype.clear = function () { this.labels.length = 0; this.series.forEach(function (s) { s.data.length = 0; }); this.pending.length = 0; this._schedule(); return this; };
  Chart.prototype.pause = function () { this.paused = true; this.root.classList.add('is-paused'); return this; };
  Chart.prototype.resume = function () { this.paused = false; this.root.classList.remove('is-paused'); this._schedule(); return this; };
  Chart.prototype._scaffold = function (w, h, pad) {
    var g = el('g'), plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;
    g.appendChild(el('rect', { class: 'k-chart__plot-bg', x: 0, y: 0, width: w, height: h }));
    for (var i = 0; i <= 4; i++) {
      var y = pad.t + (plotH * i / 4);
      g.appendChild(el('line', { class: 'k-chart__grid-line', x1: pad.l, x2: w - pad.r, y1: y, y2: y }));
      var label = el('text', { class: 'k-chart__axis-label', x: w - pad.r + 8, y: y + 4 }); label.textContent = String(Math.round((4 - i) * 25)); g.appendChild(label);
    }
    for (var j = 0; j <= 6; j++) { var x = pad.l + plotW * j / 6; g.appendChild(el('line', { class: 'k-chart__grid-line', x1: x, x2: x, y1: pad.t, y2: h - pad.b })); }
    return g;
  };
  Chart.prototype._line = function (w, h, pad) {
    var g = el('g'), n = this.labels.length, plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;
    var scale = Math.max(1, max(this.series.reduce(function (a, s) { return a.concat(vals(s)); }, [])));
    this.series.forEach(function (s, si) {
      var points = vals(s).map(function (v, i) { var x = n < 2 ? pad.l + plotW / 2 : pad.l + (i * plotW) / (n - 1), y = pad.t + plotH - (v / scale) * plotH; return [x, y]; });
      var d = points.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2); }).join(' ');
      var color = s.color || palette[si % palette.length];
      g.appendChild(el('path', { class: 'k-chart__line', d: d, stroke: color }));
      if (this.labels.length < 40) points.forEach(function (p) { g.appendChild(el('circle', { class: 'k-chart__point', cx: p[0], cy: p[1], r: 3.2, fill: color })); });
    }, this);
    return g;
  };
  Chart.prototype._bar = function (w, h, pad) {
    pad = pad || { l: 14, r: 62, t: 16, b: 26 };
    var g = el('g'), n = this.labels.length, count = Math.max(1, this.series.length);
    var plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;
    var scale = Math.max(1, max(this.series.reduce(function (a, s) { return a.concat(vals(s)); }, [])));
    this.series.forEach(function (s, si) {
      vals(s).forEach(function (v, i) {
        var groupW = plotW / Math.max(1, n), bw = (groupW / count) * 0.72;
        var x = pad.l + i * groupW + si * bw + groupW * 0.1, y = pad.t + plotH - (v / scale) * plotH;
        g.appendChild(el('rect', { x: x.toFixed(2), y: y.toFixed(2), width: Math.max(2, bw).toFixed(2), height: Math.max(1, pad.t + plotH - y).toFixed(2), fill: s.color || palette[si % palette.length], rx: '2' }));
      });
    });
    return g;
  };
  Chart.prototype._donut = function (w, h) {
    var g = el('g'), data = this.series[0] ? vals(this.series[0]) : [], total = data.reduce(function (a, v) { return a + Math.max(0, v); }, 0) || 1;
    var r = Math.min(w, h) * 0.32, cx = w / 2, cy = h / 2, angle = -Math.PI / 2;
    data.forEach(function (v, i) {
      var slice = (Math.max(0, v) / total) * Math.PI * 2, end = angle + slice, large = slice > Math.PI ? 1 : 0;
      var x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle), x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
      g.appendChild(el('path', { d: 'M ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A ' + r.toFixed(2) + ' ' + r.toFixed(2) + ' 0 ' + large + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2), fill: 'none', stroke: palette[i % palette.length], 'stroke-width': (r * 0.5).toFixed(2) }));
      angle = end;
    });
    return g;
  };
  Chart.prototype.render = function () {
    while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
    var empty = this.root.querySelector('.k-chart__empty');
    if (!this.labels.length && this.type !== 'donut') {
      if (!empty) { empty = document.createElement('div'); empty.className = 'k-chart__empty'; empty.textContent = 'No data available'; this.root.insertBefore(empty, this.svg); }
      this.svg.hidden = true; return;
    }
    if (empty) empty.remove(); this.svg.hidden = false;
    var pad = { l: 14, r: 62, t: 16, b: 26 };
    var g = this.type === 'donut' ? this._donut(300, 300) : this._scaffold(800, 300, pad);
    if (this.type === 'bar') g.appendChild(this._bar(800, 300, pad));
    else if (this.type !== 'donut') g.appendChild(this._line(800, 300, pad));
    this.svg.appendChild(g);
  };
  Chart.prototype._move = function (e) {
    if (!this.labels.length) return;
    var r = this.root.getBoundingClientRect(), i = Math.max(0, Math.min(this.labels.length - 1, Math.round(((e.clientX - r.left) / r.width) * (this.labels.length - 1))));
    var old = this.svg.querySelector('.k-chart__crosshair'); if (old) old.remove();
    var x = 14 + (this.labels.length < 2 ? 0 : (i / (this.labels.length - 1)) * (800 - 14 - 62));
    this.svg.appendChild(el('line', { class: 'k-chart__crosshair', x1: x, x2: x, y1: 16, y2: 274 }));
    var lines = [String(this.labels[i])];

    this.series.forEach(function (s) { if (s.data && s.data[i] != null) lines.push((s.label || s.id) + ': ' + s.data[i]); });
    this.tip.textContent = lines.join('\n'); this.tip.hidden = false;
    this.tip.style.left = Math.min(r.width - 120, Math.max(0, e.clientX - r.left + 10)) + 'px';
    this.tip.style.top = Math.max(0, e.clientY - r.top - 40) + 'px';
  };
  Chart.prototype._hide = function () { this.tip.hidden = true; var old = this.svg.querySelector('.k-chart__crosshair'); if (old) old.remove(); };
  Chart.prototype.destroy = function () {
    this.destroyed = true; if (this.frame) cancelAnimationFrame(this.frame); if (this.ro) this.ro.disconnect();
    document.removeEventListener('visibilitychange', this._visibility); this.root.replaceChildren();
  };
  function create(target, opts) { return new Chart(target, opts); }
  global.KauiChart = { create: create, mount: create };
})(typeof window !== 'undefined' ? window : globalThis);


