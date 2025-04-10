"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  TrendingUp,
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
} from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"

// Mock data for payments
const mockPayments = [
  {
    payment_id: "PAY001",
    payment_date: "2024-03-20T08:30:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT001",
    total_price: "1500000",
    created_at: "2024-03-20T08:30:00Z",
    updated_at: "2024-03-20T08:30:00Z",
    status: "SUCCESS",
    appointment: {
      user_name: "Nguyễn Văn An",
      service_name: "Khám sức khỏe tổng quát"
    }
  },
  {
    payment_id: "PAY002",
    payment_date: "2024-03-20T09:15:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT002",
    total_price: "2500000",
    created_at: "2024-03-20T09:15:00Z",
    updated_at: "2024-03-20T09:15:00Z",
    status: "SUCCESS",
    appointment: {
      user_name: "Trần Thị Bình",
      service_name: "Nội soi dạ dày"
    }
  },
  {
    payment_id: "PAY003",
    payment_date: "2024-03-20T10:00:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT003",
    total_price: "800000",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    status: "PENDING",
    appointment: {
      user_name: "Lê Văn Cường",
      service_name: "Xét nghiệm máu tổng quát"
    }
  },
  {
    payment_id: "PAY004",
    payment_date: "2024-03-20T10:30:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT004",
    total_price: "500000",
    created_at: "2024-03-20T10:30:00Z",
    updated_at: "2024-03-20T10:30:00Z",
    status: "FAILED",
    appointment: {
      user_name: "Phạm Thị Dung",
      service_name: "Khám thai định kỳ"
    }
  },
  {
    payment_id: "PAY005",
    payment_date: "2024-03-20T11:00:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT005",
    total_price: "3500000",
    created_at: "2024-03-20T11:00:00Z",
    updated_at: "2024-03-20T11:00:00Z",
    status: "SUCCESS",
    appointment: {
      user_name: "Hoàng Văn Em",
      service_name: "Chụp cộng hưởng từ (MRI)"
    }
  },
  {
    payment_id: "PAY006",
    payment_date: "2024-03-20T13:30:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT006",
    total_price: "1200000",
    created_at: "2024-03-20T13:30:00Z",
    updated_at: "2024-03-20T13:30:00Z",
    status: "SUCCESS",
    appointment: {
      user_name: "Ngô Thị Phương",
      service_name: "Siêu âm thai 4D"
    }
  },
  {
    payment_id: "PAY007",
    payment_date: "2024-03-20T14:15:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT007",
    total_price: "900000",
    created_at: "2024-03-20T14:15:00Z",
    updated_at: "2024-03-20T14:15:00Z",
    status: "PENDING",
    appointment: {
      user_name: "Vũ Đình Quang",
      service_name: "Khám chuyên khoa Tim mạch"
    }
  },
  {
    payment_id: "PAY008",
    payment_date: "2024-03-20T15:00:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT008",
    total_price: "4500000",
    created_at: "2024-03-20T15:00:00Z",
    updated_at: "2024-03-20T15:00:00Z",
    status: "SUCCESS",
    appointment: {
      user_name: "Đặng Thị Hương",
      service_name: "Nội soi đại tràng"
    }
  },
  {
    payment_id: "PAY009",
    payment_date: "2024-03-20T15:45:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT009",
    total_price: "750000",
    created_at: "2024-03-20T15:45:00Z",
    updated_at: "2024-03-20T15:45:00Z",
    status: "CANCELLED",
    appointment: {
      user_name: "Bùi Văn Tùng",
      service_name: "Khám mắt tổng quát"
    }
  },
  {
    payment_id: "PAY010",
    payment_date: "2024-03-20T16:30:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT010",
    total_price: "2800000",
    created_at: "2024-03-20T16:30:00Z",
    updated_at: "2024-03-20T16:30:00Z",
    status: "SUCCESS",
    appointment: {
      user_name: "Mai Thị Lan",
      service_name: "Chụp X-quang răng toàn hàm"
    }
  },
  {
    payment_id: "PAY011",
    payment_date: "2024-03-19T09:00:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT011",
    total_price: "1800000",
    created_at: "2024-03-19T09:00:00Z",
    updated_at: "2024-03-19T09:00:00Z",
    status: "SUCCESS",
    appointment: {
      user_name: "Trịnh Văn Minh",
      service_name: "Khám và điều trị vật lý trị liệu"
    }
  },
  {
    payment_id: "PAY012",
    payment_date: "2024-03-19T10:30:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT012",
    total_price: "5500000",
    created_at: "2024-03-19T10:30:00Z",
    updated_at: "2024-03-19T10:30:00Z",
    status: "SUCCESS",
    appointment: {
      user_name: "Lý Thị Nga",
      service_name: "Phẫu thuật nội soi khớp gối"
    }
  },
  {
    payment_id: "PAY013",
    payment_date: "2024-03-19T13:00:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT013",
    total_price: "1600000",
    created_at: "2024-03-19T13:00:00Z",
    updated_at: "2024-03-19T13:00:00Z",
    status: "PENDING",
    appointment: {
      user_name: "Phan Văn Hoàng",
      service_name: "Điện tim và đo huyết áp 24h"
    }
  },
  {
    payment_id: "PAY014",
    payment_date: "2024-03-19T14:30:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT014",
    total_price: "3200000",
    created_at: "2024-03-19T14:30:00Z",
    updated_at: "2024-03-19T14:30:00Z",
    status: "SUCCESS",
    appointment: {
      user_name: "Dương Thị Thảo",
      service_name: "Chụp CT Scanner não"
    }
  },
  {
    payment_id: "PAY015",
    payment_date: "2024-03-19T15:45:00Z",
    payment_method: "VNPAY",
    appointment_id: "APT015",
    total_price: "950000",
    created_at: "2024-03-19T15:45:00Z",
    updated_at: "2024-03-19T15:45:00Z",
    status: "SUCCESS",
    appointment: {
      user_name: "Nguyễn Thị Kim",
      service_name: "Khám và tư vấn dinh dưỡng"
    }
  }
]

