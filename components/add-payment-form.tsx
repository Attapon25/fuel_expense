"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, X } from "lucide-react"

interface AddPaymentFormProps {
  onPaymentAdded: () => void
}

export default function AddPaymentForm({ onPaymentAdded }: AddPaymentFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number.parseFloat(amount) }),
      })

      if (response.ok) {
        setAmount("")
        setIsOpen(false)
        onPaymentAdded()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to add payment")
      }
    } catch (err) {
      setError("Network error")
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">Add Payment</h3>
          <button onClick={() => setIsOpen(false)} className="glass-button p-2 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Amount (THB)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="glass-input w-full"
              placeholder="Enter payment amount"
              min="0.01"
              step="0.01"
              required
            />
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
            {loading ? "Adding Payment..." : "Add Payment"}
          </button>
        </form>
      </div>
    </div>
  )
}
