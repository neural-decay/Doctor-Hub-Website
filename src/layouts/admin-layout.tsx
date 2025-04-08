"use client"

import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { AdminHeader } from "@/components/admin/header"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Footer } from "@/components/footer"

export default function AdminLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

//   if (!user || user.role !== "ADMIN") {
//     return <Navigate to="/login" replace />
//   }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <aside className="hidden w-80 border-r md:block">
          <AdminSidebar />
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
