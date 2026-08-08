(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();   // 朱砂 #9A2A1E
  var accent2 = style.getPropertyValue('--accent2').trim();  // 墨青 #2E5C5A
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  var cjkFont = "'PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif";

  // ---------- Mermaid init ----------
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      themeVariables: {
        fontFamily: cjkFont,
        fontSize: '15px',
        lineColor: accent,
        primaryColor: bg2,
        primaryTextColor: ink,
        primaryBorderColor: accent,
        secondaryColor: 'rgba(154,42,30,0.06)',
        tertiaryColor: bg2
      },
      flowchart: { curve: 'basis', padding: 14 }
    });
  }

  if (!window.echarts) return;

  // ---------- Chart 1: Dopamine baseline ----------
  var el1 = document.getElementById('chart-dopamine');
  if (el1) {
    var c1 = echarts.init(el1, null, { renderer: 'svg' });
    var weeksDecline = ['0','1','2','3','4','5','6'];
    var weeksRecover = ['6','7','8','9','10','11','12'];
    c1.setOption({
      textStyle: { fontFamily: cjkFont, color: ink },
      grid: { left: 52, right: 24, top: 38, bottom: 44, containLabel: true },
      tooltip: { trigger: 'axis', appendToBody: true,
        formatter: function (p) {
          var s = '第 ' + p[0].axisValue + ' 周<br/>';
          p.forEach(function (it) { s += it.marker + it.seriesName + '：' + it.value + '<br/>'; });
          return s;
        } },
      legend: { data: ['反复刺激期 · 基线下行', '戒断重置期 · 基线回升'], top: 4, textStyle: { color: muted, fontSize: 12 }, itemWidth: 14, itemHeight: 8 },
      xAxis: { type: 'category', data: ['0','1','2','3','4','5','6','7','8','9','10','11','12'],
        name: '时间（周）', nameLocation: 'middle', nameGap: 28, nameTextStyle: { color: muted, fontSize: 12 },
        axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, fontSize: 11 } },
      yAxis: { type: 'value', min: 0, max: 100, name: '日常快乐基线', nameTextStyle: { color: muted, fontSize: 12 },
        axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: rule, type: 'dashed' } }, axisLabel: { color: muted, fontSize: 11 } },
      series: [
        {
          name: '反复刺激期 · 基线下行', type: 'line', smooth: true, symbol: 'circle', symbolSize: 7,
          data: [85, 78, 70, 62, 53, 46, 40, null, null, null, null, null, null],
          lineStyle: { color: accent, width: 3 }, itemStyle: { color: accent },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
            { offset: 0, color: 'rgba(154,42,30,0.25)' }, { offset: 1, color: 'rgba(154,42,30,0.02)' } ] } },
          markArea: { silent: true, itemStyle: { color: 'rgba(154,42,30,0.05)' },
            data: [[{ xAxis: '0' }, { xAxis: '6' }]] }
        },
        {
          name: '戒断重置期 · 基线回升', type: 'line', smooth: true, symbol: 'circle', symbolSize: 7,
          data: [null, null, null, null, null, null, 40, 46, 53, 60, 66, 71, 75],
          lineStyle: { color: accent2, width: 3 }, itemStyle: { color: accent2 },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
            { offset: 0, color: 'rgba(46,92,90,0.22)' }, { offset: 1, color: 'rgba(46,92,90,0.02)' } ] } },
          markLine: { silent: true, symbol: 'none', label: { formatter: '开始戒断', color: accent, fontSize: 11, position: 'start' },
            lineStyle: { color: accent, type: 'dashed', width: 1.5 }, data: [{ xAxis: '6' }] }
        }
      ]
    });
    window.addEventListener('resize', function () { c1.resize(); });
  }

  // ---------- Chart 2: Energy allocation ----------
  var el2 = document.getElementById('chart-energy');
  if (el2) {
    var c2 = echarts.init(el2, null, { renderer: 'svg' });
    c2.setOption({
      textStyle: { fontFamily: cjkFont, color: ink },
      grid: { left: 12, right: 24, top: 44, bottom: 8, containLabel: true },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, appendToBody: true,
        formatter: function (p) {
          var s = p[0].name + '<br/>';
          p.forEach(function (it) { s += it.marker + it.seriesName + '：' + it.value + '%<br/>'; });
          return s;
        } },
      legend: { data: ['沉沦态（精力被偷走）', '重铸态（精力被导向）'], top: 4, textStyle: { color: muted, fontSize: 12 }, itemWidth: 14, itemHeight: 8 },
      xAxis: { type: 'value', max: 50, axisLine: { show: false }, axisTick: { show: false },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }, axisLabel: { color: muted, fontSize: 11, formatter: '{value}%' } },
      yAxis: { type: 'category', data: ['其他生活', '社交关系', '健康(运动/睡眠)', '技能投入', '即时刺激/反刍'],
        axisLine: { lineStyle: { color: rule } }, axisTick: { show: false }, axisLabel: { color: ink, fontSize: 12.5 } },
      series: [
        {
          name: '沉沦态（精力被偷走）', type: 'bar', barWidth: 18,
          data: [33, 5, 12, 8, 42], itemStyle: { color: accent, borderRadius: [0, 3, 3, 0] },
          label: { show: true, position: 'right', formatter: '{c}%', color: muted, fontSize: 11 }
        },
        {
          name: '重铸态（精力被导向）', type: 'bar', barWidth: 18,
          data: [17, 20, 25, 33, 5], itemStyle: { color: accent2, borderRadius: [0, 3, 3, 0] },
          label: { show: true, position: 'right', formatter: '{c}%', color: muted, fontSize: 11 }
        }
      ]
    });
    window.addEventListener('resize', function () { c2.resize(); });
  }

  // ---------- Chart 3: Compound skill hours (Day 7) ----------
  var el3 = document.getElementById('chart-compound');
  if (el3) {
    var c3 = echarts.init(el3, null, { renderer: 'svg' });
    // 每日2小时 = 每月约60小时，48个月累计2920小时
    var months = [];
    var cumulative = [];
    var hours = 0;
    for (var m = 0; m <= 48; m++) {
      months.push(m + '月');
      cumulative.push(Math.round(hours));
      hours += 60; // ~2h/day * 30
    }
    c3.setOption({
      textStyle: { fontFamily: cjkFont, color: ink },
      grid: { left: 56, right: 30, top: 42, bottom: 50, containLabel: true },
      tooltip: { trigger: 'axis', appendToBody: true,
        formatter: function (p) {
          var v = p[0].value;
          var mo = p[0].dataIndex;
          var yr = (mo / 12).toFixed(1);
          return '第 ' + mo + ' 个月（约 ' + yr + ' 年）<br/>' + p[0].marker + '累计技能投入：' + v + ' 小时';
        } },
      xAxis: {
        type: 'category', data: months,
        name: '时间（月）', nameLocation: 'middle', nameGap: 32, nameTextStyle: { color: muted, fontSize: 12 },
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, fontSize: 10.5, interval: 5 },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value', name: '累计投入小时', nameTextStyle: { color: muted, fontSize: 12 },
        axisLine: { show: false }, axisTick: { show: false },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } },
        axisLabel: { color: muted, fontSize: 11, formatter: '{value}h' }
      },
      series: [
        {
          name: '累计技能投入', type: 'line', smooth: true, symbol: 'none',
          data: cumulative,
          lineStyle: { color: accent2, width: 3.5 },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
            { offset: 0, color: 'rgba(46,92,90,0.28)' }, { offset: 1, color: 'rgba(46,92,90,0.02)' } ] } },
          markPoint: {
            symbol: 'pin', symbolSize: 46,
            itemStyle: { color: accent },
            label: { color: '#fff', fontSize: 11, fontWeight: 700 },
            data: [
              { name: '26岁起点', coord: ['0月', 0], value: '起点' },
              { name: '30岁·约2920h', coord: ['48月', 2920], value: '30岁' }
            ]
          },
          markLine: {
            silent: true, symbol: 'none',
            label: { color: accent, fontSize: 11, position: 'insideEndTop', formatter: '准专家水平 ~1000h' },
            lineStyle: { color: accent, type: 'dashed', width: 1.5 },
            data: [{ yAxis: 1000 }]
          },
          markArea: {
            silent: true,
            itemStyle: { color: 'rgba(154,42,30,0.04)' },
            data: [[{ xAxis: '0月' }, { xAxis: '12月' }]]
          }
        }
      ]
    });
    window.addEventListener('resize', function () { c3.resize(); });
  }
})();
