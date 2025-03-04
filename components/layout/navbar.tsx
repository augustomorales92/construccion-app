'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface Tab {
  label: string
  href: string
  icon: LucideIcon
  targetHrefs?: string[]
}

interface FrameProps {
  tabs?: Tab[]
  isMobile?: boolean
}

export default function Frame({ tabs = [], isMobile }: FrameProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState<{
    left?: string
    width?: string
    top?: string
    height?: string
    bottom?: string
  }>({})
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const pathname = usePathname()

  const activeIndex = tabs.findIndex((tab) => {
    const matches = tab.targetHrefs?.some((regex) =>
      new RegExp(regex).test(pathname),
    )
    return tab.href === pathname || matches
  })

  useEffect(() => {
    if (tabs.length === 0) return

    const updateStyles = () => {
      if (hoveredIndex !== null) {
        const hoveredElement = tabRefs.current[hoveredIndex]
        if (hoveredElement) {
          if (isMobile) {
            setHoverStyle({
              top: `${hoveredElement.offsetTop}px`,
              height: `${hoveredElement.offsetHeight}px`,
              width: '100%',
            })
          } else {
            setHoverStyle({
              left: `${hoveredElement.offsetLeft}px`,
              width: `${hoveredElement.offsetWidth}px`,
            })
          }
        }
      }

      if (activeIndex !== -1) {
        const activeElement = tabRefs.current[activeIndex]
        if (activeElement) {
          if (isMobile) {
            setActiveStyle({
              left: '0',
              top: `${activeElement.offsetTop}px`,
              height: `${activeElement.offsetHeight}px`,
              width: '2px',
            })
          } else {
            setActiveStyle({
              left: `${activeElement.offsetLeft}px`,
              width: `${activeElement.offsetWidth}px`,
              bottom: '-6px',
              height: '2px',
            })
          }
        }
      }
    }

    updateStyles()
    if (!activeStyle.width && !activeStyle.height) {
      requestAnimationFrame(updateStyles)
    }
  }, [
    hoveredIndex,
    activeIndex,
    activeStyle.width,
    activeStyle.height,
    tabs,
    isMobile,
  ])

  if (tabs.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <Card className="w-full border-none shadow-none">
        <CardContent className="p-0">
          <div className="relative">
            {/* Hover Highlight */}
            <div
              className="absolute transition-all duration-300 ease-out bg-primary/20 rounded-[6px]"
              style={{
                ...hoverStyle,
                opacity: hoveredIndex !== null ? 1 : 0,
              }}
            />

            {/* Active Indicator */}
            <div
              className="absolute bg-primary transition-all duration-300 ease-out"
              style={activeStyle}
            />

            {/* Tabs */}
            <div
              className={`flex ${isMobile ? 'flex-col' : 'flex-row'} w-full`}
            >
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                return (
                  <Link
                    key={index}
                    href={tab.href}
                    ref={(el) => {
                      tabRefs.current[index] = el
                    }}
                    className={`w-full px-4 py-3 cursor-pointer transition-colors duration-300 ${
                      index === activeIndex
                        ? 'text-primary dark:text-primary'
                        : 'text-primary/50 dark:text-primary/50'
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="text-sm leading-5 flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
