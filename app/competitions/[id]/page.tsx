import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock, Info } from "lucide-react"
import { CompetitionTeams } from "@/components/competitions/competition-teams"
import { CompetitionResults } from "@/components/competitions/competition-results"
import sql from "@/lib/db"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Детали соревнования | Платформа соревнований",
  description: "Подробная информация о соревновании",
}

async function getCompetition(id: string) {
  try {
    const query = `
      SELECT c.*, u.name as organizer_name, u.email as organizer_email
      FROM "Competition" c
      LEFT JOIN "User" u ON c."organizerId" = u.id
      WHERE c.id = $1
    `

    const result = await sql(query, [id])

    if (result.length === 0) {
      return null
    }

    const competition = result[0]

    // Get teams for this competition
    const teamsQuery = `
      SELECT t.*, u.name as captain_name
      FROM "Team" t
      LEFT JOIN "User" u ON t."captainId" = u.id
      WHERE t."competitionId" = $1
    `

    const teamsResult = await sql(teamsQuery, [id])

    // Format the response
    return {
      id: competition.id,
      title: competition.title,
      type: competition.type,
      discipline: competition.discipline,
      description: competition.description,
      rules: competition.rules,
      prizes: competition.prizes,
      region: competition.region,
      registrationStart: competition.registrationStart,
      registrationEnd: competition.registrationEnd,
      eventStart: competition.eventStart,
      eventEnd: competition.eventEnd,
      maxParticipants: competition.maxParticipants,
      currentParticipants: competition.currentParticipants || 0,
      status: competition.status,
      createdAt: competition.createdAt,
      updatedAt: competition.updatedAt,
      organizer: {
        id: competition.organizerId,
        name: competition.organizer_name,
        email: competition.organizer_email,
      },
      teams: teamsResult.map((team: any) => ({
        id: team.id,
        name: team.name,
        status: team.status,
        captain: {
          id: team.captainId,
          name: team.captain_name,
        },
      })),
    }
  } catch (error) {
    console.error("Error fetching competition:", error)
    return null
  }
}

export default async function CompetitionDetailsPage({ params }: { params: { id: string } }) {
  const competition = await getCompetition(params.id)

  if (!competition) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REGISTRATION_OPEN":
        return <Badge variant="default">Открыта регистрация</Badge>
      case "REGISTRATION_CLOSED":
        return <Badge variant="secondary">Регистрация закрыта</Badge>
      case "IN_PROGRESS":
        return (
          <Badge variant="default" className="bg-green-600">
            Идет соревнование
          </Badge>
        )
      case "COMPLETED":
        return <Badge variant="outline">Завершено</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "FEDERAL":
        return <Badge variant="default">Федеральное</Badge>
      case "REGIONAL":
        return <Badge variant="secondary">Региональное</Badge>
      case "OPEN":
        return <Badge variant="outline">Открытое</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // Функция для расчета дней до начала регистрации
  const getDaysUntilRegistration = () => {
    const now = new Date()
    const regStart = new Date(competition.registrationStart)
    const diffTime = regStart.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {getTypeBadge(competition.type)}
            <Badge variant="outline">{competition.discipline}</Badge>
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              {competition.status === "REGISTRATION_OPEN"
                ? "Открыта регистрация"
                : competition.status === "REGISTRATION_CLOSED"
                  ? "Регистрация закрыта"
                  : competition.status === "IN_PROGRESS"
                    ? "Идет соревнование"
                    : competition.status === "COMPLETED"
                      ? "Завершено"
                      : competition.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{competition.title}</h1>
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
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>
                  Участников: {competition.currentParticipants} / {competition.maxParticipants || "∞"}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Организатор: {competition.organizer.name || "Не указан"}</span>
              </div>
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Контакт: {competition.organizer.email || "Не указан"}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>До начала регистрации: {getDaysUntilRegistration()} дней</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {competition.status === "REGISTRATION_OPEN" && (
              <Link href={`/competitions/register/${competition.id}`}>
                <Button>Зарегистрироваться</Button>
              </Link>
            )}
            <Button variant="outline">Создать команду</Button>
            <Button variant="outline">Найти команду</Button>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="info">Информация</TabsTrigger>
            <TabsTrigger value="rules">Правила</TabsTrigger>
            <TabsTrigger value="teams">Команды</TabsTrigger>
            <TabsTrigger value="results">Результаты</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="mt-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3>Описание соревнования</h3>
              {competition.description ? (
                competition.description.split("\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>Описание отсутствует</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="rules" className="mt-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3>Правила соревнования</h3>
              {competition.rules ? (
                competition.rules.split("\n").map((rule, index) => <p key={index}>{rule}</p>)
              ) : (
                <p>Правила отсутствуют</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="teams" className="mt-6">
            <CompetitionTeams competitionId={competition.id} />
          </TabsContent>
          <TabsContent value="results" className="mt-6">
            <CompetitionResults competitionId={competition.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
