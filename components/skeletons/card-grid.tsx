"use client"

import CardSkeleton from "./card-skeleton"

export default function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="py-8">
      <div className="overflow-hidden rounded-xl p-1">
        <div className="flex">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_33.33%] pl-4 first:pl-0 rounded-xl p-2">
              <CardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

