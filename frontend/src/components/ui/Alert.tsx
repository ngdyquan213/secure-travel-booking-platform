import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useState } from 'react'

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  dismissible?: boolean
  onDismiss?: () => void
}

export function Alert({ type, title, message, dismissible = true, onDismiss }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    },
  }

  const style = styles[type]

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 flex gap-3 ${style.text}`}>
      {style.icon}
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm mt-1">{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
