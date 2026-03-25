import { useState, useCallback } from 'react'

interface UseFormProps<T> {
  initialValues: T
  onSubmit: (values: T) => Promise<void> | void
  validate?: (values: T) => Partial<T>
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormProps<T>) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Partial<T>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setValues((prev) => ({ ...prev, [name]: finalValue }))

    if (touched[name as keyof T] && validate) {
      const fieldErrors = validate({ ...values, [name]: finalValue })
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name as keyof T] }))
    }
  }, [values, validate, touched])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    if (validate) {
      const fieldErrors = validate(values)
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name as keyof T] }))
    }
  }, [values, validate])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (validate) {
      const newErrors = validate(values)
      setErrors(newErrors)
      if (Object.keys(newErrors).length > 0) return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validate, onSubmit])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  }
}
