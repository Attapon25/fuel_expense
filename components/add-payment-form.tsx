"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { CreditCard, X } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import PromptPay from "promptpay-qr"

interface AddPaymentFormProps {
  onPaymentAdded: () => void
}

export default function AddPaymentForm({ onPaymentAdded }: AddPaymentFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [debt, setDebt] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [qrData, setQrData] = useState("")
  const [mode, setMode] = useState<"qr" | "manual">("qr")

  const phoneNumber = "0994312095" // เปลี่ยนเป็น PromptPay ของคุณ

  // ดึงยอดหนี้
  useEffect(() => {
    if (isOpen) {
      fetch("/api/debt")
        .then(res => res.json())
        .then(data => {
          setDebt(data.debtAmount)
          setAmount(data.debtAmount.toFixed(2))
        })
        .catch(() => {
          setDebt(null)
          setAmount("")
        })
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setQrData("")

    try {
      const value = Number.parseFloat(amount)
      if (!value || value <= 0) throw new Error("Invalid amount")

      // ส่งไปที่ backend
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add payment")
      }

      onPaymentAdded?.()

      if (mode === "qr") {
        // สร้าง QR
        const qr = PromptPay(phoneNumber, { amount: value })
        setQrData(qr)
      } else {
        // ปิดฟอร์มหากเป็นโหมด manual
        setIsOpen(false)
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="glass-button p-4 rounded-full shadow-lg fixed bottom-4 right-4 z-10"
      >
        <CreditCard className="w-6 h-6 text-white" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="glass-card w-full rounded-t-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">
            {mode === "qr" ? "ชำระเงินด้วย QR พร้อมเพย์" : "เพิ่มการชำระเงินแบบกรอกเอง"}
          </h3>
          <button onClick={() => setIsOpen(false)} className="glass-button p-2 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* ปุ่มเปลี่ยนโหมด */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode("qr")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              mode === "qr" ? "bg-white text-black" : "bg-white/10 text-white"
            }`}
          >
            สร้าง QR พร้อมเพย์
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              mode === "manual" ? "bg-white text-black" : "bg-white/10 text-white"
            }`}
          >
            เพิ่มแบบกรอกเอง
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">จำนวนเงิน (บาท)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="glass-input w-full"
              placeholder="ระบุจำนวนเงิน"
              min="0.01"
              step="0.01"
              required
            />
            {debt !== null && (
              <p className="text-white/60 text-xs mt-1">ยอดหนี้คงเหลือ: ฿{debt.toFixed(2)}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full py-3 px-4 text-white font-medium disabled:opacity-50"
          >
            {loading
              ? "กำลังดำเนินการ..."
              : mode === "qr"
              ? "สร้าง QR และบันทึก"
              : "บันทึกการชำระเงิน"}
          </button>
        </form>

        {/* แสดง QR หากสร้างแล้ว */}
        {qrData && (
          <div className="mt-6 flex flex-col items-center">
            <QRCodeCanvas value={qrData} size={200} />
            <p className="mt-2 text-sm text-white/80">สแกนเพื่อชำระเงิน</p>
          </div>
        )}
      </div>
    </div>
  )
}
