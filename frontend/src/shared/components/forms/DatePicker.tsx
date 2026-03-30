import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  label?: string
  error?: string
  minDate?: string
  maxDate?: string
}

export function DatePicker({ value, onChange, label, error, minDate, maxDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const days = Array.from({ length: daysInMonth(currentMonth) }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, () => null)

  const formatDate = (date: Date) => date.toISOString().split('T')[0]
  const selectedDate = value ? new Date(value + 'T00:00:00') : null
  const isSelectable = (date: Date) => {
    const normalized = formatDate(date)

    if (minDate && normalized < minDate) {
      return false
    }

    if (maxDate && normalized > maxDate) {
      return false
    }

    return true
  }

  const handleSelectDay = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (!isSelectable(selected)) {
      return
    }
    onChange(formatDate(selected))
    setIsOpen(false)
  }

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="w-full" ref={ref}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2 border rounded-lg flex items-center gap-2 ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          {value ? new Date(value + 'T00:00:00').toLocaleDateString() : 'Select date'}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <p className="font-medium">{monthYear}</p>
              <button
                type="button"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="font-semibold text-gray-600 w-8">{day}</div>
              ))}
              {[...emptyDays, ...days].map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => day && handleSelectDay(day)}
                  disabled={!day || !isSelectable(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                  className={`w-8 h-8 rounded ${
                    !day
                      ? 'invisible'
                      : selectedDate &&
                          selectedDate.getDate() === day &&
                          selectedDate.getMonth() === currentMonth.getMonth() &&
                          selectedDate.getFullYear() === currentMonth.getFullYear()
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
