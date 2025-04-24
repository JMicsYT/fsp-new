"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Competition {
  id: string
  title: string
  type: string
  discipline: string
  registrationStart: string
  registrationEnd: string
  eventStart: string
  eventEnd: string
  region: string
  maxParticipants: number | null
  currentParticipants: number
}

export function UpcomingCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        // Получаем только предстоящие соревнования
        const response = await fetch("/api/competitions?status=REGISTRATION_OPEN")

        if (!response.ok) {
          throw new Error("Ошибка при загрузке соревнований")
        }

        const data = await response.json()
        // Берем только первые 3 соревнования
        setCompetitions(data.slice(0, 3))
      } catch (error) {
        console.error("Ошибка:", error)
        // Используем демо-данные в случае ошибки
        setCompetitions([])
      } finally {
        setLoading(false)
      }
    }

    fetchCompetitions()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-7 w-full mt-2" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // Если нет соревнований, показываем сообщение
  if (competitions.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">Нет предстоящих соревнований</h3>
        <p className="text-muted-foreground">Скоро здесь появятся новые соревнования</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {competitions.map((competition) => (
        <Card key={competition.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <Badge
                variant={
                  competition.type === "FEDERAL" ? "default" : competition.type === "REGIONAL" ? "secondary" : "outline"
                }
              >
                {competition.type === "FEDERAL"
                  ? "Федеральное"
                  : competition.type === "REGIONAL"
                    ? "Региональное"
                    : "Открытое"}
              </Badge>
              <Badge variant="outline" className="ml-2">
                {competition.discipline}
              </Badge>
            </div>
            <CardTitle className="mt-2">{competition.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  Регистрация: {new Date(competition.registrationStart).toLocaleDateString()} -{" "}
                  {new Date(competition.registrationEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  Проведение: {new Date(competition.eventStart).toLocaleDateString()} -{" "}
                  {new Date(competition.eventEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{competition.region}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  Участников: {competition.currentParticipants} / {competition.maxParticipants || "∞"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/competitions/${competition.id}`} className="w-full">
              <Button className="w-full">Подробнее</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
