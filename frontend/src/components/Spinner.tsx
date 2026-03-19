interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export function Spinner({ size = 'md', fullScreen = false }: SpinnerProps) {
  const sizeStyles = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  const spinner = (
    <div className={`${sizeStyles[size]} border-gray-200 border-t-primary-600 rounded-full animate-spin`} />
  )

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        {spinner}
      </div>
    )
  }

  return <div className="flex items-center justify-center">{spinner}</div>
}
