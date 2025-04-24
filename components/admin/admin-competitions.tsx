"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, Eye, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Competition {
  id: string
  title: string
  type: string
  status: string
  eventStart: string
  eventEnd: string
  region: string
  teamsCount: number
}

export function AdminCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCompetitions()
  }, [])

  const fetchCompetitions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/competitions")
      if (response.ok) {
        const data = await response.json()
        setCompetitions(data)
      } else {
        throw new Error("Failed to fetch competitions")
      }
    } catch (error) {
      console.error("Error fetching competitions:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить соревнования",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/admin/competitions/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCompetitions((prev) => prev.filter((comp) => comp.id !== deleteId))
        toast({
          title: "Успешно",
          description: "Соревнование удалено",
        })
      } else {
        throw new Error("Failed to delete competition")
      }
    } catch (error) {
      console.error("Error deleting competition:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить соревнование",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredCompetitions = competitions.filter((competition) =>
    competition.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
      case "DRAFT":
        return <Badge variant="outline">Черновик</Badge>
      case "MODERATION":
        return <Badge variant="secondary">На модерации</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Отменено</Badge>
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="border rounded-md">
          <div className="p-4">
            <Skeleton className="h-10 w-full" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border-t">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск соревнований..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Link href="/admin/competitions/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Создать соревнование
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Даты проведения</TableHead>
            <TableHead>Регион</TableHead>
            <TableHead>Команд</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompetitions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Соревнования не найдены
              </TableCell>
            </TableRow>
          ) : (
            filteredCompetitions.map((competition) => (
              <TableRow key={competition.id}>
                <TableCell className="font-medium">{competition.title}</TableCell>
                <TableCell>{getTypeBadge(competition.type)}</TableCell>
                <TableCell>{getStatusBadge(competition.status)}</TableCell>
                <TableCell>
                  {new Date(competition.eventStart).toLocaleDateString()} -{" "}
                  {new Date(competition.eventEnd).toLocaleDateString()}
                </TableCell>
                <TableCell>{competition.region}</TableCell>
                <TableCell>{competition.teamsCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/competitions/${competition.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> Просмотр
                      </Button>
                    </Link>
                    <Link href={`/admin/competitions/${competition.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" /> Редактировать
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(competition.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Удалить
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Соревнование будет удалено вместе со всеми связанными данными.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
