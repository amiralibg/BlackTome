type CustomCheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
}

export function CustomCheckbox({ checked, onChange, label, description }: CustomCheckboxProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-3">
      <div className="relative flex h-5 w-5 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="h-5 w-5 rounded-md border-2 border-stone-600 bg-stone-950/80 transition-all duration-200 peer-checked:border-crimson-500 peer-checked:bg-crimson-950/60 peer-focus:ring-2 peer-focus:ring-crimson-500/30 group-hover:border-stone-500 peer-checked:group-hover:border-crimson-400" />
        <svg
          className="pointer-events-none absolute h-3.5 w-3.5 scale-0 text-crimson-200 transition-transform duration-200 peer-checked:scale-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      {(label || description) && (
        <div className="flex-1">
          {label && <span className="block text-sm font-semibold text-stone-200">{label}</span>}
          {description && <span className="mt-0.5 block text-sm text-stone-500">{description}</span>}
        </div>
      )}
    </label>
  )
}
