// ----------------------------------------------------
// exportJSON
// ----------------------------------------------------
// Exports an array of data as a JSON file.
// Creates a Blob → Object URL → triggers a hidden <a> click → downloads file.
export function exportJSON<T>(data: T[], filename = 'export.json') {
  // 1. Convert data to JSON string with pretty-print (2 spaces)
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })

  // 2. Create a temporary object URL pointing to the Blob
  const url = URL.createObjectURL(blob)

  // 3. Create a hidden <a> element to simulate a file download
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click() // Simulate a user click → download begins

  // 4. Clean up object URL to free memory
  URL.revokeObjectURL(url)
}

// ----------------------------------------------------
// exportCSV
// ----------------------------------------------------
// Exports an array of objects as a CSV file.
// Falls back to exporting JSON if rows are empty.
export function exportCSV<T extends Record<string, unknown>>(rows: T[], filename = 'export.csv') {
  // --------------------------------
  // Fallback: no data
  // --------------------------------
  // If dataset is empty, export an empty JSON file instead
  if (!rows.length) {
    exportJSON(rows as T[], filename.replace(/\.csv$/, '') + '.json')
    return
  }

  // --------------------------------
  // Step 1: Extract column headers
  // --------------------------------
  // Use keys of first row as header order
  const headers = Object.keys(rows[0])

  // --------------------------------
  // Step 2: Escape cell values
  // --------------------------------
  // Handles commas, quotes, and newlines for proper CSV formatting
  const esc = (val: unknown) => {
    if (val === null || val === undefined) return ''
    const s = String(val)
    // If contains special chars → wrap in quotes & escape quotes
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }

  // --------------------------------
  // Step 3: Build CSV rows
  // --------------------------------
  const lines = [headers.join(',')] // header row
  for (const row of rows) {
    lines.push(headers.map(h => esc(row[h])).join(',')) // each data row
  }

  // --------------------------------
  // Step 4: Create CSV Blob
  // --------------------------------
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })

  // --------------------------------
  // Step 5: Create object URL + trigger download
  // --------------------------------
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()

  // --------------------------------
  // Step 6: Clean up
  // --------------------------------
  URL.revokeObjectURL(url)
}
