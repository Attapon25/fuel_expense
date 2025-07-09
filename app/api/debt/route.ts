import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const userId = 1 // เปลี่ยนเป็นดึงจริงจาก session หรือ token

    const trips = await prisma.trip.findMany({
      where: { userId },
      select: { cost: true },
    })

    const payments = await prisma.payment.findMany({
      where: { userId },
      select: { amount: true },
    })

    const totalCost = trips.reduce((sum, trip) => sum + trip.cost, 0)
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const debt = totalCost - totalPaid // ติดลบได้เลยถ้าจ่ายเกิน

    return NextResponse.json({ debt })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
