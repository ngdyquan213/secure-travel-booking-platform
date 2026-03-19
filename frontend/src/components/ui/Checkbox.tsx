import { Check } from 'lucide-react'

interface CheckboxProps {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  error?: string
}

export function Checkbox({ label, checked, onChange, disabled, error }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${
          checked
            ? 'bg-primary-600 border-primary-600'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </button>
      {label && (
        <label className={`text-sm ${error ? 'text-red-600' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
    </div>
  )
}
