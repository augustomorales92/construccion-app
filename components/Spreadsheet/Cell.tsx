"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface CellProps {
  value: string
  onChange: (value: string) => void
  isEven: boolean
  isActive: boolean
  onActivate: () => void
  readOnly: boolean
}

export default function Cell({ value, onChange, isEven, isActive, onActivate, readOnly }: CellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && !readOnly) {
      inputRef.current?.focus()
    }
  }, [isEditing, readOnly])

  const handleClick = () => {
    if (!readOnly) {
      setIsEditing(true)
      onActivate()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  return (
    <div className="relative h-10 w-full max-w-full overflow-hidden">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className="absolute inset-0 h-full border-primary rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          readOnly={readOnly}
        />
      ) : (
        <div
          className={cn(
            "h-full w-full px-2 py-1 cursor-text flex items-center",
            "border-r border-border",
            isEven ? "bg-background" : "bg-muted/30",
            isActive ? "ring-2 ring-primary ring-inset" : "",
            readOnly ? "cursor-default" : "hover:bg-accent/50",
            "max-w-full overflow-hidden",
          )}
          onClick={handleClick}
          title={value}
        >
          <span className="truncate block w-full overflow-hidden text-ellipsis whitespace-nowrap">{value}</span>
        </div>
      )}
    </div>
  )
}

