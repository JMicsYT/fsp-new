import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const region = searchParams.get("region")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    // Base query
    let query = sql`
      SELECT c.*, u.name as organizer_name,
      (SELECT COUNT(*) FROM "Registration" r WHERE r."competitionId" = c.id) as registrations_count
      FROM "Competition" c
      LEFT JOIN "User" u ON c."organizerId" = u.id
      WHERE 1=1
    `

    // Add filters if provided
    if (type) {
      query = sql`${query} AND c.type = ${type}`
    }

    if (region) {
      query = sql`${query} AND c.region = ${region}`
    }

    if (status) {
      query = sql`${query} AND c.status = ${status}`
    }

    if (search) {
      const searchTerm = `%${search}%`
      query = sql`${query} AND (c.title ILIKE ${searchTerm} OR c.description ILIKE ${searchTerm})`
    }

    // Add order by
    query = sql`${query} ORDER BY c."eventStart" ASC`

    const result = await query

    // Format the response
    const formattedCompetitions = result.map((comp: any) => ({
      id: comp.id,
      title: comp.title,
      type: comp.type,
      discipline: comp.discipline,
      description: comp.description,
      rules: comp.rules,
      prizes: comp.prizes,
      region: comp.region,
      registrationStart: comp.registrationStart,
      registrationEnd: comp.registrationEnd,
      eventStart: comp.eventStart,
      eventEnd: comp.eventEnd,
      maxParticipants: comp.maxParticipants,
      currentParticipants: comp.currentParticipants,
      status: comp.status,
      organizerId: comp.organizerId,
      organizerName: comp.organizer_name,
      registrationsCount: Number.parseInt(comp.registrations_count) || 0,
      createdAt: comp.createdAt,
      updatedAt: comp.updatedAt,
    }))

    return NextResponse.json(formattedCompetitions)
  } catch (error) {
    console.error("Error fetching competitions:", error)
    return NextResponse.json({ error: "Failed to fetch competitions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Received competition data:", data)

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
      organizerId,
      status = "REGISTRATION_OPEN",
    } = data

    // Создаем уникальный ID для соревнования
    const id = `comp_${Date.now()}`
    const now = new Date().toISOString()

    // Преобразуем даты в правильный формат
    const regStart = new Date(registrationStart).toISOString()
    const regEnd = new Date(registrationEnd).toISOString()
    const evStart = new Date(eventStart).toISOString()
    const evEnd = new Date(eventEnd).toISOString()

    // Создаем новое соревнование
    const query = `
      INSERT INTO "Competition" (
        id, title, type, discipline, description, rules, prizes, region,
        "registrationStart", "registrationEnd", "eventStart", "eventEnd",
        "maxParticipants", "currentParticipants", status, "organizerId", "createdAt", "updatedAt"
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18
      )
      RETURNING *
    `

    const values = [
      id,
      title,
      type,
      discipline,
      description,
      rules,
      prizes,
      region,
      regStart,
      regEnd,
      evStart,
      evEnd,
      maxParticipants,
      0,
      status,
      organizerId,
      now,
      now,
    ]

    console.log("SQL query values:", values)

    const result = await sql(query, values)

    if (result.length === 0) {
      throw new Error("Failed to create competition")
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating competition:", error)
    return NextResponse.json({ error: "Failed to create competition" }, { status: 500 })
  }
}
