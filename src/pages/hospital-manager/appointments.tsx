"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { 
  Calendar, 
  PlusCircle, 
  Search, 
  Edit2, 
  Trash2, 
  MoreHorizontal, 
  Clock,
  User,
  Stethoscope,
  DollarSign,
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
} from "lucide-react"
import * as z from "zod"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define form schema with Zod
const appointmentFormSchema = z.object({
  user_id: z.string({
    required_error: "Vui lòng chọn bệnh nhân",
  }),
  service_id: z.string({
    required_error: "Vui lòng chọn dịch vụ",
  }),
  booking_slot_id: z.string({
    required_error: "Vui lòng chọn khung giờ",
  }),
  price: z.string({
    required_error: "Vui lòng nhập giá",
  }),
  status: z.enum(["SUCCESS", "FAILED"], {
    required_error: "Vui lòng chọn trạng thái",
  }),
})

// Mock data for users (patients)
const mockUsers = [
  {
    user_id: "user1",
    full_name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@example.com"
  },
  {
    user_id: "user2",
    full_name: "Trần Thị B",
    phone: "0987654321",
    email: "tranthib@example.com"
  },
  {
    user_id: "user3",
    full_name: "Lê Văn C",
    phone: "0369852147",
    email: "levanc@example.com"
  }
]

// Mock data for services
const mockServices = [
  {
    service_id: "srv1",
    service_name: "Khám sức khỏe tổng quát",
    price: "1500000",
    description: "Dịch vụ khám sức khỏe toàn diện",
    doctor_id: "doc1",
    doctor_name: "PGS.TS. Nguyễn Văn A"
  },
  {
    service_id: "srv2",
    service_name: "Siêu âm thai",
    price: "500000",
    description: "Dịch vụ siêu âm thai nhi",
    doctor_id: "doc2",
    doctor_name: "GS.TS. Trần Thị B"
  }
]

// Mock data for booking slots
const mockBookingSlots = [
  {
    booking_slot_id: "slot1",
    booking_day: "2024-03-20",
    is_available: true,
    time_slot: {
      time_slot_id: "time1",
      start_time: "09:00",
      end_time: "09:30"
    },
    service_id: "srv1"
  },
  {
    booking_slot_id: "slot2",
    booking_day: "2024-03-20",
    is_available: true,
    time_slot: {
      time_slot_id: "time2",
      start_time: "14:30",
      end_time: "15:00"
    },
    service_id: "srv2"
  }
]

// Mock data for appointments
const mockAppointments = [
  {
    appointment_id: "apt1",
    user_id: "user1",
    user_name: "Nguyễn Văn A",
    service_id: "srv1",
    service_name: "Khám sức khỏe tổng quát",
    booking_slot_id: "slot1",
    booking_day: "2024-03-20",
    time_slot: {
      start_time: "09:00",
      end_time: "09:30"
    },
    price: "1500000",
    status: "SUCCESS",
    created_at: "2024-03-15T10:00:00Z"
  },
  {
    appointment_id: "apt2",
    user_id: "user2",
    user_name: "Trần Thị B",
    service_id: "srv2",
    service_name: "Siêu âm thai",
    booking_slot_id: "slot2",
    booking_day: "2024-03-20",
    time_slot: {
      start_time: "14:30",
      end_time: "15:00"
    },
    price: "500000",
    status: "FAILED",
    created_at: "2024-03-16T11:30:00Z"
  }
]

