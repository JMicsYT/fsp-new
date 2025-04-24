import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Проверяем авторизацию и роль
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Получаем все соревнования
    const result = await sql`
      SELECT 
        c.id, 
        c.title, 
        c.type, 
        c.status, 
        c."eventStart", 
        c."eventEnd", 
        c.region,
        (SELECT COUNT(*) FROM "Team" t WHERE t."competitionId" = c.id) as "teamsCount"
      FROM "Competition" c
      ORDER BY c."createdAt" DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching competitions:", error)
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

    // Создаем новое соревнование
    const id = `comp_${Date.now()}`
    const now = new Date()

    const result = await sql`
      INSERT INTO "Competition" (
        id, title, type, discipline, description, rules, prizes, region, 
        "registrationStart", "registrationEnd", "eventStart", "eventEnd", 
        "maxParticipants", status, "organizerId", "createdAt", "updatedAt"
      )
      VALUES (
        ${id}, ${title}, ${type}, ${discipline}, ${description}, ${rules}, ${prizes}, ${region},
        ${new Date(registrationStart)}, ${new Date(registrationEnd)}, ${new Date(eventStart)}, ${new Date(eventEnd)},
        ${maxParticipants}, ${status}, ${organizerId}, ${now}, ${now}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating competition:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
