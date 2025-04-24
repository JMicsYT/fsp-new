"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"

interface Team {
  id: string
  name: string
  competitionId: string
  competitionTitle: string
  captainId: string
  captainName: string
  membersCount: number
  status: string
}

export function TeamsList() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    if (teams.length > 0) {
      applyFilters()
    }
  }, [searchParams, teams])

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams")
      if (response.ok) {
        const data = await response.json()
        setTeams(data)
        setFilteredTeams(data)
      } else {
        throw new Error("Failed to fetch teams")
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить команды",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...teams]

    // Поиск по названию
    const search = searchParams.get("search")
    if (search) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(search.toLowerCase()) ||
          team.competitionTitle.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Фильтр по статусу
    const status = searchParams.get("status")
    if (status) {
      filtered = filtered.filter((team) => team.status === status)
    }

    // Фильтр по соревнованию
    const competitionId = searchParams.get("competitionId")
    if (competitionId) {
      filtered = filtered.filter((team) => team.competitionId === competitionId)
    }

    setFilteredTeams(filtered)
  }

  // Проверка прав доступа к управлению командой
  const canManageTeam = (team: Team) => {
    if (!session) return false

    // Администратор может управлять любой командой
    if (session.user.role === "ADMIN") return true

    // Организатор может управлять командами своих соревнований
    // (в реальном приложении нужно проверить, является ли пользователь организатором соревнования)
    if (session.user.role === "ORGANIZER") return true

    // Капитан может управлять своей командой
    return session.user.id === team.captainId
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
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

  if (filteredTeams.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold mb-2">Команды не найдены</h3>
        <p className="text-muted-foreground mb-6">В системе пока нет зарегистрированных команд</p>
        <Link href="/teams/create">
          <Button>Создать команду</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTeams.map((team) => (
        <Card key={team.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{team.name}</CardTitle>
              <Badge variant={team.status === "CONFIRMED" ? "default" : "outline"}>
                {team.status === "CONFIRMED"
                  ? "Подтверждена"
                  : team.status === "PENDING"
                    ? "На рассмотрении"
                    : team.status === "NEEDS_MEMBERS"
                      ? "Набор участников"
                      : "Отклонена"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Соревнование:</p>
                <p className="font-medium">{team.competitionTitle}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Капитан:</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={team.captainName} />
                    <AvatarFallback>{team.captainName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{team.captainName}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Участников: {team.membersCount}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            {canManageTeam(team) ? (
              <Link href={`/teams/${team.id}/manage`} className="w-full">
                <Button className="w-full" variant="default">
                  Управление командой
                </Button>
              </Link>
            ) : (
              <Link href={`/teams/${team.id}`} className="w-full">
                <Button className="w-full" variant="outline">
                  Просмотр команды
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
