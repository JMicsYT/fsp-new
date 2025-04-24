"use client"

import { CardFooter } from "@/components/ui/card"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamInvites } from "@/components/teams/team-invites"
import { TeamRequests } from "@/components/teams/team-requests"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function TeamPage() {
  const params = useParams()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [team, setTeam] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/teams/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setTeam(data)
        } else {
          throw new Error("Failed to fetch team")
        }
      } catch (error) {
        console.error("Error fetching team:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные команды",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTeam()
    }
  }, [params.id, toast])

  if (loading) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Загрузка данных команды...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    notFound()
  }

  // В реальном приложении данные буд��т загружаться из API
  const mockTeam = {
    id: 1,
    name: "Алгоритмические гении",
    competition: {
      id: 1,
      title: "Всероссийская олимпиада по программированию",
    },
    captain: {
      id: 101,
      name: "Иван Петров",
      avatar: "/avatars/01.png",
    },
    members: [
      {
        id: 101,
        name: "Иван Петров",
        avatar: "/avatars/01.png",
      },
      {
        id: 102,
        name: "Анна Сидорова",
        avatar: "/avatars/02.png",
      },
      {
        id: 103,
        name: "Михаил Иванов",
        avatar: "/avatars/03.png",
      },
    ],
    status: "Подтверждена", // Подтверждена, На модерации, Требуются участники
    invites: [
      {
        id: 1,
        user: {
          id: 201,
          name: "Елена Смирнова",
          avatar: "/avatars/04.png",
        },
        status: "Ожидает ответа", // Ожидает ответа, Принято, Отклонено
        date: "2023-11-15",
      },
    ],
    requests: [
      {
        id: 1,
        user: {
          id: 301,
          name: "Дмитрий Волков",
          avatar: "/avatars/07.png",
        },
        status: "Ожидает ответа", // Ожидает ответа, Принято, Отклонено
        date: "2023-11-16",
      },
      {
        id: 2,
        user: {
          id: 302,
          name: "Мария Кузнецова",
          avatar: "/avatars/08.png",
        },
        status: "Ожидает ответа",
        date: "2023-11-17",
      },
    ],
  }

  const displayTeam = team || mockTeam

  // Determine if current user is captain
  const isCurrentUserCaptain = session?.user?.id === String(displayTeam.captain.id)

  // Determine if user can manage team (admin, organizer, or captain)
  const canManageTeam = session?.user?.role === "ADMIN" || session?.user?.role === "ORGANIZER" || isCurrentUserCaptain

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={
                displayTeam.status === "Подтверждена"
                  ? "default"
                  : displayTeam.status === "На модерации"
                    ? "secondary"
                    : "outline"
              }
            >
              {displayTeam.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{displayTeam.name}</h1>
          <p className="text-muted-foreground">
            Команда для соревнования:{" "}
            <Link href={`/competitions/${displayTeam.competition.id}`} className="hover:underline">
              {displayTeam.competition.title}
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Информация о команде</CardTitle>
              <CardDescription>Состав и статус команды</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Капитан:</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={displayTeam.captain.avatar || "/placeholder.svg"}
                      alt={displayTeam.captain.name}
                    />
                    <AvatarFallback>{displayTeam.captain.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{displayTeam.captain.name}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Участники ({displayTeam.members.length}/3):</p>
                <div className="flex flex-col gap-2 mt-1">
                  {displayTeam.members.map((member: any) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  ))}
                  {displayTeam.members.length < 3 && (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs">+</span>
                      </div>
                      <span className="text-muted-foreground">Свободное место</span>
                    </div>
                  )}
                </div>
              </div>
              {canManageTeam && displayTeam.members.length < 3 && (
                <Button className="w-full">Пригласить участника</Button>
              )}
            </CardContent>
          </Card>

          {canManageTeam ? (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Управление командой</CardTitle>
                <CardDescription>Приглашения и заявки на вступление</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="invites">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="invites">Приглашения</TabsTrigger>
                    <TabsTrigger value="requests">Заявки</TabsTrigger>
                  </TabsList>
                  <TabsContent value="invites" className="mt-6">
                    <TeamInvites
                      teamId={displayTeam.id}
                      invites={displayTeam.invites}
                      isCurrentUserCaptain={canManageTeam}
                    />
                  </TabsContent>
                  <TabsContent value="requests" className="mt-6">
                    <TeamRequests
                      teamId={displayTeam.id}
                      requests={displayTeam.requests}
                      isCurrentUserCaptain={canManageTeam}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Информация о соревновании</CardTitle>
                <CardDescription>Детали соревнования, в котором участвует команда</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Команда <strong>{displayTeam.name}</strong> участвует в соревновании{" "}
                    <Link href={`/competitions/${displayTeam.competition.id}`} className="text-primary hover:underline">
                      {displayTeam.competition.title}
                    </Link>
                  </p>
                  <p>
                    Статус команды: <Badge>{displayTeam.status}</Badge>
                  </p>
                  <p>Для получения дополнительной информации о соревновании, перейдите на страницу соревнования</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/competitions/${displayTeam.competition.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Перейти к соревнованию
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>

        {canManageTeam && (
          <div className="flex justify-end gap-4">
            <Button variant="outline">Редактировать команду</Button>
            <Button variant="destructive">Расформировать команду</Button>
          </div>
        )}
      </div>
    </div>
  )
}
