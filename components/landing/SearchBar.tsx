'use client'

import type React from 'react'

import { getProjectsByQuery } from '@/actions/constructions'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/use-debounce'
import useFetchQuery from '@/hooks/useFetchQuery'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PartialConstruction } from '../../lib/types'
import PasswordModal from './PasswordModal'

function ActionSearchBar({ favorites }: { favorites?: string[] }) {
  const params = useSearchParams()
  const router = useRouter()
  const [inputQuery, setInputQuery] = useState(params.get('query') || '')
  const debouncedQuery = useDebounce(inputQuery, 500)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const [dropdownWidth, setDropdownWidth] = useState<number>(0)
  const [selectedCard, setSelectedCard] = useState<PartialConstruction | null>(
    null,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = useCallback(
    (card: PartialConstruction) => {
      if (favorites?.includes(card.id)) {
        router.push(`/constructions/${card.id}`)
      } else {
        setSelectedCard(card)
        setIsModalOpen(true)
      }
    },
    [favorites, router],
  )

  const { data, isLoading } = useFetchQuery(
    ['constructions', debouncedQuery],
    () => getProjectsByQuery(debouncedQuery),
  )

  useEffect(() => {
    if (searchBarRef.current) {
      setDropdownWidth(searchBarRef.current.offsetWidth)
    }

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

  const SearchContent = useMemo(() => {
    if (isLoading) {
      return (
        <motion.ul>
          <motion.li className="px-3 py-2 flex items-center justify-between cursor-pointer rounded-md">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">
                  <Home />
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Cargando...
                </span>
              </div>
            </div>
          </motion.li>
        </motion.ul>
      )
    }
    return (
      <motion.ul>
        {data?.length ? (
          data?.map((action) => (
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
                    {action.address}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 text-right">
                  {action.projectNumber}
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
    )
  }, [data, isLoading, handleCardClick])

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
            className="absolute mt-1 border rounded-md shadow-xs overflow-hidden dark:border-gray-800 bg-white dark:bg-black"
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              transformOrigin: 'top',
              width: dropdownWidth,
            }}
          >
            {SearchContent}
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
