"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Save, Plus, Trash2 } from "lucide-react"

interface PortfolioItem {
  id: string
  title: string
  description: string
  date: string
  link?: string
}

export function ProfilePortfolio({ userId }: { userId: string }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    link: "",
  })

  useEffect(() => {
    if (userId) {
      fetchPortfolio()
    }
  }, [userId])

  const fetchPortfolio = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/users/${userId}/portfolio`)
      if (response.ok) {
        const data = await response.json()
        setPortfolio(data)
      } else {
        throw new Error("Failed to fetch portfolio")
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить портфолио",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      description: item.description,
      date: item.date,
      link: item.link || "",
    })
  }

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      link: "",
    })
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        // Update existing item
        const response = await fetch(`/api/users/${userId}/portfolio/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          setPortfolio((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
          toast({
            title: "Успешно",
            description: "Запись портфолио обновлена",
          })
        } else {
          throw new Error("Failed to update portfolio item")
        }
      } else {
        // Add new item
        const response = await fetch(`/api/users/${userId}/portfolio`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const newItem = await response.json()
          setPortfolio((prev) => [...prev, newItem])
          toast({
            title: "Успешно",
            description: "Запись добавлена в портфолио",
          })
        } else {
          throw new Error("Failed to add portfolio item")
        }
      }
    } catch (error) {
      console.error("Error saving portfolio item:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить запись портфолио",
        variant: "destructive",
      })
    } finally {
      setEditingId(null)
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/portfolio/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPortfolio((prev) => prev.filter((item) => item.id !== id))
        toast({
          title: "Успешно",
          description: "Запись удалена из портфолио",
        })
      } else {
        throw new Error("Failed to delete portfolio item")
      }
    } catch (error) {
      console.error("Error deleting portfolio item:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить запись портфолио",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsAdding(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Мое портфолио</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-3/4 bg-muted animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-20 w-full bg-muted animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Mock data until API is ready
  const mockPortfolio: PortfolioItem[] = [
    {
      id: "port_1",
      title: "Победа в региональном чемпионате",
      description: "Занял первое место в региональном чемпионате по программированию среди студентов.",
      date: "2023-05-15",
      link: "https://example.com/championship",
    },
    {
      id: "port_2",
      title: "Участие в международном хакатоне",
      description: "Был частью команды, занявшей 3 место на международном хакатоне по разработке мобильных приложений.",
      date: "2023-08-20",
    },
  ]

  const displayPortfolio = portfolio.length > 0 ? portfolio : mockPortfolio

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Мое портфолио</h3>
        {!isAdding && !editingId && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить запись
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Редактирование записи" : "Новая запись"}</CardTitle>
            <CardDescription>
              {editingId ? "Измените информацию о достижении" : "Добавьте новое достижение в портфолио"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Введите название достижения"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Опишите ваше достижение"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Дата</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Ссылка (необязательно)</Label>
              <Input
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="Ссылка на подтверждение достижения"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {displayPortfolio.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{item.title}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{new Date(item.date).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{item.description}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline mt-2 inline-block"
                >
                  Подробнее
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {displayPortfolio.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold mb-2">Ваше портфолио пусто</h3>
          <p className="text-muted-foreground mb-6">Добавьте свои достижения и опыт</p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить запись
          </Button>
        </div>
      )}
    </div>
  )
}
