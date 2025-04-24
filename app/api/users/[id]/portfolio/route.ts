import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has access to this user's portfolio
    if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`
      SELECT id, title, description, date, link, "createdAt", "updatedAt"
      FROM "PortfolioItem"
      WHERE "userId" = ${params.id}
      ORDER BY date DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has access to add to this user's portfolio
    if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { title, description, date, link } = data
    const id = `port_${Date.now()}`
    const now = new Date()

    const result = await sql`
      INSERT INTO "PortfolioItem" (
        id, "userId", title, description, date, link, "createdAt", "updatedAt"
      )
      VALUES (
        ${id}, ${params.id}, ${title}, ${description}, ${date}, ${link || null}, ${now}, ${now}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating portfolio item:", error)
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 })
  }
}
