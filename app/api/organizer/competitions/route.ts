import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Получаем соревнования организатора
    const query = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM "Registration" r WHERE r."competitionId" = c.id) as registrations_count
      FROM "Competition" c
      WHERE c."organizerId" = $1
      ORDER BY c."createdAt" DESC
    `

    const result = await sql(query, [userId])

    // Форматируем результат
    const competitions = result.map((comp: any) => ({
      id: comp.id,
      title: comp.title,
      type: comp.type,
      discipline: comp.discipline,
      region: comp.region,
      registrationStart: comp.registrationStart,
      registrationEnd: comp.registrationEnd,
      eventStart: comp.eventStart,
      eventEnd: comp.eventEnd,
      maxParticipants: comp.maxParticipants,
      currentParticipants: comp.currentParticipants || 0,
      status: comp.status,
      registrationsCount: Number.parseInt(comp.registrations_count) || 0,
      createdAt: comp.createdAt,
      updatedAt: comp.updatedAt,
    }))

    return NextResponse.json(competitions)
  } catch (error) {
    console.error("Error fetching organizer competitions:", error)
    return NextResponse.json({ error: "Failed to fetch competitions" }, { status: 500 })
  }
}
