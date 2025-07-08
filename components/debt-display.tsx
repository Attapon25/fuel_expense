"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"

export default function DebtDisplay() {
  const [debt, setDebt] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDebt()
  }, [])

  const fetchDebt = async () => {
    try {
      const response = await fetch("/api/debt")
      const data = await response.json()
      setDebt(data.debt)
    } catch (error) {
      console.error("Failed to fetch debt:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  return (
    <div className="glass-card p-6 text-center">
      <h2 className="text-white/80 text-sm font-medium mb-2">หนี้สินค้างชำระ</h2>
      <p className={`text-4xl font-bold ${debt > 0 ? "text-red-300" : "text-green-300"}`}>{formatCurrency(debt)}</p>
      {debt > 0 && <p className="text-white/60 text-xs mt-2">จำนวนเงินที่ค้างชำระสำหรับค่าใช้จ่ายน้ำมัน</p>}
    </div>
  )
}