export default function HospitalRevenue() {
  const [payments, setPayments] = useState(mockPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Filter payments based on search term and date range
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.appointment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.appointment.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const paymentDate = new Date(payment.payment_date)
    const isInDateRange = 
      (!dateRange?.from || paymentDate >= dateRange.from) &&
      (!dateRange?.to || paymentDate <= dateRange.to)
    
    return matchesSearch && isInDateRange
  })
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  
  // Get current payments
  const indexOfLastPayment = currentPage * itemsPerPage
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment)
  
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate statistics
  const calculateStats = () => {
    const totalRevenue = filteredPayments
      .filter(payment => payment.status === "SUCCESS")
      .reduce((sum, payment) => sum + parseInt(payment.total_price), 0)
    
    const pendingRevenue = filteredPayments
      .filter(payment => payment.status === "PENDING")
      .reduce((sum, payment) => sum + parseInt(payment.total_price), 0)
    
    const successCount = filteredPayments.filter(payment => payment.status === "SUCCESS").length
    const totalCount = filteredPayments.length
    const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0

    return {
      totalRevenue,
      pendingRevenue,
      successRate
    }
  }

  const stats = calculateStats()

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-500/20 text-green-700 hover:bg-green-500/20 dark:bg-green-500/30 dark:text-green-300"
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/20 dark:bg-yellow-500/30 dark:text-yellow-300"
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
      case "PENDING":
        return "Đang xử lý"
      case "FAILED":
        return "Thất bại"
      case "CANCELLED":
        return "Đã hủy"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản Lý Doanh Thu</h2>
        <p className="text-muted-foreground mt-1">Theo dõi và quản lý doanh thu của bệnh viện</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue.toString())}</div>
            <p className="text-xs text-muted-foreground">
              Từ các giao dịch thành công
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu chờ xử lý</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pendingRevenue.toString())}</div>
            <p className="text-xs text-muted-foreground">
              Từ các giao dịch đang chờ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ thành công</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Tỷ lệ giao dịch thành công
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã, tên bệnh nhân, dịch vụ..."
            className="pl-8 border-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DatePickerWithRange 
          date={dateRange}
          setDate={setDateRange}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Mã giao dịch</TableHead>
            <TableHead>Bệnh nhân</TableHead>
            <TableHead>Dịch vụ</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Phương thức</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPayments.length > 0 ? (
            currentPayments.map((payment) => (
              <TableRow key={payment.payment_id}>
                <TableCell className="font-medium">{payment.payment_id}</TableCell>
                <TableCell>{payment.appointment.user_name}</TableCell>
                <TableCell>{payment.appointment.service_name}</TableCell>
                <TableCell>{formatDate(payment.payment_date)}</TableCell>
                <TableCell>{payment.payment_method}</TableCell>
                <TableCell className="font-medium">{formatCurrency(payment.total_price)}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={`${getStatusBadgeColor(payment.status)}`}
                  >
                    {getStatusText(payment.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Không tìm thấy giao dịch nào
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {filteredPayments.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Hiển thị <span className="font-medium">{indexOfFirstPayment + 1}</span> đến{" "}
            <span className="font-medium">
              {Math.min(indexOfLastPayment, filteredPayments.length)}
            </span>{" "}
            trong số <span className="font-medium">{filteredPayments.length}</span> giao dịch
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Số dòng mỗi trang</p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Trang đầu</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Trang trước</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Trang sau</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Trang cuối</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 