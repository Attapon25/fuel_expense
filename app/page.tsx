"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import DebtDisplay from "@/components/debt-display"
import TripList from "@/components/trip-list"
import PaymentList from "@/components/payment-list"
import AddTripForm from "@/components/add-trip-form"
import AddPaymentForm from "@/components/add-payment-form"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<"trips" | "payments">("trips")
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/debt")
      setIsAuthenticated(response.ok)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      setIsAuthenticated(false)
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleDataUpdate = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">การติดตามค่าเดินทาง</h1>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="glass-button p-2 rounded-xl">
              <LogOut className="w-5 h-5 text-white" />
            </button>
          ) : (
            <Link href="/login" className="glass-button p-2 rounded-xl">
              <LogIn className="w-5 h-5 text-white" />
            </Link>
          )}
        </div>

        {/* Debt Display */}
        <DebtDisplay key={refreshKey} />

        {/* Tab Navigation */} 
        <div className="glass-card p-1">
          <div className="flex rounded-xl overflow-hidden">
            <button

              className={`flex-1 py-3 px-4 text-sm font-medium transition-all  text-white hover:text-white"
                }`}
            >
              สร้าง QR ชำระเงิน
            </button>
          </div>
        </div>
        <div className="glass-card p-2">
          <div className="flex rounded-xl overflow-hidden">
            <button
              onClick={() => setActiveTab("trips")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${activeTab === "trips" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                }`}
            >
              การเดินทาง
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${activeTab === "payments" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                }`}
            >
              การชำระเงิน
            </button>
          </div>
        </div>
       

        {/* Content */}
        {activeTab === "trips" ? (
          <TripList key={`trips-${refreshKey}`} />
        ) : (
          <PaymentList key={`payments-${refreshKey}`} />
        )}


        {/* Floating Action Buttons - Only show when authenticated */}
        {isAuthenticated && (
          <>
            {activeTab === "trips" && <AddTripForm onTripAdded={handleDataUpdate} />}
            {activeTab === "payments" && <AddPaymentForm onPaymentAdded={handleDataUpdate} />}
          </>
        )}
      </div>
    </div>
  )
}
