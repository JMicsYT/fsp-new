"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Medal } from "lucide-react"
import Link from "next/link"

interface Athlete {
  id: string
  name: string
  rank: number
  points: number
  region: string
  organization: string
  competitions: number
  medals: {
    gold: number
    silver: number
    bronze: number
  }
  discipline: string
}

interface RankingsTableProps {
  filters: {
    search: string
    discipline: string
    region: string
    period: string
  }
}

export function RankingsTable({ filters }: RankingsTableProps) {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Athlete | null
    direction: "ascending" | "descending"
  }>({
    key: "rank",
    direction: "ascending",
  })

  useEffect(() => {
    // In a real application, this would be an API call with filters
    // For now, we'll simulate it with mock data
    setLoading(true)
    setTimeout(() => {
      const mockAthletes: Athlete[] = [
        {
          id: "1",
          name: "Иванов Иван",
          rank: 1,
          points: 1250,
          region: "Москва",
          organization: "МГТУ им. Баумана",
          competitions: 15,
          medals: { gold: 5, silver: 3, bronze: 2 },
          discipline: "Футбол",
        },
        {
          id: "2",
          name: "Петров Петр",
          rank: 2,
          points: 1180,
          region: "Санкт-Петербург",
          organization: "СПбГУ",
          competitions: 12,
          medals: { gold: 4, silver: 4, bronze: 1 },
          discipline: "Баскетбол",
        },
        {
          id: "3",
          name: "Сидорова Анна",
          rank: 3,
          points: 1120,
          region: "Казань",
          organization: "КФУ",
          competitions: 14,
          medals: { gold: 3, silver: 5, bronze: 3 },
          discipline: "Волейбол",
        },
        {
          id: "4",
          name: "Смирнов Алексей",
          rank: 4,
          points: 980,
          region: "Новосибирск",
          organization: "НГУ",
          competitions: 10,
          medals: { gold: 2, silver: 4, bronze: 2 },
          discipline: "Теннис",
        },
        {
          id: "5",
          name: "Кузнецова Елена",
          rank: 5,
          points: 920,
          region: "Екатеринбург",
          organization: "УрФУ",
          competitions: 11,
          medals: { gold: 2, silver: 3, bronze: 4 },
          discipline: "Плавание",
        },
        {
          id: "6",
          name: "Попов Дмитрий",
          rank: 6,
          points: 850,
          region: "Москва",
          organization: "МГУ",
          competitions: 9,
          medals: { gold: 1, silver: 4, bronze: 3 },
          discipline: "Лёгкая атлетика",
        },
        {
          id: "7",
          name: "Соколова Мария",
          rank: 7,
          points: 820,
          region: "Санкт-Петербург",
          organization: "ИТМО",
          competitions: 8,
          medals: { gold: 1, silver: 3, bronze: 3 },
          discipline: "Футбол",
        },
        {
          id: "8",
          name: "Лебедев Игорь",
          rank: 8,
          points: 780,
          region: "Казань",
          organization: "КНИТУ",
          competitions: 10,
          medals: { gold: 1, silver: 2, bronze: 4 },
          discipline: "Баскетбол",
        },
        {
          id: "9",
          name: "Козлова Наталья",
          rank: 9,
          points: 750,
          region: "Новосибирск",
          organization: "НГТУ",
          competitions: 7,
          medals: { gold: 1, silver: 2, bronze: 3 },
          discipline: "Волейбол",
        },
        {
          id: "10",
          name: "Новиков Сергей",
          rank: 10,
          points: 720,
          region: "Екатеринбург",
          organization: "УГТУ",
          competitions: 8,
          medals: { gold: 0, silver: 3, bronze: 5 },
          discipline: "Теннис",
        },
      ]

      // Apply filters
      let filteredAthletes = [...mockAthletes]

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredAthletes = filteredAthletes.filter((athlete) => athlete.name.toLowerCase().includes(searchLower))
      }

      if (filters.discipline) {
        filteredAthletes = filteredAthletes.filter((athlete) => athlete.discipline === filters.discipline)
      }

      if (filters.region) {
        filteredAthletes = filteredAthletes.filter((athlete) => athlete.region === filters.region)
      }

      // Apply sorting
      if (sortConfig.key) {
        filteredAthletes.sort((a, b) => {
          if (a[sortConfig.key as keyof Athlete] < b[sortConfig.key as keyof Athlete]) {
            return sortConfig.direction === "ascending" ? -1 : 1
          }
          if (a[sortConfig.key as keyof Athlete] > b[sortConfig.key as keyof Athlete]) {
            return sortConfig.direction === "ascending" ? 1 : -1
          }
          return 0
        })
      }

      setAthletes(filteredAthletes)
      setLoading(false)
    }, 500)
  }, [filters, sortConfig])

  const requestSort = (key: keyof Athlete) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-muted animate-pulse rounded" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 w-full bg-muted animate-pulse rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Button variant="ghost" className="p-0 h-8 w-8" onClick={() => requestSort("rank")}>
                <span className="sr-only">Сортировать по рангу</span>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 h-8" onClick={() => requestSort("name")}>
                Спортсмен
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 h-8" onClick={() => requestSort("region")}>
                Регион
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 h-8" onClick={() => requestSort("discipline")}>
                Вид спорта
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" className="p-0 h-8" onClick={() => requestSort("points")}>
                Очки
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-center">Медали</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" className="p-0 h-8" onClick={() => requestSort("competitions")}>
                Соревнования
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {athletes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Спортсмены не найдены
              </TableCell>
            </TableRow>
          ) : (
            athletes.map((athlete) => (
              <TableRow key={athlete.id}>
                <TableCell className="font-medium">{athlete.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={athlete.name} />
                      <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Link href={`/athletes/${athlete.id}`} className="hover:underline">
                      {athlete.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{athlete.region}</TableCell>
                <TableCell>
                  <Badge variant="outline">{athlete.discipline}</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">{athlete.points}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    {athlete.medals.gold > 0 && (
                      <div className="flex items-center">
                        <Medal className="h-4 w-4 text-yellow-500" />
                        <span className="ml-1 text-xs">{athlete.medals.gold}</span>
                      </div>
                    )}
                    {athlete.medals.silver > 0 && (
                      <div className="flex items-center">
                        <Medal className="h-4 w-4 text-gray-400" />
                        <span className="ml-1 text-xs">{athlete.medals.silver}</span>
                      </div>
                    )}
                    {athlete.medals.bronze > 0 && (
                      <div className="flex items-center">
                        <Medal className="h-4 w-4 text-amber-700" />
                        <span className="ml-1 text-xs">{athlete.medals.bronze}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">{athlete.competitions}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
