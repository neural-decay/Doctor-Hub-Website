"use client"

import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { HospitalManagerHeader } from "@/components/hospital-manager/header"
import { HospitalManagerSidebar } from "@/components/hospital-manager/sidebar"
import { Footer } from "@/components/footer"

export default function HospitalManagerLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

//   if (!user || user.role !== "HOSPITAL_MANAGER") {
//     return <Navigate to="/login" replace />
//   }

  return (
    <div className="flex min-h-screen flex-col">
      <HospitalManagerHeader />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-80 border-r md:block overflow-y-auto">
          <HospitalManagerSidebar />
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
