import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const competitionId = searchParams.get("competitionId")

    if (!userId || !competitionId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Проверяем, что пользователь запрашивает информацию о себе
    if (userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Проверяем, зарегистрирован ли пользователь на соревнование
    const result = await sql`
      SELECT * FROM "Registration"
      WHERE "userId" = ${userId} AND "competitionId" = ${competitionId}
    `

    return NextResponse.json({ isRegistered: result.length > 0 })
  } catch (error) {
    console.error("Error checking registration:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
