import * as echarts from 'echarts'

// ---------------------------------------------
// Type Definitions
// ---------------------------------------------

// YearDist: array of tuples [year, count]
export type YearDist = Array<[number, number]>

// AvgByCategory: array of objects { category, avg }
export type AvgByCategory = Array<{ category: string; avg: number }>

// ---------------------------------------------
// makeYearOption
// ---------------------------------------------
// Builds a bar chart configuration showing counts per year.
// Accepts yearDist data + dark mode flag, returns an ECharts option.
export function makeYearOption(params: { yearDist: YearDist; isDark: boolean }): echarts.EChartsOption {
  const { yearDist, isDark } = params

  // Theme-aware colors and styles
  const textColor = isDark ? '#e5e7eb' : '#111827' // text color changes with theme
  const axisLine = { lineStyle: { color: isDark ? '#374151' : '#d1d5db' } } // axis line color
  const splitLine = { lineStyle: { color: isDark ? '#1f2937' : '#f3f4f6' } } // gridline color
  const grid = { left: 48, right: 24, top: 24, bottom: 56, containLabel: true } // chart margins
  const palette = isDark
    ? ['#60a5fa', '#34d399', '#f472b6', '#fbbf24'] // dark mode palette
    : ['#2563eb', '#059669', '#db2777', '#f59e0b'] // light mode palette

  return {
    backgroundColor: 'transparent',
    color: palette,
    textStyle: { color: textColor },

    // Tooltip config
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#111827' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: textColor },
      axisPointer: { type: 'shadow' }, // highlights bar under cursor
      valueFormatter: (v: any) => (v == null ? '' : v.toLocaleString()), // format numbers with commas
    },

    // Chart tools (save as image)
    toolbox: { feature: { saveAsImage: {} } },

    // Enable zoom/pan (inside = mousewheel, slider = draggable control)
    dataZoom: [{ type: 'inside' }, { type: 'slider', bottom: 8 }],

    grid,

    // X axis = years
    xAxis: {
      type: 'category',
      data: yearDist.map(x => String(x[0])), // convert years to strings
      axisLine,
      axisLabel: { color: textColor },
    },

    // Y axis = counts
    yAxis: {
      type: 'value',
      axisLine,
      splitLine,
      axisLabel: { color: textColor },
    },

    // Bar series
    series: [{
      name: 'Count',
      type: 'bar',
      data: yearDist.map(x => x[1]), // counts per year
      barMaxWidth: 28, // limit bar width
      itemStyle: {
        borderRadius: [6, 6, 0, 0], // rounded top corners
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: palette[0] },
          { offset: 1, color: isDark ? '#0b1220' : '#e6efff' },
        ]),
      },
      emphasis: { focus: 'series' }, // highlight all bars on hover
      markLine: {
        data: [{ type: 'average', name: 'avg' }], // horizontal line at average
        label: { color: textColor },
      },
    }],

    // Legend
    legend: { bottom: 28, textStyle: { color: textColor } },
  }
}

// ---------------------------------------------
// makeAvgOption
// ---------------------------------------------
// Builds a line chart configuration showing average ratings by category.
// Accepts avgByCategory data + dark mode flag, returns an ECharts option.
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

    // Tooltip config
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#111827' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: textColor },
      valueFormatter: (v: any) => (v == null ? '' : Number(v).toFixed(2)), // 2 decimals
    },

    // Chart tools
    toolbox: { feature: { saveAsImage: {} } },

    grid,

    // X axis = categories
    xAxis: {
      type: 'category',
      data: avgByCategory.map(x => x.category),
      axisLine,
      axisLabel: { color: textColor },
    },

    // Y axis = average ratings
    yAxis: {
      type: 'value',
      axisLine,
      splitLine,
      axisLabel: { color: textColor },
    },

    // Line series
    series: [{
      name: 'Average rating',
      type: 'line',
      smooth: true, // smooth line instead of sharp angles
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
      markLine: {
        data: [{ type: 'average', name: 'avg' }], // horizontal average line
        label: { color: textColor },
      },
    }],

    // Legend
    legend: { bottom: 28, textStyle: { color: textColor } },
  }
}
