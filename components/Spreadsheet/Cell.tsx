'use client'

import { Input } from '@/components/ui/input'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

interface CellPosition {
  row: number
  col: number
}

interface CellProps {
  value: string
  onChange: (value: string) => void
  isEven: boolean
  position?: CellPosition
  isActive: boolean
  onActivate: () => void
  readOnly: boolean
}

export default function Cell({
  value,
  onChange,
  isEven,
  isActive,
  onActivate,
  readOnly,
}: CellProps) {
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
    <div className="relative">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className="absolute inset-0 border-primary rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          readOnly={readOnly}
        />
      ) : (
        <div
          className={`w-full h-full border-r border-b border-border px-2 py-1 cursor-text truncate
            ${isEven ? 'bg-background' : 'bg-muted/30'} 
            ${isActive ? 'border-2 border-primary' : ''}
            hover:bg-accent/50 ${readOnly ? 'cursor-default' : ''}`}
          onClick={handleClick}
        >
          {value}
        </div>
      )}
    </div>
  )
}
