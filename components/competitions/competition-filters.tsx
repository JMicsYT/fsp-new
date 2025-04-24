"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const sportTypes = [
  { value: "all", label: "Все виды спорта" },
  { value: "running", label: "Бег" },
  { value: "swimming", label: "Плавание" },
  { value: "cycling", label: "Велоспорт" },
  { value: "triathlon", label: "Триатлон" },
  { value: "skiing", label: "Лыжи" },
]

const regions = [
  { value: "all", label: "Все регионы" },
  { value: "moscow", label: "Москва" },
  { value: "spb", label: "Санкт-Петербург" },
  { value: "krasnodar", label: "Краснодарский край" },
  { value: "sochi", label: "Сочи" },
]

const statuses = [
  { value: "all", label: "Все статусы" },
  { value: "upcoming", label: "Предстоящие" },
  { value: "ongoing", label: "Текущие" },
  { value: "completed", label: "Завершенные" },
]

export function CompetitionFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [sportType, setSportType] = useState(searchParams.get("sportType") || "all")
  const [region, setRegion] = useState(searchParams.get("region") || "all")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date") as string) : undefined,
  )

  // Создаем новый URLSearchParams объект на основе текущих параметров
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      // Обновляем параметры
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, value)
        }
      })

      return newSearchParams.toString()
    },
    [searchParams],
  )

  // Обновляем URL при изменении фильтров
  useEffect(() => {
    const queryString = createQueryString({
      sportType: sportType === "all" ? null : sportType,
      region: region === "all" ? null : region,
      status: status === "all" ? null : status,
      date: date ? date.toISOString().split("T")[0] : null,
    })

    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false })
  }, [sportType, region, status, date, pathname, router, createQueryString])

  // Сбросить все фильтры
  const resetFilters = () => {
    setSportType("all")
    setRegion("all")
    setStatus("all")
    setDate(undefined)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full sm:w-[200px] justify-between">
              {sportType ? sportTypes.find((type) => type.value === sportType)?.label : "Выберите вид спорта"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full sm:w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Поиск вида спорта..." />
              <CommandList>
                <CommandEmpty>Не найдено.</CommandEmpty>
                <CommandGroup>
                  {sportTypes.map((type) => (
                    <CommandItem
                      key={type.value}
                      value={type.value}
                      onSelect={(currentValue) => {
                        setSportType(currentValue)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", sportType === type.value ? "opacity-100" : "opacity-0")} />
                      {type.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full sm:w-[200px] justify-between">
              {region ? regions.find((r) => r.value === region)?.label : "Выберите регион"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full sm:w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Поиск региона..." />
              <CommandList>
                <CommandEmpty>Не найдено.</CommandEmpty>
                <CommandGroup>
                  {regions.map((r) => (
                    <CommandItem
                      key={r.value}
                      value={r.value}
                      onSelect={(currentValue) => {
                        setRegion(currentValue)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", region === r.value ? "opacity-100" : "opacity-0")} />
                      {r.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full sm:w-[200px] justify-between">
              {status ? statuses.find((s) => s.value === status)?.label : "Выберите статус"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full sm:w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Поиск статуса..." />
              <CommandList>
                <CommandEmpty>Не найдено.</CommandEmpty>
                <CommandGroup>
                  {statuses.map((s) => (
                    <CommandItem
                      key={s.value}
                      value={s.value}
                      onSelect={(currentValue) => {
                        setStatus(currentValue)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", status === s.value ? "opacity-100" : "opacity-0")} />
                      {s.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ru }) : "Выберите дату"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ru} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={resetFilters}>
          Сбросить фильтры
        </Button>
      </div>
    </div>
  )
}
