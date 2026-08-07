import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, value, defaultValue, onChange, onInput, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const [hasValue, setHasValue] = React.useState(
      () => String(value ?? defaultValue ?? "").length > 0
    )

    const setRefs = React.useCallback(
      (input: HTMLInputElement | null) => {
        inputRef.current = input

        if (typeof ref === "function") {
          ref(input)
        } else if (ref) {
          ref.current = input
        }
      },
      [ref]
    )

    React.useEffect(() => {
      const input = inputRef.current
      if (input) {
        setHasValue(input.value.length > 0)
      }
    }, [value])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(event.currentTarget.value.length > 0)
      onChange?.(event)
    }

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
      setHasValue(event.currentTarget.value.length > 0)
      onInput?.(event)
    }

    const clearInput = () => {
      const input = inputRef.current
      if (!input) return

      const valueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set

      valueSetter?.call(input, "")
      input.dispatchEvent(new Event("input", { bubbles: true }))
      setHasValue(false)
      input.focus()
    }

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-14 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={setRefs}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onInput={handleInput}
          {...props}
        />
        {hasValue && (
          <button
            type="button"
            aria-label="Clear input"
            className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center !border-0 !bg-transparent !p-0 text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            onClick={clearInput}
          >
            <X className="h-5 w-5 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
