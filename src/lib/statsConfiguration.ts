import * as echarts from 'echarts'

// A year distribution: array of [year, count]
export type YearDist = Array<[number, number]>
// Average by category: each entry is { category, avg }
export type AvgByCategory = Array<{ category: string; avg: number }>

// Build a bar chart config for counts per year
export function makeYearOption(params: { yearDist: YearDist; isDark: boolean }): echarts.EChartsOption {
  const { yearDist, isDark } = params

  // Theme-aware colors and styles
  const textColor = isDark ? '#e5e7eb' : '#111827'
  const axisLine = { lineStyle: { color: isDark ? '#374151' : '#d1d5db' } }
  const splitLine = { lineStyle: { color: isDark ? '#1f2937' : '#f3f4f6' } }
  const grid = { left: 48, right: 24, top: 24, bottom: 56, containLabel: true }
  const palette = isDark
    ? ['#60a5fa', '#34d399', '#f472b6', '#fbbf24']
    : ['#2563eb', '#059669', '#db2777', '#f59e0b']

  return {
    backgroundColor: 'transparent',
    color: palette,
    textStyle: { color: textColor },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#111827' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: textColor },
      axisPointer: { type: 'shadow' }, // show shadow on hover
      valueFormatter: (v: any) => (v == null ? '' : v.toLocaleString()), // add commas
    },
    toolbox: { feature: { saveAsImage: {} } }, // allow saving chart as image
    dataZoom: [{ type: 'inside' }, { type: 'slider', bottom: 8 }], // zoom controls
    grid,
    xAxis: {
      type: 'category',
      data: yearDist.map(x => String(x[0])), // years
      axisLine,
      axisLabel: { color: textColor },
    },
    yAxis: {
      type: 'value',
      axisLine,
      splitLine,
      axisLabel: { color: textColor },
    },
    series: [{
      name: 'Count',
      type: 'bar',
      data: yearDist.map(x => x[1]), // counts per year
      barMaxWidth: 28,
      itemStyle: {
        borderRadius: [6, 6, 0, 0], // rounded top corners
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: palette[0] },
          { offset: 1, color: isDark ? '#0b1220' : '#e6efff' },
        ]),
      },
      emphasis: { focus: 'series' }, // highlight on hover
      markLine: { data: [{ type: 'average', name: 'avg' }], label: { color: textColor } }, // average line
    }],
    legend: { bottom: 28, textStyle: { color: textColor } },
  }
}

// Build a line chart config for average ratings by category
export function makeAvgOption(params: { avgByCategory: AvgByCategory; isDark: boolean }): echarts.EChartsOption {
  const { avgByCategory, isDark } = params

  // Theme-aware styling
  const textColor = isDark ? '#e5e7eb' : '#111827'
  const axisLine = { lineStyle: { color: isDark ? '#374151' : '#d1d5db' } }
  const splitLine = { lineStyle: { color: isDark ? '#1f2937' : '#f3f4f6' } }
  const grid = { left: 48, right: 24, top: 24, bottom: 56, containLabel: true }
  const palette = isDark
    ? ['#60a5fa', '#34d399', '#f472b6', '#fbbf24']
    : ['#2563eb', '#059669', '#db2777', '#f59e0b']

  return {
    backgroundColor: 'transparent',
    color: palette,
    textStyle: { color: textColor },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#111827' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: textColor },
      valueFormatter: (v: any) => (v == null ? '' : Number(v).toFixed(2)), // 2 decimal places
    },
    toolbox: { feature: { saveAsImage: {} } },
    grid,
    xAxis: {
      type: 'category',
      data: avgByCategory.map(x => x.category), // categories
      axisLine,
      axisLabel: { color: textColor },
    },
    yAxis: {
      type: 'value',
      axisLine,
      splitLine,
      axisLabel: { color: textColor },
    },
    series: [{
      name: 'Average rating',
      type: 'line',
      smooth: true, // smooth curve
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 3 },
      areaStyle: {
        opacity: 0.2,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: palette[1] },
          { offset: 1, color: 'transparent' },
        ]),
      },
      data: avgByCategory.map(x => x.avg),
      emphasis: { focus: 'series' },
      markLine: { data: [{ type: 'average', name: 'avg' }], label: { color: textColor } },
    }],
    legend: { bottom: 28, textStyle: { color: textColor } },
  }
}
