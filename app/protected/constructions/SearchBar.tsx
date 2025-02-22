'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Form from 'next/form'

export default function SearchBar() {
  return (
    <div className="w-full max-w-2xl">
      <Form action="">
        <div className="relative w-full flex items-center">
          <Input
            type="text"
            name="query"
            placeholder="tu obra?"
            className="pl-3 pr-12 py-1.5 h-12 w-full rounded-lg focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md"
          >
            <Search className="text-gray-400 h-4 w-4" />
          </Button>
        </div>
      </Form>
    </div>
  )
}
