"use client"

import { useState } from "react"
import { RankingsFilters } from "@/components/rankings/rankings-filters"
import { RankingsTable } from "@/components/rankings/rankings-table"
import { RankingsStats } from "@/components/rankings/rankings-stats"

export default function RankingsPage() {
  const [filters, setFilters] = useState({
    search: "",
    discipline: "",
    region: "",
    period: "",
  })

  const handleFilterChange = (newFilters: {
    search: string
    discipline: string
    region: string
    period: string
  }) => {
    setFilters(newFilters)
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Рейтинг спортсменов</h1>
          <p className="text-muted-foreground">
            Рейтинг спортсменов формируется на основе результатов участия в соревнованиях и набранных очков.
          </p>
        </div>

        <RankingsFilters onFilterChange={handleFilterChange} />
        <RankingsStats />
        <RankingsTable filters={filters} />
      </div>
    </div>
  )
}
