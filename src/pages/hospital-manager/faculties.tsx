"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Building, PlusCircle, Search, Edit2, Trash2, MoreHorizontal, Users, MapPin, User, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import * as z from "zod"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

// Define form schema with Zod - chỉ cho phép sửa tên khoa, mô tả, vị trí
const facultyFormSchema = z.object({
  faculty_name: z.string().min(3, { message: "Tên khoa phải có ít nhất 3 ký tự" }),
  description: z.string().min(10, { message: "Mô tả khoa phải có ít nhất 10 ký tự" }),
  head_doctor_id: z.string({
    required_error: "Vui lòng chọn trưởng khoa",
  }),
  location: z.string().min(2, { message: "Vị trí không được để trống" })
})

// Mock data for departments/faculties
const mockFaculties = [
  {
    id: "1",
    faculty_name: "Khoa Nội",
    description: "Chẩn đoán và điều trị các bệnh lý nội khoa",
    head_doctor: "PGS.TS. Nguyễn Văn A",
    head_doctor_id: "d1",
    total_staff: "42",
    location: "Tầng 3, Tòa nhà A",
    status: "active"
  },
  {
    id: "2",
    faculty_name: "Khoa Ngoại",
    description: "Chẩn đoán và điều trị các bệnh lý ngoại khoa, phẫu thuật",
    head_doctor: "GS.TS. Trần Thị B",
    head_doctor_id: "d2",
    total_staff: "38",
    location: "Tầng 2, Tòa nhà B",
    status: "active"
  },
  {
    id: "3",
    faculty_name: "Khoa Cấp cứu",
    description: "Tiếp nhận và xử lý các trường hợp cấp cứu 24/7",
    head_doctor: "TS. Phạm Văn C",
    head_doctor_id: "d3",
    total_staff: "25",
    location: "Tầng 1, Tòa nhà A",
    status: "active"
  },
  {
    id: "4",
    faculty_name: "Khoa Nhi",
    description: "Chẩn đoán và điều trị cho trẻ em dưới 16 tuổi",
    head_doctor: "PGS.TS. Lê Thị D",
    head_doctor_id: "d4",
    total_staff: "30",
    location: "Tầng 4, Tòa nhà B",
    status: "active"
  },
  {
    id: "5",
    faculty_name: "Khoa Sản",
    description: "Chẩn đoán, điều trị các bệnh phụ khoa và thai sản",
    head_doctor: "TS. Hoàng Văn E",
    head_doctor_id: "d5",
    total_staff: "27",
    location: "Tầng 5, Tòa nhà A",
    status: "under maintenance"
  },
  {
    id: "6",
    faculty_name: "Khoa Sản",
    description: "Chẩn đoán, điều trị các bệnh phụ khoa và thai sản",
    head_doctor: "TS. Hoàng Văn E",
    head_doctor_id: "d5",
    total_staff: "27",
    location: "Tầng 5, Tòa nhà A",
    status: "under maintenance"
  },
  {
    id: "7",
    faculty_name: "Khoa Sản",
    description: "Chẩn đoán, điều trị các bệnh phụ khoa và thai sản",
    head_doctor: "TS. Hoàng Văn E",
    head_doctor_id: "d5",
    total_staff: "27",
    location: "Tầng 5, Tòa nhà A",
    status: "under maintenance"
  },
  {
    id: "8",
    faculty_name: "Khoa Sản",
    description: "Chẩn đoán, điều trị các bệnh phụ khoa và thai sản",
    head_doctor: "TS. Hoàng Văn E",
    head_doctor_id: "d5",
    total_staff: "27",
    location: "Tầng 5, Tòa nhà A",
    status: "under maintenance"
  }
]

