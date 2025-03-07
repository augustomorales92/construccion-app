"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type ComboboxOption<T> = {
  value: string
  label: string
  data: T
}

type ComboboxProps<T> = {
  options: ComboboxOption<T>[]
  value?: string
  onChange: (value: string, option?: ComboboxOption<T>) => void
  placeholder?: string
  emptyMessage?: string
  searchPlaceholder?: string
  disabled?: boolean
  loading?: boolean
  triggerClassName?: string
  contentClassName?: string
  renderOption?: (option: ComboboxOption<T>) => React.ReactNode
  renderSelectedValue?: (selectedOption?: ComboboxOption<T>) => React.ReactNode
}

export function Combobox<T>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  emptyMessage = "No options found.",
  searchPlaceholder = "Search...",
  disabled = false,
  loading = false,
  triggerClassName,
  contentClassName,
  renderOption,
  renderSelectedValue,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options

    const lowerQuery = searchQuery.toLowerCase()
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(lowerQuery) ||
        (option.data &&
          typeof option.data === "object" &&
          Object.values(option.data).some((val) => typeof val === "string" && val.toLowerCase().includes(lowerQuery))),
    )
  }, [options, searchQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between mt-1",
            !selectedOption && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            triggerClassName,
          )}
          disabled={disabled}
        >
          {selectedOption
            ? renderSelectedValue
              ? renderSelectedValue(selectedOption)
              : selectedOption.label
            : placeholder}
          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", contentClassName)}>
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={searchQuery} onValueChange={setSearchQuery} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
              ) : (
                filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange(option.value, option)
                      setOpen(false)
                      setSearchQuery("")
                    }}
                  >
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <>
                        <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                        {option.label}
                      </>
                    )}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

