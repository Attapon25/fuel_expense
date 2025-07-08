import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // ดึงข้อมูล payments ทั้งหมด แล้วเรียงจากวันที่ล่าสุดก่อน
    const payments = await prisma.payment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(payments)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const auth = (await cookieStore).get("auth")

    if (!auth || auth.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()
    const numericAmount = Number(amount)

    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // TODO: ดึง userId จริง ๆ จาก session หรือ token แทน hardcoded
    const userId = 1

    // สร้าง payment ใหม่ในฐานข้อมูล
    const newPayment = await prisma.payment.create({
      data: {
        amount: numericAmount,
        userId,
      },
    })

    return NextResponse.json(newPayment)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
