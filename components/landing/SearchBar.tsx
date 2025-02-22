'use client'

import type React from 'react'

import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/use-debounce'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Construction } from '../../lib/types'
import PasswordModal from './PasswordModal'

function ActionSearchBar({
  constructions,
  favorites,
}: {
  constructions: Construction[]
  favorites?: string[]
}) {
  const params = useSearchParams()
  const router = useRouter()
  const [inputQuery, setInputQuery] = useState(params.get('query') || '')
  const debouncedQuery = useDebounce(inputQuery, 500)
  const [filteredActions, setFilteredActions] = useState<Construction[]>([])
  const searchBarRef = useRef<HTMLDivElement>(null) // Ref para el searchbar
  const [dropdownWidth, setDropdownWidth] = useState<number>(0)
  const [selectedCard, setSelectedCard] = useState<Construction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (card: Construction) => {
    if (favorites?.includes(card.id)) {
      router.push(`/constructions/${card.id}`)
    } else {
      setSelectedCard(card)
      setIsModalOpen(true)
    }
  }

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setFilteredActions([])
      // Update the query parameter to be empty when the debounced query is empty
      const newParams = new URLSearchParams(params.toString())
      newParams.delete('query')
      router.push(`?${newParams.toString()}`, { scroll: false })
      return
    }

    const filtered = constructions.filter((construction) => {
      const searchableText = construction.name.toLowerCase()
      return searchableText.includes(debouncedQuery.toLowerCase().trim())
    })
    setFilteredActions(filtered)

    // Update the query parameter with the debounced query
    const newParams = new URLSearchParams(params.toString())
    newParams.set('query', debouncedQuery)
    router.push(`?${newParams.toString()}`, { scroll: false })
  }, [debouncedQuery, params, router])

  useEffect(() => {
    // Actualiza el ancho del dropdown cuando el componente se monta
    if (searchBarRef.current) {
      setDropdownWidth(searchBarRef.current.offsetWidth)
    }

    // Listener para resize
    const handleResize = () => {
      if (searchBarRef.current) {
        setDropdownWidth(searchBarRef.current.offsetWidth)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(e.target.value)
  }

  const container = {
    hidden: { opacity: 0, scaleY: 0 },
    show: {
      opacity: 1,
      scaleY: 1,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scaleY: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative" ref={searchBarRef}>
        <div className="relative">
          <div className="w-full flex gap-2">
            <Input
              type="text"
              name="query"
              placeholder="tu obra?"
              value={inputQuery}
              onChange={handleInputChange}
              className="pl-3 pr-9 py-1.5 h-12  rounded-lg focus-visible:ring-offset-0"
            />

            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>
      </div>
      {debouncedQuery && (
        <AnimatePresence>
          <motion.div
            className="absolute mt-1 border rounded-md shadow-sm overflow-hidden dark:border-gray-800 bg-white dark:bg-black"
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              transformOrigin: 'top',
              width: dropdownWidth,
            }}
          >
            <motion.ul>
              {filteredActions.length ? (
                filteredActions?.map((action) => (
                  <motion.li
                    key={action.id}
                    className="px-3 py-2 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-zinc-900 cursor-pointer rounded-md"
                    variants={item}
                    layout
                    onClick={() => handleCardClick(action)}
                  >
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">
                          <Home />
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {action.name}
                        </span>
                        <span className="text-xs text-gray-400 max-w-[10rem] truncate">
                          {action.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 text-right">
                        {action.ref}
                      </span>
                    </div>
                  </motion.li>
                ))
              ) : (
                <motion.li className="px-3 py-2 flex items-center justify-between cursor-pointer rounded-md">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">
                        <Home />
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        No hay resultados
                      </span>
                    </div>
                  </div>
                </motion.li>
              )}
            </motion.ul>
          </motion.div>
        </AnimatePresence>
      )}
      {selectedCard && (
        <PasswordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          card={selectedCard}
        />
      )}
    </div>
  )
}

export default ActionSearchBar
