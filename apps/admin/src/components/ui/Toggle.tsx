interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

export function Toggle({ checked, onChange, label, description, disabled, size = 'md' }: ToggleProps) {
  const trackSize = size === 'sm' ? 'w-9 h-5' : 'w-11 h-6'
  const thumbSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5'
  const thumbTranslate = size === 'sm' ? 'translate-x-4' : 'translate-x-5'

  return (
    <label className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} group py-1`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          !disabled && onChange(!checked)
        }}
        className={`
          relative inline-flex flex-shrink-0 ${trackSize} rounded-full
          transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]
          border-2 border-transparent
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          ${checked ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'bg-gray-300 hover:bg-gray-400'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block ${thumbSize} rounded-full bg-white shadow-md ring-0
            transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]
            ${checked ? thumbTranslate : 'translate-x-0'}
            self-center
          `}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-gray-700 select-none group-hover:text-gray-900 transition-colors">
          {label}
        </span>
      )}
    </label>

  )
}
