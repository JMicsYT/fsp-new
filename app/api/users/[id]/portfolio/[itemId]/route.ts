import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string; itemId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has access to this user's portfolio
    if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`
      SELECT id, title, description, date, link, "createdAt", "updatedAt"
      FROM "PortfolioItem"
      WHERE id = ${params.itemId} AND "userId" = ${params.id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching portfolio item:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio item" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string; itemId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has access to update this user's portfolio
    if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { title, description, date, link } = data
    const now = new Date()

    const result = await sql`
      UPDATE "PortfolioItem"
      SET 
        title = ${title},
        description = ${description},
        date = ${date},
        link = ${link || null},
        "updatedAt" = ${now}
      WHERE id = ${params.itemId} AND "userId" = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating portfolio item:", error)
    return NextResponse.json({ error: "Failed to update portfolio item" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string; itemId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has access to delete from this user's portfolio
    if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`
      DELETE FROM "PortfolioItem"
      WHERE id = ${params.itemId} AND "userId" = ${params.id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting portfolio item:", error)
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 })
  }
}
