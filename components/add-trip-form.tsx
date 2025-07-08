"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"

interface AddTripFormProps {
  onTripAdded: () => void
}

export default function AddTripForm({ onTripAdded }: AddTripFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [distance, setDistance] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ distance: Number.parseFloat(distance) }),
      })

      if (response.ok) {
        setDistance("")
        setIsOpen(false)
        onTripAdded()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to add trip")
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
        className="glass-button p-4 rounded-full shadow-lg fixed bottom-20 right-4 z-10"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="glass-card w-full rounded-t-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">Add New Trip</h3>
          <button onClick={() => setIsOpen(false)} className="glass-button p-2 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Distance (km)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="glass-input w-full"
              placeholder="Enter distance in kilometers"
              min="0.1"
              step="0.1"
              required
            />
            <p className="text-white/60 text-xs mt-1">
              Cost will be calculated automatically (฿35/L, 13 km/L efficiency)
            </p>
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
            {loading ? "Adding Trip..." : "Add Trip"}
          </button>
        </form>
      </div>
    </div>
  )
}
