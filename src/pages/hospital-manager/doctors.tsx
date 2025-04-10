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
  Users, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Award,
  BookOpen,
  Languages,
  UserPlus,
  Mail,
  Phone
} from "lucide-react"
import * as z from "zod"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

// Define form schema with Zod
const doctorFormSchema = z.object({
  full_name: z.string().min(3, { message: "Tên bác sĩ phải có ít nhất 3 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  gender: z.enum(["MALE", "FEMALE"], { 
    required_error: "Vui lòng chọn giới tính" 
  }),
  profile: z.string().min(10, { message: "Hồ sơ bác sĩ phải có ít nhất 10 ký tự" }),
  specialties: z.string().min(3, { message: "Chuyên khoa không được để trống" }),
  education: z.string().min(3, { message: "Học vấn không được để trống" }),
  faculty_id: z.string({
    required_error: "Vui lòng chọn khoa",
  }),
  status: z.enum(["ACTIVE", "DISABLE"], {
    required_error: "Vui lòng chọn trạng thái",
  }),
})

// Mock data for departments/faculties
const mockFaculties = [
  { id: "fac1", faculty_name: "Khoa Nội" },
  { id: "fac2", faculty_name: "Khoa Ngoại" },
  { id: "fac3", faculty_name: "Khoa Cấp cứu" },
  { id: "fac4", faculty_name: "Khoa Nhi" },
  { id: "fac5", faculty_name: "Khoa Sản" },
]

// Mock data for doctors
const mockDoctors = [
  {
    user_id: "doc1",
    full_name: "PGS.TS. Nguyễn Văn A",
    email: "nguyen.van.a@hospital.com",
    phone: "0912345678",
    gender: "MALE",
    profile: "Bác sĩ với hơn 15 năm kinh nghiệm trong lĩnh vực nội khoa",
    specialties: "Tim mạch, hô hấp",
    education: "Đại học Y Hà Nội, Tiến sĩ Y khoa",
    awards: "Thầy thuốc ưu tú",
    languages: "Tiếng Việt, Tiếng Anh",
    faculty_id: "fac1",
    faculty_name: "Khoa Nội",
    status: "ACTIVE"
  },
  {
    user_id: "doc2",
    full_name: "GS.TS. Trần Thị B",
    email: "tran.thi.b@hospital.com",
    phone: "0923456789",
    gender: "FEMALE",
    profile: "Giáo sư với hơn 20 năm kinh nghiệm trong lĩnh vực phẫu thuật",
    specialties: "Phẫu thuật tổng quát, tiêu hóa",
    education: "Đại học Y Hà Nội, Tiến sĩ Y khoa, Du học Pháp",
    awards: "Thầy thuốc nhân dân, Huân chương lao động hạng Nhì",
    languages: "Tiếng Việt, Tiếng Anh, Tiếng Pháp",
    faculty_id: "fac2",
    faculty_name: "Khoa Ngoại",
    status: "ACTIVE"
  },
  {
    user_id: "doc3",
    full_name: "TS. Phạm Văn C",
    email: "pham.van.c@hospital.com",
    phone: "0934567890",
    gender: "MALE",
    profile: "Chuyên gia cấp cứu với 12 năm kinh nghiệm",
    specialties: "Cấp cứu, hồi sức tích cực",
    education: "Đại học Y Hà Nội, Tiến sĩ Y khoa tại Mỹ",
    awards: "Bác sĩ xuất sắc năm 2021",
    languages: "Tiếng Việt, Tiếng Anh",
    faculty_id: "fac3",
    faculty_name: "Khoa Cấp cứu",
    status: "ACTIVE"
  },
  {
    user_id: "doc4",
    full_name: "PGS.TS. Lê Thị D",
    email: "le.thi.d@hospital.com",
    phone: "0945678901",
    gender: "FEMALE",
    profile: "Chuyên gia nhi khoa hàng đầu với 18 năm kinh nghiệm",
    specialties: "Nhi khoa, hô hấp nhi",
    education: "Đại học Y Hà Nội, Tiến sĩ Y khoa",
    awards: "Thầy thuốc ưu tú",
    languages: "Tiếng Việt, Tiếng Anh",
    faculty_id: "fac4",
    faculty_name: "Khoa Nhi",
    status: "ACTIVE"
  },
  {
    user_id: "doc5",
    full_name: "TS. Hoàng Văn E",
    email: "hoang.van.e@hospital.com",
    phone: "0956789012",
    gender: "MALE",
    profile: "Bác sĩ sản khoa với 10 năm kinh nghiệm",
    specialties: "Sản phụ khoa, Siêu âm thai",
    education: "Đại học Y Thái Nguyên, Tiến sĩ Y khoa",
    awards: "Bác sĩ xuất sắc năm 2022",
    languages: "Tiếng Việt, Tiếng Anh",
    faculty_id: "fac5",
    faculty_name: "Khoa Sản",
    status: "DISABLE"
  },
  {
    user_id: "doc6",
    full_name: "TS. Hoàng Văn E",
    email: "hoang.van.e@hospital.com",
    phone: "0956789012",
    gender: "MALE",
    profile: "Bác sĩ sản khoa với 10 năm kinh nghiệm",
    specialties: "Sản phụ khoa, Siêu âm thai",
    education: "Đại học Y Thái Nguyên, Tiến sĩ Y khoa",
    awards: "Bác sĩ xuất sắc năm 2022",
    languages: "Tiếng Việt, Tiếng Anh",
    faculty_id: "fac5",
    faculty_name: "Khoa Sản",
    status: "DISABLE"
  }
]