// Danh sách bác sĩ mẫu - thực tế sẽ lấy từ API
const mockDoctors = [
  { id: "d1", name: "PGS.TS. Nguyễn Văn A", specialty: "Nội khoa" },
  { id: "d2", name: "GS.TS. Trần Thị B", specialty: "Ngoại khoa" },
  { id: "d3", name: "TS. Phạm Văn C", specialty: "Cấp cứu" },
  { id: "d4", name: "PGS.TS. Lê Thị D", specialty: "Nhi khoa" },
  { id: "d5", name: "TS. Hoàng Văn E", specialty: "Sản phụ khoa" },
  { id: "d6", name: "BS. Đặng Văn F", specialty: "Nội khoa" },
  { id: "d7", name: "BS.CK2 Trần Văn G", specialty: "Tim mạch" },
]

export default function HospitalFaculties() {
  const [faculties, setFaculties] = useState(mockFaculties)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState<any>(null)
  const [doctors, setDoctors] = useState(mockDoctors)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Filter faculties based on search term
  const filteredFaculties = faculties.filter(faculty =>
    faculty.faculty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.head_doctor.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredFaculties.length / itemsPerPage)
  
  // Get current faculties
  const indexOfLastFaculty = currentPage * itemsPerPage
  const indexOfFirstFaculty = indexOfLastFaculty - itemsPerPage
  const currentFaculties = filteredFaculties.slice(indexOfFirstFaculty, indexOfLastFaculty)
  
  // Change page
  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)))
  }

  // Form for adding/editing faculties
  const form = useForm<z.infer<typeof facultyFormSchema>>({
    resolver: zodResolver(facultyFormSchema),
    defaultValues: {
      faculty_name: "",
      description: "",
      head_doctor_id: "",
      location: ""
    }
  })

  // Reset form when dialog opens/closes
  const resetForm = () => {
    form.reset({
      faculty_name: "",
      description: "",
      head_doctor_id: "",
      location: ""
    })
  }

  // Set form values when editing
  const editFaculty = (faculty: any) => {
    setEditingFaculty(faculty)
    form.reset({
      faculty_name: faculty.faculty_name,
      description: faculty.description,
      head_doctor_id: faculty.head_doctor_id,
      location: faculty.location
    })
    setIsAddDialogOpen(true)
  }

  // Handle form submission (add/edit)
  const onSubmit = (values: z.infer<typeof facultyFormSchema>) => {
    const selectedDoctor = doctors.find(doctor => doctor.id === values.head_doctor_id);
    
    if (editingFaculty) {
      setFaculties(faculties.map(faculty => 
        faculty.id === editingFaculty.id ? { 
          ...faculty, 
          ...values,
          head_doctor: selectedDoctor?.name || "" 
        } : faculty
      ))
      toast.success("Cập nhật thông tin khoa thành công!")
    } else {
      const newFaculty = {
        id: (faculties.length + 1).toString(),
        ...values,
        head_doctor: selectedDoctor?.name || "",
        total_staff: "0", 
        status: "active"
      }
      setFaculties([...faculties, newFaculty])
      toast.success("Thêm khoa mới thành công!")
    }
    setIsAddDialogOpen(false)
    setEditingFaculty(null)
    resetForm()
  }

  // Handle faculty deletion
  const deleteFaculty = (id: string) => {
    setFaculties(faculties.filter(faculty => faculty.id !== id))
    toast.success("Đã xóa khoa thành công!")
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản Lý Khoa</h2>
          <p className="text-muted-foreground mt-1">Quản lý danh sách các khoa trong bệnh viện</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="gap-2 text-base font-medium"
              onClick={() => {
                setEditingFaculty(null)
                resetForm()
              }}
            >
              <PlusCircle className="h-5 w-5" /> Thêm khoa mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingFaculty ? "Chỉnh sửa thông tin khoa" : "Thêm khoa mới"}</DialogTitle>
              <DialogDescription>
                {editingFaculty ? "Cập nhật thông tin cho khoa hiện có" : "Nhập thông tin để thêm khoa mới vào hệ thống"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="faculty_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Tên khoa</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Building className="h-5 w-5 text-primary" />
                          <Input 
                            placeholder="Nhập tên khoa" 
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
                      <FormLabel className="text-base font-semibold">Mô tả</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nhập mô tả chi tiết về khoa" 
                          {...field} 
                          className="bg-background border-2 text-foreground min-h-[100px] text-base" 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-30">
                  <FormField
                    control={form.control}
                    name="head_doctor_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Trưởng khoa</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-primary" />
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full bg-background border-2 text-foreground py-3 h-[46px]">
                                <SelectValue placeholder="Chọn trưởng khoa" />
                              </SelectTrigger>
                              <SelectContent>
                                {doctors.map((doctor) => (
                                  <SelectItem key={doctor.id} value={doctor.id}>
                                    {doctor.name} - {doctor.specialty}
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
                  
                  {editingFaculty && (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Số bác sĩ</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-primary" />
                          <div className="flex items-center justify-start bg-background/50 border-2 border-input rounded-md w-full px-3 h-[46px] text-base text-foreground cursor-not-allowed">
                            <span>{editingFaculty.total_staff}</span>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Vị trí</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <Input 
                            placeholder="Nhập vị trí của khoa trong bệnh viện" 
                            {...field} 
                            className="bg-background border-2 text-foreground py-5 text-base" 
                          />
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
                    {editingFaculty ? "Cập nhật" : "Thêm khoa"}
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
            placeholder="Tìm kiếm theo tên khoa, trưởng khoa..."
            className="pl-8 border-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


          <Table className="w-full">
            <TableHeader className="bg-muted">
              <TableRow className="bg-muted hover:bg-muted border-b border-border">
                <TableHead className="font-bold text-sm px-3 py-2.5">Tên khoa</TableHead>
                <TableHead className="font-bold text-sm px-3 py-2.5">Trưởng khoa</TableHead>
                <TableHead className="font-bold text-sm px-3 py-2.5">Số bác sĩ</TableHead>
                <TableHead className="font-bold text-sm px-3 py-2.5">Vị trí</TableHead>
                <TableHead className="font-bold text-sm px-3 py-2.5">Trạng thái</TableHead>
                <TableHead className="text-right font-bold text-sm px-3 py-2.5">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFaculties.length > 0 ? (
                currentFaculties.map((faculty) => (
                  <TableRow 
                    key={faculty.id} 
                    className="hover:bg-muted/30 border-b border-border/40 transition-colors"
                  >
                    <TableCell className="font-semibold text-base py-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        {faculty.faculty_name}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary/70" />
                        {faculty.head_doctor}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary/70" />
                        <span className="font-medium">{faculty.total_staff}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary/70" />
                        {faculty.location}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant={faculty.status === "active" ? "default" : "secondary"}
                        className={`px-3 py-1 ${faculty.status === "active" ? "bg-green-500/20 text-green-700 hover:bg-green-500/20 dark:bg-green-500/30 dark:text-green-300" : "bg-amber-500/20 text-amber-700 hover:bg-amber-500/20 dark:bg-amber-500/30 dark:text-amber-300"}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${faculty.status === "active" ? "bg-green-500" : "bg-amber-500"}`}></div>
                          {faculty.status === "active" ? "Hoạt động" : "Bảo trì"}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => editFaculty(faculty)} className="gap-2">
                            <Edit2 className="h-4 w-4" /> Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive gap-2"
                            onClick={() => deleteFaculty(faculty.id)}
                          >
                            <Trash2 className="h-4 w-4" /> Xóa khoa
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
                      Không tìm thấy khoa nào
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination*/}
          {filteredFaculties.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="flex-1 text-sm text-muted-foreground">
                Hiển thị <span className="font-medium">{indexOfFirstFaculty + 1}</span> đến <span className="font-medium">
                  {Math.min(indexOfLastFaculty, filteredFaculties.length)}
                </span> trong số <span className="font-medium">{filteredFaculties.length}</span> khoa
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
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
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
                    )
                  })}
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