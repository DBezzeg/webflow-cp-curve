// ─── DATA ────────────────────────────────────────────────────────────────
var cpCurveDataWeight = [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,73,73,73,73,73,73,73,73,73,73,73,73,73,73,73,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,29,29,29,29,29,29,29,29,29,29,29,29,29,29,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5];

var cpCurveDataActual = [400,399,397,396,395,394,394,393,392,391,389,388,387,385,384,383,381,380,379,377,376,374,374,373,372,372,371,370,369,369,368,367,366,366,365,364,363,363,362,362,361,361,360,360,359,359,358,358,357,357,356,355,355,355,355,354,354,354,353,353,353,352,352,352,351,351,350,350,350,350,349,349,349,348,348,348,347,347,347,346,346,345,345,345,345,345,344,344,344,344,344,343,343,343,343,343,342,342,342,342,342,342,342,342,341,341,341,341,341,341,341,340,340,340,340,340,340,340,340,339,339,339,339,339,339,339,338,338,338,338,338,338,338,338,337,337,337,337,337,337,337,336,336,336,336,336,336,336,336,336,336,336,336,336,336,336,335,335,335,335,335,335,335,335,334,334,334,334,334,334,333,333,333,333,333,333,333,333,333,333,333,333,333,333,333,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,330,330,330,330,330,330,330,330,330,330,330,330,330,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328];

// ─── CHART FUNCTION ───────────────────────────────────────────────────────────

function createCPCurve(containerId, width, height) {
  var container = document.getElementById(containerId);
  if (!container) { console.error('CP Curve: element #' + containerId + ' not found.'); return; }

  var isMobile = width < 480;
  var isSmall  = width < 640;

  var margin = {
    top:    10,
    right:  isMobile ? 10 : 40,
    bottom: isMobile ? 18 : 28,
    left:   isMobile ? 35 : 56
  };
  var innerWidth  = width  - margin.left - margin.right;
  var innerHeight = height - margin.top  - margin.bottom;

  var svg = d3.select(container);
  svg.selectAll('*').remove();
  svg.attr('viewBox', '0 0 ' + width + ' ' + height);

  function smooth(values, windowSize) {
    windowSize = windowSize || 5;
    var k = Math.floor(windowSize / 2);
    return values.map(function (v, i) {
      var slice = values.slice(Math.max(0, i - k), Math.min(values.length, i + k + 1));
      return slice.reduce(function (a, b) { return a + b; }, 0) / slice.length;
    });
  }

  var smoothedValues = smooth(cpCurveDataActual, 7);

  var data = smoothedValues.map(function (d, i) {
    return { time: i * (20 / smoothedValues.length), value: d };
  });

  var colorScale = d3.scaleLinear()
    .domain([5, 25, 50, 75, 100])
    .range(['#F89B29', '#FF0F7B', '#E81CFF', '#8711C1', '#2472FC'])
    .clamp(true);

  var defs = svg.append('defs');

  var gradient = defs.append('linearGradient')
    .attr('id', 'weightGradient')
    .attr('x1', '0%').attr('y1', '0%')
    .attr('x2', '100%').attr('y2', '0%');

  var n = cpCurveDataWeight.length;
  cpCurveDataWeight.forEach(function (w, i) {
    if (w === 0xff) return;
    gradient.append('stop')
      .attr('offset', (i / (n - 1)) * 100 + '%')
      .attr('stop-color', colorScale(w));
  });

  defs.append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight);

  var xScale = d3.scaleLinear().domain([0, 20]).range([0, innerWidth]);

  var minVal = d3.min(cpCurveDataActual);
  var maxVal = d3.max(cpCurveDataActual);
  var yScale = d3.scaleLinear()
    .domain([Math.floor(minVal / 10) * 10, Math.ceil(maxVal / 20) * 20])
    .range([innerHeight, 0]);

  var line = d3.line()
    .x(function (d) { return xScale(d.time);  })
    .y(function (d) { return yScale(d.value); })
    .curve(d3.curveBasis);

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var isDark      = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var gridColor   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  var axisColor   = isDark ? 'rgba(255,255,255,0.5)'  : 'rgba(0,0,0,0.5)';
  var tickFontSz  = isMobile ? '10px' : '12px';
  var xTickCount  = isMobile ? 5 : isSmall ? 10 : 20;
  var strokeWidth = isMobile ? 4 : isSmall ? 5 : 7;

  g.append('g')
    .attr('transform', 'translate(0,' + innerHeight + ')')
    .call(d3.axisBottom(xScale).ticks(10).tickSize(-innerHeight).tickFormat(function () { return ''; }))
    .call(function (ax) { ax.select('.domain').remove(); ax.selectAll('line').attr('stroke', gridColor); });

  g.append('g')
    .call(d3.axisLeft(yScale).ticks(6).tickSize(-innerWidth).tickFormat(function () { return ''; }))
    .call(function (ax) { ax.select('.domain').remove(); ax.selectAll('line').attr('stroke', gridColor); });

  g.append('g')
    .attr('transform', 'translate(0,' + innerHeight + ')')
    .call(d3.axisBottom(xScale).ticks(xTickCount).tickFormat(function (d) { return d + 'm'; }))
    .call(function (ax) {
      ax.select('.domain').attr('stroke', gridColor);
      ax.selectAll('line').attr('stroke', gridColor);
      ax.selectAll('text').style('font-size', tickFontSz).style('fill', axisColor);
    });

  g.append('g')
    .call(d3.axisLeft(yScale).ticks(6).tickFormat(function (d) { return d + 'W'; }))
    .call(function (ax) {
      ax.select('.domain').attr('stroke', gridColor);
      ax.selectAll('line').attr('stroke', gridColor);
      ax.selectAll('text').style('font-size', tickFontSz).style('fill', axisColor);
    });

  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'url(#weightGradient)')
    .attr('stroke-width', strokeWidth)
    .attr('clip-path', 'url(#clip)')
    .attr('d', line);
}

// ─── INITIALISE ───────────────────────────────────────────────────────────────
(function init() {
  var el = document.getElementById('cp-curve');
  if (!el) return;

  function draw() {
    var w = el.clientWidth  || 600;
    var h = el.clientHeight || 280;
    createCPCurve('cp-curve', w, h);
  }

  draw();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 150);
  });

  var ro = new ResizeObserver(function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 100);
  });
  ro.observe(el);
})();
