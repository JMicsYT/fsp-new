import { NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email и код подтверждения обязательны" }, { status: 400 })
    }

    // Отправляем email с кодом подтверждения
    const sent = await sendVerificationEmail(email, code)

    if (sent) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Не удалось отправить email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending verification email:", error)
    return NextResponse.json({ error: "Ошибка сервера при отправке email" }, { status: 500 })
  }
}
