"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

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
  status: string
  organizer: {
    id: string
    name: string
    email: string
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false)
  const { toast } = useToast()
  const competitionId = params.id as string

  useEffect(() => {
    // Если пользователь не аутентифицирован, перенаправляем на страницу входа
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/competitions/register/${competitionId}`)
    } else if (status === "authenticated") {
      fetchCompetition()
      checkRegistrationStatus()
    }
  }, [status, competitionId])

  const fetchCompetition = async () => {
    try {
      const response = await fetch(`/api/competitions/${competitionId}`)
      if (response.ok) {
        const data = await response.json()
        setCompetition(data)
      } else {
        throw new Error("Failed to fetch competition")
      }
    } catch (error) {
      console.error("Error fetching competition:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить информацию о соревновании",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkRegistrationStatus = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/registrations/check?userId=${session.user.id}&competitionId=${competitionId}`)
      if (response.ok) {
        const data = await response.json()
        setIsAlreadyRegistered(data.isRegistered)
      }
    } catch (error) {
      console.error("Error checking registration status:", error)
    }
  }

  const handleRegister = async () => {
    if (!session?.user?.id || !competition) return

    setIsRegistering(true)
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          competitionId: competition.id,
        }),
      })

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Вы успешно зарегистрировались на соревнование",
        })
        setIsAlreadyRegistered(true)
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to register")
      }
    } catch (error: any) {
      console.error("Error registering:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось зарегистрироваться на соревнование",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!competition) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <Card>
          <CardHeader>
            <CardTitle>Соревнование не найдено</CardTitle>
            <CardDescription>Запрашиваемое соревнование не существует или было удалено</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/competitions">
              <Button>Вернуться к списку соревнований</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (competition.status !== "REGISTRATION_OPEN") {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <Card>
          <CardHeader>
            <CardTitle>{competition.title}</CardTitle>
            <CardDescription>Регистрация на это соревнование закрыта</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Статус соревнования:{" "}
              <Badge variant="outline">
                {competition.status === "REGISTRATION_CLOSED"
                  ? "Регистрация закрыта"
                  : competition.status === "IN_PROGRESS"
                    ? "Идет соревнование"
                    : competition.status === "COMPLETED"
                      ? "Завершено"
                      : competition.status}
              </Badge>
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/competitions/${competition.id}`}>
              <Button variant="outline">Подробнее о соревновании</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle>{competition.title}</CardTitle>
          <CardDescription>Регистрация на соревнование</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>
                    Регистрация: {new Date(competition.registrationStart).toLocaleDateString()} -{" "}
                    {new Date(competition.registrationEnd).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>
                    Проведение: {new Date(competition.eventStart).toLocaleDateString()} -{" "}
                    {new Date(competition.eventEnd).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{competition.region}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Организатор: {competition.organizer.name}</span>
                </div>
                <div className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Контакт: {competition.organizer.email}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>
                    Участников: {competition.currentParticipants} / {competition.maxParticipants || "∞"}
                  </span>
                </div>
              </div>
            </div>

            {isAlreadyRegistered ? (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                <p className="text-green-700 dark:text-green-300">
                  Вы уже зарегистрированы на это соревнование. Вы можете просмотреть детали в своем профиле.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <p className="text-blue-700 dark:text-blue-300">
                  Нажимая кнопку "Зарегистрироваться", вы соглашаетесь с правилами соревнования и подтверждаете свое
                  участие.
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Link href={`/competitions/${competition.id}`}>
            <Button variant="outline">Подробнее о соревновании</Button>
          </Link>
          {isAlreadyRegistered ? (
            <Link href="/profile/competitions">
              <Button>Перейти к моим соревнованиям</Button>
            </Link>
          ) : (
            <Button onClick={handleRegister} disabled={isRegistering}>
              {isRegistering ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
