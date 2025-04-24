"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export function UserNav() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Если страница загружается на сервере или сессия загружается, показываем скелетон
  if (!isClient || status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
      </div>
    )
  }

  // Если пользователь не аутентифицирован
  if (status === "unauthenticated") {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            Войти
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button size="sm">Регистрация</Button>
        </Link>
      </div>
    )
  }

  // Определяем URL профиля в зависимости от роли пользователя
  const getProfileUrl = () => {
    if (session?.user?.role === "ADMIN") {
      return "/admin"
    } else if (session?.user?.role === "ORGANIZER") {
      return "/organizer"
    } else {
      return "/profile"
    }
  }

  // Обработчик выхода из системы
  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session?.user?.image || "/placeholder.svg?height=32&width=32"}
              alt={session?.user?.name || ""}
            />
            <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(getProfileUrl())}>Профиль</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/profile/teams")}>Мои команды</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/profile/competitions")}>Мои соревнования</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/profile/settings")}>Настройки</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Выйти</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
