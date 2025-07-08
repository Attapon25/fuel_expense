import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        distance: true,
        cost: true,
        createdAt: true,
      },
    })

    return NextResponse.json(trips)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const auth = cookieStore.get("auth")

    if (!auth || auth.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const distance = Number(body.distance)

    if (!distance || distance <= 0) {
      return NextResponse.json({ error: "Invalid distance" }, { status: 400 })
    }

    // TODO: แทน userId = 1 ด้วยการดึงจาก session หรือ token จริง ๆ
    const userId = 1

    const fuelPrice = 35 // บาทต่อลิตร
    const fuelEfficiency = 13 // กม./ลิตร
    const cost = (distance / fuelEfficiency) * fuelPrice

    const newTrip = await prisma.trip.create({
      data: {
        distance,
        cost: Number(cost.toFixed(2)),
        userId,
      },
    })

    return NextResponse.json(newTrip)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
