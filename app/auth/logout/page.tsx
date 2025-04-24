"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"

export default function LogoutPage() {
  useEffect(() => {
    // Auto-logout after 3 seconds
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/" })
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            <CardTitle className="text-2xl font-bold">Выход из системы</CardTitle>
          </div>
          <CardDescription>Вы будете автоматически выведены из системы через несколько секунд.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Если вы не будете перенаправлены автоматически, нажмите кнопку ниже.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={() => signOut({ callbackUrl: "/" })} className="w-full">
            Выйти сейчас
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              На главную
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
