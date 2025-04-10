"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { 
  Building, 
  PlusCircle, 
  Search, 
  Edit2, 
  Trash2, 
  MoreHorizontal, 
  Clock, 
  Calendar,
  User,
  Stethoscope,
  FileText,
  DollarSign,
  Image,
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
} from "lucide-react"
import * as z from "zod"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

// Define form schema with Zod
const serviceFormSchema = z.object({
  service_name: z.string().min(3, { message: "Tên dịch vụ phải có ít nhất 3 ký tự" }),
  price: z.string().min(1, { message: "Giá không được để trống" }),
  description: z.string().min(10, { message: "Mô tả dịch vụ phải có ít nhất 10 ký tự" }),
  doctor_id: z.string({
    required_error: "Vui lòng chọn bác sĩ phụ trách",
  }),
  image_url: z.string().optional(),
})

// Mock data for doctors
const mockDoctors = [
  {
    user_id: "doc1",
    full_name: "PGS.TS. Nguyễn Văn A",
    specialties: "Tim mạch, hô hấp",
    faculty_name: "Khoa Nội"
  },
  {
    user_id: "doc2",
    full_name: "GS.TS. Trần Thị B",
    specialties: "Phẫu thuật tổng quát, tiêu hóa",
    faculty_name: "Khoa Ngoại"
  },
  {
    user_id: "doc3",
    full_name: "TS. Phạm Văn C",
    specialties: "Cấp cứu, hồi sức tích cực",
    faculty_name: "Khoa Cấp cứu"
  },
  {
    user_id: "doc4",
    full_name: "PGS.TS. Lê Thị D",
    specialties: "Nhi khoa, hô hấp nhi",
    faculty_name: "Khoa Nhi"
  },
  {
    user_id: "doc5",
    full_name: "TS. Hoàng Văn E",
    specialties: "Sản phụ khoa, Siêu âm thai",
    faculty_name: "Khoa Sản"
  }
]

// Mock data for services
const mockServices = [
  {
    service_id: "srv1",
    service_name: "Khám sức khỏe tổng quát",
    price: "1500000",
    description: "Dịch vụ khám sức khỏe toàn diện bao gồm khám lâm sàng, xét nghiệm máu, nước tiểu, X-quang phổi và điện tim.",
    image_url: "/images/services/general-checkup.jpg",
    doctor_id: "doc1",
    doctor_name: "PGS.TS. Nguyễn Văn A",
    faculty_name: "Khoa Nội",
    booking_count: 42
  },
  {
    service_id: "srv2",
    service_name: "Siêu âm thai",
    price: "500000",
    description: "Dịch vụ siêu âm thai nhi để theo dõi sự phát triển của thai nhi và phát hiện bất thường.",
    image_url: "/images/services/ultrasound.jpg",
    doctor_id: "doc5",
    doctor_name: "TS. Hoàng Văn E",
    faculty_name: "Khoa Sản",
    booking_count: 65
  },
  {
    service_id: "srv3",
    service_name: "Nội soi dạ dày",
    price: "2000000",
    description: "Dịch vụ nội soi dạ dày để chẩn đoán các bệnh lý về đường tiêu hóa như viêm loét, trào ngược dạ dày.",
    image_url: "/images/services/gastroscopy.jpg",
    doctor_id: "doc2",
    doctor_name: "GS.TS. Trần Thị B",
    faculty_name: "Khoa Ngoại",
    booking_count: 28
  },
  {
    service_id: "srv4",
    service_name: "Khám nhi tổng quát",
    price: "800000",
    description: "Dịch vụ khám sức khỏe tổng quát cho trẻ em, bao gồm khám lâm sàng, theo dõi tăng trưởng và phát triển.",
    image_url: "/images/services/pediatric-checkup.jpg",
    doctor_id: "doc4",
    doctor_name: "PGS.TS. Lê Thị D",
    faculty_name: "Khoa Nhi",
    booking_count: 36
  },
  {
    service_id: "srv5",
    service_name: "Cấp cứu đa chấn thương",
    price: "3500000",
    description: "Dịch vụ cấp cứu đa chấn thương, bao gồm xử lý vết thương, chẩn đoán hình ảnh, xét nghiệm và điều trị ban đầu.",
    image_url: "/images/services/emergency.jpg",
    doctor_id: "doc3",
    doctor_name: "TS. Phạm Văn C",
    faculty_name: "Khoa Cấp cứu",
    booking_count: 15
  },
  {
    service_id: "srv6",
    service_name: "Khám và điều trị bệnh tim mạch",
    price: "1200000",
    description: "Dịch vụ khám và điều trị các bệnh lý tim mạch, bao gồm đo điện tim, siêu âm tim và tư vấn điều trị.",
    image_url: "/images/services/cardiology.jpg",
    doctor_id: "doc1",
    doctor_name: "PGS.TS. Nguyễn Văn A",
    faculty_name: "Khoa Nội",
    booking_count: 30
  }
]

