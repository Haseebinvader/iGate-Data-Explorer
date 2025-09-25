// Export data as JSON file
export function exportJSON<T>(data: T[], filename = 'export.json') {
  // 1. Convert data to JSON string with 2-space indentation
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })

  // 2. Create a temporary object URL for the blob
  const url = URL.createObjectURL(blob)

  // 3. Create an invisible <a> element to trigger download
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click() // Simulate a click → download starts

  // 4. Release the object URL to free memory
  URL.revokeObjectURL(url)
}

// Export data as CSV file
export function exportCSV<T extends Record<string, unknown>>(rows: T[], filename = 'export.csv') {
  // Fallback: if no rows, export empty JSON instead
  if (!rows.length) {
    exportJSON(rows as T[], filename.replace(/\.csv$/, '') + '.json')
    return
  }

  // 1. Extract headers from the keys of the first row
  const headers = Object.keys(rows[0])

  // 2. Escape values for CSV formatting
  const esc = (val: unknown) => {
    if (val === null || val === undefined) return ''
    const s = String(val)
    // If value contains quotes, commas, or newlines → wrap in quotes & escape quotes
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }

  // 3. Build CSV rows
  const lines = [headers.join(',')] // header row
  for (const row of rows) {
    lines.push(headers.map(h => esc(row[h])).join(',')) // each data row
  }

  // 4. Create a CSV blob
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })

  // 5. Create object URL and trigger download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()

  // 6. Clean up
  URL.revokeObjectURL(url)
}
