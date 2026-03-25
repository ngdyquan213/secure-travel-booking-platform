import { ReactNode } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
}

export function Input({
  label,
  error,
  helperText,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}
        <input
          className={`w-full px-4 py-2 ${icon ? 'pl-10' : ''} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && !error && <p className="text-gray-600 text-sm mt-1">{helperText}</p>}
    </div>
  )
}
