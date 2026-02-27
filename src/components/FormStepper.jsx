import React from 'react';
import { Check } from 'lucide-react';

export default function FormStepper({ steps, currentStep, onStepChange }) {
  return (
    <div className="w-full py-3 mb-2 flex-shrink-0">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;

          return (
            <React.Fragment key={index}>
              <button
                type="button"
                onClick={() => onStepChange(index)}
                className="flex items-center gap-2 group shrink-0"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FF6B4A] text-white ring-4 ring-[#FF6B4A]/20'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={`hidden md:block text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? 'text-[#FF6B4A]'
                      : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-3 h-0.5">
                  <div
                    className={`h-full rounded-full transition-colors duration-300 ${
                      currentStep > index ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
