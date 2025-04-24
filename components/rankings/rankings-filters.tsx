"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"

interface RankingsFiltersProps {
  onFilterChange: (filters: {
    search: string
    discipline: string
    region: string
    period: string
  }) => void
}

export function RankingsFilters({ onFilterChange }: RankingsFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    discipline: "",
    region: "",
    period: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const handleReset = () => {
    const resetFilters = {
      search: "",
      discipline: "",
      region: "",
      period: "",
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Поиск</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                name="search"
                placeholder="Поиск по имени"
                className="pl-8"
                value={filters.search}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discipline">Вид спорта</Label>
            <Select value={filters.discipline} onValueChange={(value) => handleSelectChange("discipline", value)}>
              <SelectTrigger id="discipline">
                <SelectValue placeholder="Все виды спорта" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все виды спорта</SelectItem>
                <SelectItem value="Футбол">Футбол</SelectItem>
                <SelectItem value="Баскетбол">Баскетбол</SelectItem>
                <SelectItem value="Волейбол">Волейбол</SelectItem>
                <SelectItem value="Теннис">Теннис</SelectItem>
                <SelectItem value="Плавание">Плавание</SelectItem>
                <SelectItem value="Лёгкая атлетика">Лёгкая атлетика</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Регион</Label>
            <Select value={filters.region} onValueChange={(value) => handleSelectChange("region", value)}>
              <SelectTrigger id="region">
                <SelectValue placeholder="Все регионы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все регионы</SelectItem>
                <SelectItem value="Москва">Москва</SelectItem>
                <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                <SelectItem value="Новосибирск">Новосибирск</SelectItem>
                <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
                <SelectItem value="Казань">Казань</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="period">Период</Label>
            <Select value={filters.period} onValueChange={(value) => handleSelectChange("period", value)}>
              <SelectTrigger id="period">
                <SelectValue placeholder="За все время" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">За все время</SelectItem>
                <SelectItem value="month">За месяц</SelectItem>
                <SelectItem value="year">За год</SelectItem>
                <SelectItem value="season">За сезон</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={handleReset}>
            Сбросить
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
