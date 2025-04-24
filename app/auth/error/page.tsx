"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorMessage = "Произошла ошибка при аутентификации."
  let errorDescription = "Пожалуйста, попробуйте снова или обратитесь к администратору."

  switch (error) {
    case "CredentialsSignin":
      errorMessage = "Неверные учетные данные"
      errorDescription = "Проверьте правильность введенного email и пароля."
      break
    case "AccessDenied":
      errorMessage = "Доступ запрещен"
      errorDescription = "У вас нет прав для доступа к этому ресурсу."
      break
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
    case "EmailCreateAccount":
    case "Callback":
    case "OAuthAccountNotLinked":
    case "EmailSignin":
    case "CredentialsSignup":
    case "SessionRequired":
      errorMessage = "Ошибка аутентификации"
      errorDescription = "Произошла ошибка при попытке входа. Пожалуйста, попробуйте снова."
      break
    default:
      break
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-2xl font-bold">{errorMessage}</CardTitle>
          </div>
          <CardDescription>{errorDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Если проблема не устраняется, обратитесь в службу поддержки.</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full">Вернуться на страницу входа</Button>
          </Link>
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
