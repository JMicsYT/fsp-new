"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, UserPlus, UserMinus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export function AdminTeams() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMemberDialog, setShowMemberDialog] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [memberEmail, setMemberEmail] = useState("")

  // Mock data for teams
  const teams = [
    {
      id: "team_1",
      name: "Динамо",
      competitionTitle: "Всероссийский турнир по футболу",
      captainName: "Иван Петров",
      memberCount: 2,
      status: "CONFIRMED",
      region: "Москва",
    },
    {
      id: "team_2",
      name: "Спартак",
      competitionTitle: "Всероссийский турнир по футболу",
      captainName: "Анна Сидорова",
      memberCount: 2,
      status: "CONFIRMED",
      region: "Москва",
    },
    {
      id: "team_3",
      name: "ЦСКА",
      competitionTitle: "Московский городской турнир по баскетболу",
      captainName: "Дмитрий Волков",
      memberCount: 1,
      status: "CONFIRMED",
      region: "Москва",
    },
    {
      id: "team_4",
      name: "Зенит",
      competitionTitle: "Открытый кубок по волейболу",
      captainName: "Елена Смирнова",
      memberCount: 1,
      status: "NEEDS_MEMBERS",
      region: "Санкт-Петербург",
    },
  ]

  // Filter teams based on search query
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.competitionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.captainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.region.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteTeam = (team: any) => {
    setSelectedTeam(team)
    setShowDeleteDialog(true)
  }

  const confirmDeleteTeam = () => {
    // In a real app, this would make an API call to delete the team
    toast({
      title: "Команда удалена",
      description: `Команда "${selectedTeam.name}" была успешно удалена`,
    })
    setShowDeleteDialog(false)
  }

  const handleAddMember = (team: any) => {
    setSelectedTeam(team)
    setMemberEmail("")
    setShowMemberDialog(true)
  }

  const handleRemoveMember = (team: any) => {
    // In a real app, this would show a dialog to select which member to remove
    toast({
      title: "Участник удален",
      description: `Участник был удален из команды "${team.name}"`,
    })
  }

  const confirmAddMember = () => {
    // In a real app, this would make an API call to add a member to the team
    if (!memberEmail) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите email участника",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Участник добавлен",
      description: `Участник с email ${memberEmail} был добавлен в команду "${selectedTeam.name}"`,
    })
    setShowMemberDialog(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="default">Подтверждена</Badge>
      case "NEEDS_MEMBERS":
        return <Badge variant="secondary">Требуются участники</Badge>
      case "PENDING":
        return <Badge variant="outline">На модерации</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск команд..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Соревнование</TableHead>
            <TableHead>Капитан</TableHead>
            <TableHead>Участников</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Регион</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell>{team.competitionTitle}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{team.captainName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{team.captainName}</span>
                </div>
              </TableCell>
              <TableCell>{team.memberCount}/3</TableCell>
              <TableCell>{getStatusBadge(team.status)}</TableCell>
              <TableCell>{team.region}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/teams/${team.id}`}>
                    <Button variant="ghost" size="icon" title="Просмотр">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" title="Добавить участника" onClick={() => handleAddMember(team)}>
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Удалить участника"
                    onClick={() => handleRemoveMember(team)}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Удалить команду" onClick={() => handleDeleteTeam(team)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Team Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление команды</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить команду "{selectedTeam?.name}"? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTeam}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавление участника</DialogTitle>
            <DialogDescription>
              Введите email пользователя, которого вы хотите добавить в команду "{selectedTeam?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email пользователя</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMemberDialog(false)}>
              Отмена
            </Button>
            <Button onClick={confirmAddMember}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { Label } from "@/components/ui/label"
