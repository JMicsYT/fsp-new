"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import bcrypt from "bcryptjs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Список регионов России
const russianRegions = [
  "Москва",
  "Санкт-Петербург",
  "Республика Адыгея",
  "Республика Алтай",
  "Республика Башкортостан",
  "Республика Бурятия",
  "Республика Дагестан",
  "Республика Ингушетия",
  "Кабардино-Балкарская Республика",
  "Республика Калмыкия",
  "Карачаево-Черкесская Республика",
  "Республика Карелия",
  "Республика Коми",
  "Республика Крым",
  "Республика Марий Эл",
  "Республика Мордовия",
  "Республика Саха (Якутия)",
  "Республика Северная Осетия — Алания",
  "Республика Татарстан",
  "Республика Тыва",
  "Удмуртская Республика",
  "Республика Хакасия",
  "Чеченская Республика",
  "Чувашская Республика",
  "Алтайский край",
  "Забайкальский край",
  "Камчатский край",
  "Краснодарский край",
  "Красноярский край",
  "Пермский край",
  "Приморский край",
  "Ставропольский край",
  "Хабаровский край",
  "Амурская область",
  "Архангельская область",
  "Астраханская область",
  "Белгородская область",
  "Брянская область",
  "Владимирская область",
  "Волгоградская область",
  "Вологодская область",
  "Воронежская область",
  "Ивановская область",
  "Иркутская область",
  "Калининградская область",
  "Калужская область",
  "Кемеровская область",
  "Кировская область",
  "Костромская область",
  "Курганская область",
  "Курская область",
  "Ленинградская область",
  "Липецкая область",
  "Магаданская область",
  "Московская область",
  "Мурманская область",
  "Нижегородская область",
  "Новгородская область",
  "Новосибирская область",
  "Омская область",
  "Оренбургская область",
  "Орловская область",
  "Пензенская область",
  "Псковская область",
  "Ростовская область",
  "Рязанская область",
  "Самарская область",
  "Саратовская область",
  "Сахалинская область",
  "Свердловская область",
  "Смоленская область",
  "Тамбовская область",
  "Тверская область",
  "Томская область",
  "Тульская область",
  "Тюменская область",
  "Ульяновская область",
  "Челябинская область",
  "Ярославская область",
  "Севастополь",
  "Еврейская автономная область",
  "Ненецкий автономный округ",
  "Ханты-Мансийский автономный округ — Югра",
  "Чукотский автономный округ",
  "Ямало-Ненецкий автономный округ",
]

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [verificationStep, setVerificationStep] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [expectedCode, setExpectedCode] = useState("")
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ATHLETE", // Default role
    region: "",
    organization: "",
  })

  useEffect(() => {
    // Проверяем совпадение паролей при изменении любого из полей
    if (formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword)
    } else {
      setPasswordsMatch(true) // Не показываем ошибку, если поле подтверждения пустое
    }
  }, [formData.password, formData.confirmPassword])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value)
  }

  const sendVerificationEmail = async () => {
    try {
      setIsLoading(true)
      // Генерируем случайный 6-значный код
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setExpectedCode(code)

      // Отправляем код на email через API
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Не удалось отправить код подтверждения")
      }

      toast({
        title: "Код отправлен",
        description: `Код подтверждения отправлен на ${formData.email}`,
      })

      setVerificationStep(true)
    } catch (error: any) {
      console.error("Error sending verification email:", error)

      // В режиме разработки можно пропустить проверку email
      if (process.env.NODE_ENV === "development") {
        toast({
          title: "Режим разработки",
          description: "Пропускаем проверку email в режиме разработки",
        })
        setVerificationStep(true)
        return
      }

      toast({
        title: "Ошибка",
        description:
          error.message || "Не удалось отправить код подтверждения. Пожалуйста, проверьте email и попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = () => {
    // В режиме разработки пропускаем проверку кода
    if (process.env.NODE_ENV === "development" || verificationCode === expectedCode) {
      registerUser()
    } else {
      toast({
        title: "Ошибка",
        description: "Неверный код подтверждения. Пожалуйста, проверьте и попробуйте снова.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      })
      return
    }

    // Отправляем код подтверждения
    sendVerificationEmail()
  }

  const registerUser = async () => {
    setIsLoading(true)

    try {
      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(formData.password, 10)

      // Создаем пользователя
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: hashedPassword,
          role: formData.role,
          region: formData.region,
          organization: formData.organization,
          emailVerified: true,
        }),
      })

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Регистрация прошла успешно. Теперь вы можете войти в систему.",
        })
        router.push("/auth/login")
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to register")
      }
    } catch (error: any) {
      console.error("Error registering:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось зарегистрироваться",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (verificationStep) {
    return (
      <div className="container flex min-h-screen items-center justify-center py-8">
        <Card className="mx-auto max-w-md w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Подтверждение email</CardTitle>
            <CardDescription>Введите код, отправленный на ваш email {formData.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Код подтверждения</Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                placeholder="Введите 6-значный код"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button onClick={verifyEmail} className="w-full" disabled={isLoading}>
              {isLoading ? "Проверка..." : "Подтвердить"}
            </Button>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => {
                sendVerificationEmail()
              }}
              disabled={isLoading}
            >
              Отправить код повторно
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-8">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
          <CardDescription>Создайте аккаунт для участия в соревнованиях</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО</Label>
              <Input
                id="name"
                name="name"
                placeholder="Введите ваше полное имя"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Введите ваш email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Подтвердите пароль"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className={!passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {!passwordsMatch && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Пароли не совпадают</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Роль</Label>
              <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATHLETE">Спортсмен</SelectItem>
                  <SelectItem value="ORGANIZER">Организатор</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Регион</Label>
              <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {russianRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Организация</Label>
              <Input
                id="organization"
                name="organization"
                placeholder="Введите вашу организацию"
                value={formData.organization}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading || !passwordsMatch}>
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                Войти
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
