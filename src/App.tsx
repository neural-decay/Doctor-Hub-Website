import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

// Layouts
import AdminLayout from "@/layouts/admin-layout";
import ManagerLayout from "@/layouts/manager-layout";
import HospitalManagerLayout from "@/layouts/hospital-manager-layout";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProfile from "@/pages/admin/profile";
import AdminPosts from "@/pages/admin/posts";
import AdminUsers from "@/pages/admin/users";

// Manager Pages
import ManagerDashboard from "@/pages/manager/dashboard";
import ManagerProfile from "@/pages/manager/profile";
import ManagerPosts from "@/pages/manager/posts";
import CategoryManager from "@/pages/manager/categories";

// Hospital Manager Pages
import HospitalDashboard from "@/pages/hospital-manager/dashboard"
import HospitalDoctors from "@/pages/hospital-manager/doctors"
import HospitalManagerProfile from "./pages/hospital-manager/profile"
import HospitalInformation from "./pages/hospital-manager/information"
import HospitalFaculties from "./pages/hospital-manager/faculties"
import HospitalServices from "./pages/hospital-manager/services"
import HospitalAppointments from "./pages/hospital-manager/appointments"
import HospitalRevenue from "./pages/hospital-manager/revenue"
// Auth Pages
import Login from "@/pages/auth/login";



function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* Manager Routes */}
            <Route path="/manager" element={<ManagerLayout />}>
              <Route index element={<ManagerDashboard />} />
              <Route path="profile" element={<ManagerProfile />} />
              <Route path="posts" element={<ManagerPosts />} />
              <Route path="categories" element={<CategoryManager />} />
            </Route>

            {/* Hospital Manager Routes */}
            <Route path="/hospital" element={<HospitalManagerLayout />}>
              <Route index element={<HospitalDashboard />} />
              <Route path="information" element={<HospitalInformation />} />
              <Route path="faculties" element={<HospitalFaculties />} />
              <Route path="doctors" element={<HospitalDoctors />} />
              <Route path="services" element={<HospitalServices />} />
              <Route path="profile" element={<HospitalManagerProfile />} />
              <Route path="appointments" element={<HospitalAppointments />} />
              <Route path="revenue" element={<HospitalRevenue />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
