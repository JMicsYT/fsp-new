import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Проверяем авторизацию и роль
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Получаем пользователя по ID
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
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Проверяем авторизацию и роль
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const data = await request.json()
    const { name, email, role, region, status } = data

    // Обновляем пользователя
    const now = new Date()

    const result = await sql`
      UPDATE "User"
      SET 
        name = ${name},
        email = ${email},
        role = ${role},
        region = ${region},
        status = ${status},
        "updatedAt" = ${now}
      WHERE id = ${id}
      RETURNING id, name, email, role, region, "createdAt" as "registrationDate", status
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Проверяем авторизацию и роль
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Удаляем пользователя
    await sql`
      DELETE FROM "User"
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
