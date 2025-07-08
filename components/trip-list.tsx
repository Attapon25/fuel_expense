"use client"

import { useEffect, useState } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Car } from "lucide-react"


interface Trip {
  id: number
  createdAt: string
  distance: number
  cost: number
}

export default function TripList() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [])
function formatTimeWithPlus7(dateString: string) {
  const date = new Date(dateString)

  // บวกเวลา 7 ชั่วโมง (7 * 60 * 60 * 1000 ms)
  const plus7 = new Date(date.getTime() + 7 * 60 * 60 * 1000)

  // แปลงเป็นเวลา HH:mm:ss
  const hours = String(plus7.getUTCHours()).padStart(2, '0')
  const minutes = String(plus7.getUTCMinutes()).padStart(2, '0')
  const seconds = String(plus7.getUTCSeconds()).padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}
  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips")
      const data = await response.json()
      setTrips(data)
    } catch (error) {
      console.error("Failed to fetch trips:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Car className="w-5 h-5 text-white" />
          <h3 className="text-white font-semibold">การเดินทางล่าสุด</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 animate-pulse">
              <div className="h-4 bg-white/10 rounded mb-2" />
              <div className="h-3 bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Car className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold">การเดินทางล่าสุด</h3>
      </div>

      {trips.length === 0 ? (
        <p className="text-white/60 text-center py-8">ไม่มีประวัติการเดินทาง</p>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white/5 rounded-xl p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">{trip.distance} กิโลเมตร</p>
                  <p className="text-white/60 text-sm">  {formatDate(trip.createdAt)} {formatTimeWithPlus7(trip.createdAt)}
</p>
                </div>
                <p className="text-white font-semibold">{formatCurrency(trip.cost)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
