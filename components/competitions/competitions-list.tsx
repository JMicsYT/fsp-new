"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

type Competition = {
  id: string
  title: string
  description: string
  sportType: string
  location: string
  region: string
  date: string
  status: string
  participantsCount: number
  maxParticipants: number
  image?: string
}

export function CompetitionsList() {
  const searchParams = useSearchParams()
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCompetitions() {
      setLoading(true)
      try {
        // Создаем URL с параметрами фильтрации
        const queryString = searchParams.toString()
        const response = await fetch(`/api/competitions${queryString ? `?${queryString}` : ""}`)

        if (!response.ok) {
          throw new Error("Ошибка при загрузке соревнований")
        }

        const data = await response.json()
        setCompetitions(data)
      } catch (error) {
        console.error("Ошибка:", error)
        // Используем моковые данные в случае ошибки
        setCompetitions(mockCompetitions)
      } finally {
        setLoading(false)
      }
    }

    fetchCompetitions()
  }, [searchParams])

  if (loading) {
    return <CompetitionsListSkeleton />
  }

  if (competitions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-semibold">Соревнования не найдены</h3>
        <p className="text-muted-foreground">Попробуйте изменить параметры фильтрации</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {competitions.map((competition) => (
        <CompetitionCard key={competition.id} competition={competition} />
      ))}
    </div>
  )
}

function CompetitionCard({ competition }: { competition: Competition }) {
  // Определяем цвет бейджа в зависимости от статуса
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "upcoming":
        return "default"
      case "ongoing":
        return "success"
      case "completed":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Переводим статус на русский
  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Предстоящее"
      case "ongoing":
        return "Текущее"
      case "completed":
        return "Завершено"
      default:
        return status
    }
  }

  // Форматируем дату
  const formattedDate = new Date(competition.date)

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {competition.image ? (
          <img
            src={competition.image || "/placeholder.svg"}
            alt={competition.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">Нет изображения</span>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">{competition.title}</CardTitle>
          <Badge variant={getBadgeVariant(competition.status)}>{getStatusText(competition.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">{competition.description}</p>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4" />
          <span>{competition.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{format(formattedDate, "PPP", { locale: ru })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4" />
          <span>
            {competition.participantsCount} / {competition.maxParticipants} участников
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 p-4 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/competitions/${competition.id}`}>
            Подробнее
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild className="w-full">
          <Link href={`/competitions/register/${competition.id}`}>Регистрация</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function CompetitionsListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardHeader className="p-4">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 p-4 pt-0">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}

// Моковые данные для тестирования
const mockCompetitions: Competition[] = [
  {
    id: "1",
    title: "Марафон 'Московская миля'",
    description: "Ежегодный марафон по центральным улицам Москвы",
    sportType: "running",
    location: "Москва, Красная площадь",
    region: "moscow",
    date: "2023-06-15",
    status: "upcoming",
    participantsCount: 120,
    maxParticipants: 500,
  },
  {
    id: "2",
    title: "Триатлон 'Сочи 2023'",
    description: "Международные соревнования по триатлону",
    sportType: "triathlon",
    location: "Сочи, Олимпийский парк",
    region: "sochi",
    date: "2023-07-10",
    status: "upcoming",
    participantsCount: 75,
    maxParticipants: 200,
  },
  {
    id: "3",
    title: "Велогонка 'Тур де Кубань'",
    description: "Многодневная велогонка по дорогам Краснодарского края",
    sportType: "cycling",
    location: "Краснодарский край",
    region: "krasnodar",
    date: "2023-05-20",
    status: "completed",
    participantsCount: 50,
    maxParticipants: 50,
  },
  {
    id: "4",
    title: "Заплыв через Неву",
    description: "Традиционный заплыв через реку Неву",
    sportType: "swimming",
    location: "Санкт-Петербург",
    region: "spb",
    date: "2023-06-25",
    status: "upcoming",
    participantsCount: 30,
    maxParticipants: 100,
  },
  {
    id: "5",
    title: "Лыжный марафон 'Лыжня России'",
    description: "Всероссийский лыжный марафон",
    sportType: "skiing",
    location: "Москва, Парк Сокольники",
    region: "moscow",
    date: "2023-02-10",
    status: "completed",
    participantsCount: 200,
    maxParticipants: 300,
  },
  {
    id: "6",
    title: "Полумарафон 'Белые ночи'",
    description: "Ночной забег по Санкт-Петербургу",
    sportType: "running",
    location: "Санкт-Петербург, Дворцовая площадь",
    region: "spb",
    date: "2023-06-20",
    status: "upcoming",
    participantsCount: 85,
    maxParticipants: 150,
  },
]
