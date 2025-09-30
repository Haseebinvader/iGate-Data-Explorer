import { toast } from 'react-hot-toast';

// exportJSON
export function exportJSON<T>(data: T[], filename = 'export.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  // Show success toast after download
  toast.success(`${filename} successfully downloaded as JSON!`, {
    position: "bottom-right",
    duration: 3000,
    style: {
      background: '#4caf50',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '8px',
      padding: '12px',
    },
  });

  URL.revokeObjectURL(url);
}

// exportCSV
export function exportCSV<T extends Record<string, unknown>>(rows: T[], filename = 'export.csv') {
  if (!rows.length) {
    exportJSON(rows as T[], filename.replace(/\.csv$/, '') + '.json');
    return;
  }

  const headers = Object.keys(rows[0]);
  const esc = (val: unknown) => {
    if (val === null || val === undefined) return '';
    const s = String(val);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map(h => esc(row[h])).join(','));
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
    // Show success toast after download
  toast.success(`${filename} successfully downloaded as CSV!`, {
    position: "bottom-right", // Position of the toast
    duration: 3000, // Automatically close after 3 seconds
    style: {
      background: '#4caf50',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '8px',
      padding: '12px',
    },
  });
  URL.revokeObjectURL(url);
}
