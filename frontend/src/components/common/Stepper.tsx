import { Check } from 'lucide-react'

interface Step {
  label: string
  completed?: boolean
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <p className={`text-xs mt-2 text-center ${
              index === currentStep ? 'text-primary-600 font-medium' : 'text-gray-600'
            }`}>
              {step.label}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`h-0.5 flex-1 mx-2 ${
              index < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}
