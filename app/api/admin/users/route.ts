import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import sql from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET(request: Request) {
  try {
    // Проверяем авторизацию и роль
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Получаем всех пользователей
    const result = await sql`
      SELECT 
        id, 
        name, 
        email, 
        role, 
        region, 
        "createdAt" as "registrationDate", 
        status
      FROM "User"
      ORDER BY "createdAt" DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Проверяем авторизацию и роль
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { name, email, role, region, status } = data

    // Проверяем, существует ли пользователь с таким email
    const checkResult = await sql`
      SELECT * FROM "User"
      WHERE email = ${email}
    `

    if (checkResult.length > 0) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 })
    }

    // Генерируем временный пароль
    const tempPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Создаем нового пользователя
    const id = `usr_${Date.now()}`
    const now = new Date()

    const result = await sql`
      INSERT INTO "User" (
        id, name, email, password, role, region, status, "emailVerified", "createdAt", "updatedAt"
      )
      VALUES (
        ${id}, ${name}, ${email}, ${hashedPassword}, ${role}, ${region}, ${status}, true, ${now}, ${now}
      )
      RETURNING id, name, email, role, region, status, "createdAt" as "registrationDate"
    `

    // В реальном приложении здесь нужно отправить email с временным паролем

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