export default function HospitalServices() {
  const [services, setServices] = useState(mockServices)
  const [doctors, setDoctors] = useState(mockDoctors)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Filter services based on search term
  const filteredServices = services.filter(service =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.faculty_name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  
  // Get current services
  const indexOfLastService = currentPage * itemsPerPage
  const indexOfFirstService = indexOfLastService - itemsPerPage
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService)
  
  // Change page
  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)))
  }

  // Format currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(amount))
  }

  // Form for adding/editing services
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      service_name: "",
      price: "",
      description: "",
      doctor_id: "",
      image_url: ""
    }
  })

  // Reset form when dialog opens/closes
  const resetForm = () => {
    form.reset({
      service_name: "",
      price: "",
      description: "",
      doctor_id: "",
      image_url: ""
    })
  }

  // Set form values when editing
  const editService = (service: any) => {
    setEditingService(service)
    form.reset({
      service_name: service.service_name,
      price: service.price,
      description: service.description,
      doctor_id: service.doctor_id,
      image_url: service.image_url
    })
    setIsAddDialogOpen(true)
  }

  // Handle form submission (add/edit)
  const onSubmit = (values: z.infer<typeof serviceFormSchema>) => {
    // Find selected doctor
    const selectedDoctor = doctors.find(doctor => doctor.user_id === values.doctor_id);
    
    if (editingService) {
      // Update existing service
      setServices(services.map(service => 
        service.service_id === editingService.service_id ? { 
          ...service, 
          ...values,
          doctor_name: selectedDoctor?.full_name || "",
          faculty_name: selectedDoctor?.faculty_name || "",
        } : service
      ))
      toast.success("Cập nhật thông tin dịch vụ thành công!")
    } else {
      // Add new service
      const newService = {
        service_id: `srv${services.length + 1}`,
        ...values,
        doctor_name: selectedDoctor?.full_name || "",
        faculty_name: selectedDoctor?.faculty_name || "",
        booking_count: 0
      }
      setServices([...services, newService])
      toast.success("Thêm dịch vụ mới thành công!")
    }
    setIsAddDialogOpen(false)
    setEditingService(null)
    resetForm()
  }

  // Handle service deletion
  const deleteService = (id: string) => {
    setServices(services.filter(service => service.service_id !== id))
    toast.success("Đã xóa dịch vụ thành công!")
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản Lý Dịch Vụ</h2>
          <p className="text-muted-foreground mt-1">Quản lý danh sách dịch vụ y tế trong bệnh viện</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="gap-2 text-base font-medium"
              onClick={() => {
                setEditingService(null)
                resetForm()
              }}
            >
              <PlusCircle className="h-5 w-5" /> Thêm dịch vụ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingService ? "Chỉnh sửa thông tin dịch vụ" : "Thêm dịch vụ mới"}</DialogTitle>
              <DialogDescription>
                {editingService ? "Cập nhật thông tin cho dịch vụ hiện có" : "Nhập thông tin để thêm dịch vụ mới vào hệ thống"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="service_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Tên dịch vụ</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Stethoscope className="h-5 w-5 text-primary" />
                          <Input 
                            placeholder="Nhập tên dịch vụ" 
                            {...field} 
                            className="bg-background border-2 text-foreground py-5 text-base" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Giá dịch vụ (VNĐ)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <Input 
                              placeholder="Nhập giá dịch vụ" 
                              {...field} 
                              type="number"
                              className="bg-background border-2 text-foreground py-5 text-base" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="doctor_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Bác sĩ phụ trách</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-primary" />
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full bg-background border-2 text-foreground py-2 h-[46px]">
                                <SelectValue placeholder="Chọn bác sĩ phụ trách" />
                              </SelectTrigger>
                              <SelectContent>
                                {doctors.map((doctor) => (
                                  <SelectItem key={doctor.user_id} value={doctor.user_id}>
                                    {doctor.full_name} - {doctor.faculty_name}
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
                
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Hình ảnh (URL)</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Image className="h-5 w-5 text-primary" />
                          <Input 
                            placeholder="Nhập URL hình ảnh" 
                            {...field} 
                            className="bg-background border-2 text-foreground py-5 text-base" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Mô tả dịch vụ</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Mô tả chi tiết về dịch vụ y tế" 
                          {...field} 
                          className="bg-background border-2 text-foreground min-h-[100px] text-base" 
                          rows={4}
                        />
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
                    {editingService ? "Cập nhật" : "Thêm dịch vụ"}
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
            placeholder="Tìm kiếm theo tên dịch vụ, bác sĩ phụ trách..."
            className="pl-8 border-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table className="w-full">
        <TableHeader className="bg-muted">
          <TableRow className="bg-muted hover:bg-muted border-b border-border">
            <TableHead className="font-bold text-sm px-3 py-2.5">Dịch vụ</TableHead>
            <TableHead className="font-bold text-sm px-3 py-2.5">Bác sĩ phụ trách</TableHead>
            <TableHead className="font-bold text-sm px-3 py-2.5">Giá dịch vụ</TableHead>
            <TableHead className="font-bold text-sm px-3 py-2.5">Lượt đặt</TableHead>
            <TableHead className="text-right font-bold text-sm px-3 py-2.5">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentServices.length > 0 ? (
            currentServices.map((service) => (
              <TableRow 
                key={service.service_id} 
                className="hover:bg-muted/30 border-b border-border/40 transition-colors"
              >
                <TableCell className="font-semibold text-base py-4">
                  <div className="flex items-start gap-2">
                    <Stethoscope className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div>{service.service_name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">{service.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary/70" />
                    <div>
                      <div>{service.doctor_name}</div>
                      <div className="text-sm text-muted-foreground">{service.faculty_name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary/70" />
                    <span className="font-medium">{formatCurrency(service.price)}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary/70" />
                    <span className="font-medium">{service.booking_count} lượt</span>
                  </div>
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
                      <DropdownMenuItem onClick={() => editService(service)} className="gap-2">
                        <Edit2 className="h-4 w-4" /> Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Clock className="h-4 w-4" /> Quản lý lịch
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive gap-2"
                        onClick={() => deleteService(service.service_id)}
                      >
                        <Trash2 className="h-4 w-4" /> Xóa dịch vụ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Search className="h-6 w-6" />
                  Không tìm thấy dịch vụ nào
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Pagination*/}
      {filteredServices.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex-1 text-sm text-muted-foreground">
            Hiển thị <span className="font-medium">{indexOfFirstService + 1}</span> đến <span className="font-medium">
              {Math.min(indexOfLastService, filteredServices.length)}
            </span> trong số <span className="font-medium">{filteredServices.length}</span> dịch vụ
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