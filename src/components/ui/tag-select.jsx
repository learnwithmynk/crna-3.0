/**
 * TagSelect Component
 *
 * Multi-select tag component used in trackers and filters.
 * Soft rounded design with theme-aware colors.
 *
 * Example:
 * <TagSelect
 *   options={[
 *     { value: 'cardiac', label: 'Cardiac' },
 *     { value: 'neuro', label: 'Neuro' },
 *     { value: 'trauma', label: 'Trauma' },
 *   ]}
 *   selected={selectedPopulations}
 *   onChange={setSelectedPopulations}
 *   allowCustom
 * />
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

export function TagSelect({
  options = [],
  selected = [],
  onChange,
  allowCustom = false,
  placeholder = "Add new...",
  className
}) {
  const { colors } = useTheme();
  const [customValue, setCustomValue] = React.useState("")

  const toggleSelection = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleAddCustom = (e) => {
    if (e.key === 'Enter' && customValue.trim()) {
      e.preventDefault()
      const newValue = customValue.trim().toLowerCase().replace(/\s+/g, '_')
      if (!selected.includes(newValue)) {
        onChange([...selected, newValue])
      }
      setCustomValue("")
    }
  }

  const removeTag = (value, e) => {
    e.stopPropagation()
    onChange(selected.filter(v => v !== value))
  }

  // Get label for a value (handles custom tags)
  const getLabel = (value) => {
    const option = options.find(opt => opt.value === value)
    if (option) return option.label
    // For custom tags, format the value nicely
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Predefined Options */}
      {options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleSelection(option.value)}
              style={{
                '--theme-accent': colors.accent,
                '--theme-accent-light': colors.accentLight,
              }}
              className={cn(
                "px-3 py-1.5 rounded-2xl text-sm border transition-all duration-200",
                selected.includes(option.value)
                  ? "bg-[var(--theme-accent-light)] border-[var(--theme-accent)] text-gray-900 font-medium"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Selected Tags (for custom tags or when showing selected separately) */}
      {allowCustom && selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected
            .filter(value => !options.find(opt => opt.value === value))
            .map(value => (
              <span
                key={value}
                style={{
                  '--theme-accent': colors.accent,
                  '--theme-accent-light': colors.accentLight,
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl text-sm bg-[var(--theme-accent-light)] border border-[var(--theme-accent)] text-gray-900 font-medium"
              >
                {getLabel(value)}
                <button
                  type="button"
                  onClick={(e) => removeTag(value, e)}
                  className="hover:bg-gray-200/50 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
        </div>
      )}

      {/* Custom Tag Input */}
      {allowCustom && (
        <div>
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleAddCustom}
            placeholder={placeholder}
            style={{
              '--focus-ring': colors.focusRing,
              '--focus-glow': colors.focusGlow,
              '--focus-border': colors.focusBorder,
            }}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 focus:bg-white focus:outline-none focus:border-[var(--focus-border)] focus:shadow-[0_0_0_3px_var(--focus-ring),0_0_12px_var(--focus-glow)] transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-1">Press Enter to add</p>
        </div>
      )}
    </div>
  )
}
