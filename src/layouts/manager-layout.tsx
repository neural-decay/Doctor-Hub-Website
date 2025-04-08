"use client"

import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { ManagerHeader } from "@/components/manager/header"
import { ManagerSidebar } from "@/components/manager/sidebar"
import { Footer } from "@/components/footer"

export default function ManagerLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

//   if (!user || user.role !== "MANAGER") {
//     return <Navigate to="/login" replace />
//   }

  return (
    <div className="flex min-h-screen flex-col">
      <ManagerHeader />
      <div className="flex flex-1">
        <aside className="hidden w-80 border-r md:block">
          <ManagerSidebar />
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
