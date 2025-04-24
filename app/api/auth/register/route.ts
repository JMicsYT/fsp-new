import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, password, role, region, organization, emailVerified } = data

    // Check if user already exists
    const checkResult = await sql`
      SELECT * FROM "User"
      WHERE email = ${email}
    `

    if (checkResult.length > 0) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 })
    }

    // Create new user
    const id = `usr_${Date.now()}`
    const now = new Date()

    const result = await sql`
      INSERT INTO "User" (
        id, name, email, password, role, region, organization, "emailVerified", "createdAt", "updatedAt"
      )
      VALUES (
        ${id}, ${name}, ${email}, ${password}, ${role || "ATHLETE"}, 
        ${region || ""}, ${organization || ""}, ${emailVerified || false}, ${now}, ${now}
      )
      RETURNING id, name, email, role, region, organization, "emailVerified", "createdAt", "updatedAt"
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
