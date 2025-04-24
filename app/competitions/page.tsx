import type { Metadata } from "next"
import { Suspense } from "react"
import { CompetitionFilters } from "@/components/competitions/competition-filters"
import { CompetitionsList } from "@/components/competitions/competitions-list"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Соревнования | СЦР",
  description: "Просмотр и поиск спортивных соревнований",
}

export default function CompetitionsPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Соревнования</h1>
          <p className="text-muted-foreground">Найдите и зарегистрируйтесь на спортивные соревнования</p>
        </div>
        <Suspense fallback={<FiltersSkeleton />}>
          <CompetitionFilters />
        </Suspense>
        <Suspense fallback={<ListSkeleton />}>
          <CompetitionsList />
        </Suspense>
      </div>
    </div>
  )
}

function FiltersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-10 w-full sm:w-[200px]" />
        <Skeleton className="h-10 w-full sm:w-[200px]" />
        <Skeleton className="h-10 w-full sm:w-[200px]" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-[100px]" />
        <Skeleton className="h-9 w-[100px]" />
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
        ))}
    </div>
  )
}