export default function HospitalAppointments() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [users, setUsers] = useState(mockUsers)
  const [services, setServices] = useState(mockServices)
  const [bookingSlots, setBookingSlots] = useState(mockBookingSlots)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<any>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(appointment =>
    appointment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
  
  // Get current appointments
  const indexOfLastAppointment = currentPage * itemsPerPage
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment)
  
  // Change page
  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)))
  }

  // Format currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(amount))
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Form for adding/editing appointments
  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      user_id: "",
      service_id: "",
      booking_slot_id: "",
      price: "",
      status: "SUCCESS"
    }
  })

  // Reset form when dialog opens/closes
  const resetForm = () => {
    form.reset({
      user_id: "",
      service_id: "",
      booking_slot_id: "",
      price: "",
      status: "SUCCESS"
    })
  }

  // Set form values when editing
  const editAppointment = (appointment: any) => {
    setEditingAppointment(appointment)
    form.reset({
      user_id: appointment.user_id,
      service_id: appointment.service_id,
      booking_slot_id: appointment.booking_slot_id,
      price: appointment.price,
      status: appointment.status
    })
    setIsAddDialogOpen(true)
  }

  // Handle form submission (add/edit)
  const onSubmit = (values: z.infer<typeof appointmentFormSchema>) => {
    // Find selected user and service
    const selectedUser = users.find(user => user.user_id === values.user_id);
    const selectedService = services.find(service => service.service_id === values.service_id);
    const selectedSlot = bookingSlots.find(slot => slot.booking_slot_id === values.booking_slot_id);
    
    if (editingAppointment) {
      // Update existing appointment
      setAppointments(appointments.map(appointment => 
        appointment.appointment_id === editingAppointment.appointment_id ? { 
          ...appointment, 
          ...values,
          user_name: selectedUser?.full_name || "",
          service_name: selectedService?.service_name || "",
          booking_day: selectedSlot?.booking_day || "",
          time_slot: selectedSlot?.time_slot || { start_time: "", end_time: "" }
        } : appointment
      ))
      toast.success("Cập nhật lịch hẹn thành công!")
    } else {
      // Add new appointment
      const newAppointment = {
        appointment_id: `apt${appointments.length + 1}`,
        ...values,
        user_name: selectedUser?.full_name || "",
        service_name: selectedService?.service_name || "",
        booking_day: selectedSlot?.booking_day || "",
        time_slot: selectedSlot?.time_slot || { start_time: "", end_time: "" },
        created_at: new Date().toISOString()
      }
      setAppointments([...appointments, newAppointment])
      toast.success("Thêm lịch hẹn mới thành công!")
    }
    setIsAddDialogOpen(false)
    setEditingAppointment(null)
    resetForm()
  }

  // Handle appointment deletion
  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(appointment => appointment.appointment_id !== id))
    toast.success("Đã xóa lịch hẹn thành công!")
  }

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-500/20 text-green-700 hover:bg-green-500/20 dark:bg-green-500/30 dark:text-green-300"
      case "FAILED":
        return "bg-red-500/20 text-red-700 hover:bg-red-500/20 dark:bg-red-500/30 dark:text-red-300"
      default:
        return ""
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "Thành công"
      case "FAILED":
        return "Thất bại"
      default:
        return status
    }
  }

  // Get available slots for selected service
  const getAvailableSlots = (serviceId: string) => {
    return bookingSlots.filter(slot => 
      slot.service_id === serviceId && 
      slot.is_available
    )
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản Lý Lịch Hẹn</h2>
          <p className="text-muted-foreground mt-1">Quản lý danh sách lịch hẹn khám bệnh</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="gap-2 text-base font-medium"
              onClick={() => {
                setEditingAppointment(null)
                resetForm()
              }}
            >
              <PlusCircle className="h-5 w-5" /> Thêm lịch hẹn mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{editingAppointment ? "Chỉnh sửa lịch hẹn" : "Thêm lịch hẹn mới"}</DialogTitle>
              <DialogDescription>
                {editingAppointment ? "Cập nhật thông tin cho lịch hẹn hiện có" : "Nhập thông tin để thêm lịch hẹn mới vào hệ thống"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Bệnh nhân</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-primary" />
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full bg-background border-2 text-foreground py-2 h-[46px]">
                                <SelectValue placeholder="Chọn bệnh nhân" />
                              </SelectTrigger>
                              <SelectContent>
                                {users.map((user) => (
                                  <SelectItem key={user.user_id} value={user.user_id}>
                                    {user.full_name} - {user.phone}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="service_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Dịch vụ</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full bg-background border-2 text-foreground py-2 h-[46px]">
                                <SelectValue placeholder="Chọn dịch vụ" />
                              </SelectTrigger>
                              <SelectContent className="max-w-[600px]">
                                {services.map((service) => (
                                  <SelectItem key={service.service_id} value={service.service_id}>
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="truncate">{service.service_name}</span>
                                      <span className="flex-shrink-0">{formatCurrency(service.price)}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="booking_slot_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Khung giờ</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full bg-background border-2 text-foreground py-2 h-[46px]">
                                <SelectValue placeholder="Chọn khung giờ" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableSlots(form.watch("service_id")).map((slot) => (
                                  <SelectItem key={slot.booking_slot_id} value={slot.booking_slot_id}>
                                    {formatDate(slot.booking_day)} {slot.time_slot.start_time} - {slot.time_slot.end_time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Giá</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <Input 
                              type="number"
                              placeholder="Nhập giá" 
                              {...field} 
                              className="bg-background border-2 text-foreground py-5 text-base" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Trạng thái</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-primary" />
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full bg-background border-2 text-foreground py-2 h-[46px]">
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SUCCESS">Thành công</SelectItem>
                              <SelectItem value="FAILED">Thất bại</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="mt-6">
                  <Button 
                    type="submit" 
                    size="lg"
                    className="text-base font-medium"
                  >
                    {editingAppointment ? "Cập nhật" : "Thêm lịch hẹn"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên bệnh nhân, dịch vụ..."
            className="pl-8 border-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table className="w-full">
        <TableHeader className="bg-muted">
          <TableRow className="bg-muted hover:bg-muted border-b border-border">
            <TableHead className="font-bold text-sm px-3 py-2.5 w-[20%]">Bệnh nhân</TableHead>
            <TableHead className="font-bold text-sm px-3 py-2.5 w-[30%]">Dịch vụ</TableHead>
            <TableHead className="font-bold text-sm px-3 py-2.5 w-[20%]">Thời gian</TableHead>
            <TableHead className="font-bold text-sm px-3 py-2.5 w-[15%]">Giá</TableHead>
            <TableHead className="font-bold text-sm px-3 py-2.5 w-[10%]">Trạng thái</TableHead>
            <TableHead className="text-right font-bold text-sm px-3 py-2.5 w-[5%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentAppointments.length > 0 ? (
            currentAppointments.map((appointment) => (
              <TableRow 
                key={appointment.appointment_id} 
                className="hover:bg-muted/30 border-b border-border/40 transition-colors"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary/70 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="truncate">{appointment.user_name}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(appointment.created_at)}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary/70 flex-shrink-0" />
                    <div className="min-w-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="truncate font-medium">
                              {appointment.service_name}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{appointment.service_name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="text-sm text-muted-foreground truncate">
                        {formatDate(appointment.booking_day)} {appointment.time_slot.start_time} - {appointment.time_slot.end_time}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary/70 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="truncate">{formatDate(appointment.booking_day)}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {appointment.time_slot.start_time} - {appointment.time_slot.end_time}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary/70 flex-shrink-0" />
                    <span className="font-medium truncate">{formatCurrency(appointment.price)}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge 
                    variant="outline"
                    className={`px-3 py-1 truncate ${getStatusBadgeColor(appointment.status)}`}
                  >
                    {getStatusText(appointment.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => editAppointment(appointment)} className="gap-2">
                        <Edit2 className="h-4 w-4" /> Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive gap-2"
                        onClick={() => deleteAppointment(appointment.appointment_id)}
                      >
                        <Trash2 className="h-4 w-4" /> Xóa lịch hẹn
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Search className="h-6 w-6" />
                  Không tìm thấy lịch hẹn nào
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Pagination*/}
      {filteredAppointments.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex-1 text-sm text-muted-foreground">
            Hiển thị <span className="font-medium">{indexOfFirstAppointment + 1}</span> đến <span className="font-medium">
              {Math.min(indexOfLastAppointment, filteredAppointments.length)}
            </span> trong số <span className="font-medium">{filteredAppointments.length}</span> lịch hẹn
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Trang đầu</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Trang trước</span>
            </Button>
            <div className="flex items-center">
              {(() => {
                // Always show first page
                const pages = [1];
                
                if (totalPages <= 7) {
                  // If 7 or fewer pages, show all
                  for (let i = 2; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // For many pages, show first, last, and pages around current
                  if (currentPage > 4) {
                    pages.push(-1); // -1 represents ellipsis "..."
                  }
                  
                  // Pages around current
                  const startPage = Math.max(2, currentPage - 1);
                  const endPage = Math.min(totalPages - 1, currentPage + 1);
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }
                  
                  if (currentPage < totalPages - 3) {
                    pages.push(-2); // -2 represents end ellipsis "..."
                  }
                  
                  // Always show last page
                  if (totalPages > 1) {
                    pages.push(totalPages);
                  }
                }
                
                return pages.map(pageNum => {
                  if (pageNum < 0) {
                    // Render ellipsis
                    return (
                      <div key={pageNum} className="flex items-center justify-center h-8 w-8 mx-0.5 text-gray-500">
                        •••
                      </div>
                    );
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className="h-8 w-8 mx-0.5"
                    >
                      {pageNum}
                    </Button>
                  );
                });
              })()}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Trang sau</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Trang cuối</span>
            </Button>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(parseInt(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[90px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
} 