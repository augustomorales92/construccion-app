"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-md shadow-current">
      <CardHeader className="p-0 relative">
        <Skeleton className="w-full h-48" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <div className="mt-2">
          <Skeleton className="h-4 w-1/4 mb-1" />
          <Skeleton className="w-full h-2.5 rounded-full mb-1" />
          <Skeleton className="h-4 w-1/3 mb-2" />
        </div>
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  )
}