export default function HospitalDoctors() {
  const [doctors, setDoctors] = useState(mockDoctors)
  const [faculties, setFaculties] = useState(mockFaculties) 
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.faculty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialties.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)
  
  // Get current doctors
  const indexOfLastDoctor = currentPage * itemsPerPage
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
  
  // Change page
  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)))
  }

  // Form for adding/editing doctors
  const form = useForm<z.infer<typeof doctorFormSchema>>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      gender: "MALE",
      profile: "",
      specialties: "",
      education: "",
      faculty_id: "",
      status: "ACTIVE"
    }
  })

  // Reset form when dialog opens/closes
  const resetForm = () => {
    form.reset({
      full_name: "",
      email: "",
      phone: "",
      gender: "MALE",
      profile: "",
      specialties: "",
      education: "",
      faculty_id: "",
      status: "ACTIVE"
    })
  }

  // Set form values when editing
  const editDoctor = (doctor: any) => {
    setEditingDoctor(doctor)
    form.reset({
      full_name: doctor.full_name,
      email: doctor.email,
      phone: doctor.phone,
      gender: doctor.gender,
      profile: doctor.profile,
      specialties: doctor.specialties,
      education: doctor.education,
      faculty_id: doctor.faculty_id,
      status: doctor.status
    })
    setIsAddDialogOpen(true)
  }

  // Handle form submission (add/edit)
  const onSubmit = (values: z.infer<typeof doctorFormSchema>) => {
    // Find selected faculty
    const selectedFaculty = faculties.find(faculty => faculty.id === values.faculty_id);
    
    if (editingDoctor) {
      // Update existing doctor
      setDoctors(doctors.map(doctor => 
        doctor.user_id === editingDoctor.user_id ? { 
          ...doctor, 
          ...values,
          faculty_name: selectedFaculty?.faculty_name || "",
        } : doctor
      ))
      toast.success("Cập nhật thông tin bác sĩ thành công!")
    } else {
      // Add new doctor
      const newDoctor = {
        user_id: `doc${doctors.length + 1}`,
        ...values,
        faculty_name: selectedFaculty?.faculty_name || "",
        awards: "",
        languages: ""
      }
      setDoctors([...doctors, newDoctor])
      toast.success("Thêm bác sĩ mới thành công!")
    }
    setIsAddDialogOpen(false)
    setEditingDoctor(null)
    resetForm()
  }

  // Handle doctor deletion
  const deleteDoctor = (id: string) => {
    setDoctors(doctors.filter(doctor => doctor.user_id !== id))
    toast.success("Đã xóa bác sĩ thành công!")
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản Lý Bác Sĩ</h2>
          <p className="text-muted-foreground mt-1">Quản lý danh sách bác sĩ trong bệnh viện</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="gap-2 text-base font-medium"
              onClick={() => {
                setEditingDoctor(null)
                resetForm()
              }}
            >
              <UserPlus className="h-5 w-5" /> Thêm bác sĩ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Chỉnh sửa thông tin bác sĩ" : "Thêm bác sĩ mới"}</DialogTitle>
              <DialogDescription>
                {editingDoctor ? "Cập nhật thông tin cho bác sĩ hiện có" : "Nhập thông tin để thêm bác sĩ mới vào hệ thống"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Họ tên bác sĩ</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-primary" />
                          <Input 
                            placeholder="Nhập họ tên đầy đủ" 
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Email</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-5 w-5 text-primary" />
                            <Input 
                              placeholder="Email liên hệ" 
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Số điện thoại</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5 text-primary" />
                            <Input 
                              placeholder="Số điện thoại" 
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Giới tính</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-primary" />
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full bg-background border-2 text-foreground py-2 h-[46px]">
                                <SelectValue placeholder="Chọn giới tính" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MALE">Nam</SelectItem>
                                <SelectItem value="FEMALE">Nữ</SelectItem>
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
                    name="faculty_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Khoa</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Building className="h-5 w-5 text-primary" />
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full bg-background border-2 text-foreground py-2 h-[46px]">
                                <SelectValue placeholder="Chọn khoa làm việc" />
                              </SelectTrigger>
                              <SelectContent>
                                {faculties.map((faculty) => (
                                  <SelectItem key={faculty.id} value={faculty.id}>
                                    {faculty.faculty_name}
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
                  name="specialties"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Chuyên khoa</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-primary" />
                          <Input 
                            placeholder="Các chuyên khoa, ngăn cách bằng dấu phẩy" 
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
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Học vấn</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <Input 
                            placeholder="Thông tin học vấn, bằng cấp" 
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
                  name="profile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Hồ sơ chuyên môn</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Mô tả chi tiết về kinh nghiệm và chuyên môn của bác sĩ" 
                          {...field} 
                          className="bg-background border-2 text-foreground min-h-[100px] text-base" 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Trạng thái</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-primary" />
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full bg-background border-2 text-foreground py-2 h-[46px]">
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                              <SelectItem value="DISABLE">Vô hiệu</SelectItem>
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
                    {editingDoctor ? "Cập nhật" : "Thêm bác sĩ"}
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
            placeholder="Tìm kiếm theo tên, khoa, chuyên khoa..."
            className="pl-8 border-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


          <Table className="w-full">
            <TableHeader className="bg-muted">
              <TableRow className="bg-muted hover:bg-muted border-b border-border">
                <TableHead className="font-bold text-sm px-3 py-2.5">Bác sĩ</TableHead>
                <TableHead className="font-bold text-sm px-3 py-2.5">Khoa</TableHead>
                <TableHead className="font-bold text-sm px-3 py-2.5">Chuyên khoa</TableHead>
                <TableHead className="font-bold text-sm px-3 py-2.5">Liên hệ</TableHead>
                <TableHead className="font-bold text-sm px-3 py-2.5">Trạng thái</TableHead>
                <TableHead className="text-right font-bold text-sm px-3 py-2.5 ">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDoctors.length > 0 ? (
                currentDoctors.map((doctor) => (
                  <TableRow 
                    key={doctor.user_id} 
                    className="hover:bg-muted/30 border-b border-border/40 transition-colors"
                  >
                    <TableCell className="font-semibold text-base py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <div>{doctor.full_name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.education}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary/70" />
                        {doctor.faculty_name}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary/70" />
                        <span className="line-clamp-2">{doctor.specialties}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary/70" />
                          <span className="text-sm">{doctor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary/70" />
                          <span className="text-sm">{doctor.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant={doctor.status === "ACTIVE" ? "default" : "secondary"}
                        className={`px-3 py-1 ${doctor.status === "ACTIVE" ? "bg-green-500/20 text-green-700 hover:bg-green-500/20 dark:bg-green-500/30 dark:text-green-300" : "bg-amber-500/20 text-amber-700 hover:bg-amber-500/20 dark:bg-amber-500/30 dark:text-amber-300"}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${doctor.status === "ACTIVE" ? "bg-green-500" : "bg-amber-500"}`}></div>
                          {doctor.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu"}
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
                          <DropdownMenuItem onClick={() => editDoctor(doctor)} className="gap-2">
                            <Edit2 className="h-4 w-4" /> Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive gap-2"
                            onClick={() => deleteDoctor(doctor.user_id)}
                          >
                            <Trash2 className="h-4 w-4" /> Xóa bác sĩ
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
                      Không tìm thấy bác sĩ nào
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination*/}
          {filteredDoctors.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="flex-1 text-sm text-muted-foreground">
                Hiển thị <span className="font-medium">{indexOfFirstDoctor + 1}</span> đến <span className="font-medium">
                  {Math.min(indexOfLastDoctor, filteredDoctors.length)}
                </span> trong số <span className="font-medium">{filteredDoctors.length}</span> bác sĩ
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
