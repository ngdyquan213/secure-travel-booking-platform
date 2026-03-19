interface TableProps {
  headers: string[]
  rows: Array<Record<string, any>>
  onRowClick?: (row: Record<string, any>) => void
  loading?: boolean
}

export function Table({ headers, rows, onRowClick, loading }: TableProps) {
  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (rows.length === 0) {
    return <div className="p-8 text-center text-gray-500">No data available</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left font-semibold text-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-gray-200 ${
                onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''
              }`}
            >
              {headers.map((header) => (
                <td key={`${index}-${header}`} className="px-4 py-3">
                  {row[header] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
