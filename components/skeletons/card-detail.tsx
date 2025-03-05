'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CardDetailSkeleton() {
  return (
    <div className="container mx-auto py-4">
      <div>
        <div className="mb-4 flex justify-between items-center sm:flex-row gap-2 w-full">
          <span className="flex w-full">
            <Button
              variant="ghost"
              className="flex items-center justify-center"
              disabled
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </span>

          <span className="grid grid-cols-2 md:flex items-center gap-4 w-full justify-between sm:justify-end">
            <Skeleton className="h-10 w-1/2 rounded-md" />
          </span>
        </div>

        <Skeleton className="h-10 w-3/4 mb-6" />

        <Card className="mb-8">
          <CardContent className="p-0 relative">
            <div className="relative h-[25rem] w-full">
              <Skeleton className="absolute top-0 left-0 w-full h-full" />
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2"
              disabled
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2"
              disabled
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Construction Details Card */}
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-7 w-3/4 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-1/2" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-5 w-1/4 mb-2" />
                <Skeleton className="w-full h-2.5 rounded-full mb-2" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-7 w-1/3 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </CardContent>
          </Card>

          {/* Materials Card */}
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <Skeleton className="h-7 w-1/2" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </CardContent>
          </Card>

          {/* Certificates Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-7 w-1/3" />
                <Skeleton className="h-10 w-36 rounded-md" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex justify-between items-center">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-9 w-28 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
