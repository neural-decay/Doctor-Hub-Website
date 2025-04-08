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
      <div className="flex flex-1">
        <aside className="hidden w-80 border-r md:block">
          <HospitalManagerSidebar />
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
