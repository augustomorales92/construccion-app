'use client'

import { addMonths, differenceInCalendarMonths, format, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface MonthPickerListProps {
  initialValue?: string | null
  onSelectMonth?: (date: Date | null, formattedValue: string) => void
}

export default function MonthPickerList({
  initialValue,
  onSelectMonth,
}: MonthPickerListProps) {
  const [open, setOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const currentDate = new Date()

  const months = useMemo(() => {
    const monthsList = []
    for (let i = 0; i <= 60; i++) {
      monthsList.push(addMonths(new Date(), i))
    }
    return monthsList
  }, [])

  const durationInMonths = useMemo(() => {
    if (!selectedMonth) return 0
    return differenceInCalendarMonths(selectedMonth, currentDate) + 1
  }, [selectedMonth, currentDate])

  useEffect(() => {
    if (initialValue) {
      try {
        if (initialValue.includes('meses') && initialValue.includes('Hasta')) {
          const monthYearPart = initialValue
            .split('Hasta ')[1]
            .trim()
            .replace(')', '')
          const date = parse(monthYearPart, 'MMMM yyyy', new Date(), {
            locale: es,
          })
          setSelectedMonth(date)
        }
        else if (initialValue.includes('meses')) {
          const months = Number.parseInt(initialValue.split(' ')[0])
          if (!isNaN(months)) {
            setSelectedMonth(addMonths(new Date(), months))
          }
        }
        else {
          const date = parse(initialValue, 'MMMM yyyy', new Date(), {
            locale: es,
          })
          setSelectedMonth(date)
        }
      } catch (e) {
        console.log('Could not parse initial date value', e)
      }
    }
  }, [initialValue])

  const handleSelectMonth = (date: Date) => {
    setSelectedMonth(date)
    setOpen(false)

    const formattedValue = `${durationInMonths} ${durationInMonths === 1 ? 'mes' : 'meses'} (Hasta ${format(date, 'MMMM yyyy', { locale: es })})`
    if (onSelectMonth) {
      onSelectMonth(date, formattedValue)
    }
  }

  return (
    <div className="w-full h-10 mt-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              !selectedMonth && 'text-muted-foreground',
            )}
          >
            {selectedMonth
              ? `${durationInMonths} ${durationInMonths === 1 ? 'mes' : 'meses'} (Hasta ${format(selectedMonth, 'MMMM yyyy', { locale: es })})`
              : 'Selecciona un mes'}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar mes..." />
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandList>
              <ScrollArea className="h-72">
                <CommandGroup>
                  {months.map((month, index) => {
                    const monthDuration =
                      differenceInCalendarMonths(month, currentDate) + 1
                    return (
                      <CommandItem
                        key={index}
                        value={format(month, 'MMMM yyyy', { locale: es })}
                        onSelect={() => handleSelectMonth(month)}
                        className={cn(
                          'cursor-pointer flex justify-between',
                          selectedMonth &&
                            format(selectedMonth, 'MM-yyyy') ===
                              format(month, 'MM-yyyy') &&
                            'bg-primary text-primary-foreground',
                        )}
                      >
                        <span>
                          {format(month, 'MMMM yyyy', { locale: es })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {monthDuration}{' '}
                          {monthDuration === 1 ? 'mes' : 'meses'}
                        </span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
