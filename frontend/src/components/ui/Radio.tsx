interface RadioOption {
  value: string
  label: string
}

interface RadioProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: string
}

export function Radio({ name, options, value, onChange, disabled, error }: RadioProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-4 h-4 ${error ? 'ring-red-300' : 'ring-primary-300'}`}
          />
          <span className={`text-sm ${error ? 'text-red-600' : 'text-gray-700'}`}>
            {option.label}
          </span>
        </label>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
