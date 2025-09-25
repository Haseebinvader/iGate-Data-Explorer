export function FilterChips({ chips, onClear }: { chips: string[]; onClear: (chip: string) => void }) {
    if (!chips.length) return null
    return (
      <div className="flex flex-wrap gap-2 items-center text-sm">
        {chips.map(ch => (
          <button key={ch} className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700" onClick={() => onClear(ch)}>
            {ch} ×
          </button>
        ))}
      </div>
    )
  }
  
  