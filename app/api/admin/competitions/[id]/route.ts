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

    // Получаем соревнование по ID
    const result = await sql`
      SELECT * FROM "Competition"
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Competition not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching competition:", error)
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
    const {
      title,
      type,
      discipline,
      description,
      rules,
      prizes,
      region,
      registrationStart,
      registrationEnd,
      eventStart,
      eventEnd,
      maxParticipants,
      status,
      organizerId,
    } = data

    // Обновляем соревнование
    const now = new Date()

    const result = await sql`
      UPDATE "Competition"
      SET 
        title = ${title},
        type = ${type},
        discipline = ${discipline},
        description = ${description},
        rules = ${rules},
        prizes = ${prizes},
        region = ${region},
        "registrationStart" = ${new Date(registrationStart)},
        "registrationEnd" = ${new Date(registrationEnd)},
        "eventStart" = ${new Date(eventStart)},
        "eventEnd" = ${new Date(eventEnd)},
        "maxParticipants" = ${maxParticipants},
        status = ${status},
        "organizerId" = ${organizerId},
        "updatedAt" = ${now}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Competition not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating competition:", error)
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

    // Удаляем соревнование
    await sql`
      DELETE FROM "Competition"
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting competition:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
