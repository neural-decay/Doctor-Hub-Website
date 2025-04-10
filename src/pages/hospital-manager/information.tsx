"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Hospital, Building2, Clock, MapPin, FileText, Save, Info, Edit } from "lucide-react"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

// Define form schema with Zod
const formSchema = z.object({
  hospital_name: z.string().min(3, { message: "Tên bệnh viện phải có ít nhất 3 ký tự" }),
  hospital_info: z.string().min(10, { message: "Thông tin bệnh viện phải có ít nhất 10 ký tự" }),
  working_hour: z.string().min(3, { message: "Giờ làm việc phải có ít nhất 3 ký tự" }),
  patient_guide: z.string().min(10, { message: "Hướng dẫn bệnh nhân phải có ít nhất 10 ký tự" }),
  address: z.string().min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự" }),
})

// Mock hospital data
const mockHospitalData = {
  hospital_id: "550e8400-e29b-41d4-a716-446655440000",
  hospital_name: "Bệnh Viện Đa Khoa Trung Ương",
  hospital_info: "Bệnh viện đa khoa Trung Ương là một trong những cơ sở y tế hàng đầu tại Việt Nam, cung cấp dịch vụ chăm sóc sức khỏe toàn diện với đội ngũ y bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại.",
  working_hour: "Thứ Hai - Thứ Sáu: 7:00 - 20:00\nThứ Bảy - Chủ Nhật: 7:00 - 17:00\nCấp cứu: 24/7",
  patient_guide: "1. Đăng ký khám tại quầy lễ tân hoặc đặt lịch trực tuyến\n2. Mang theo CMND/CCCD và thẻ BHYT (nếu có)\n3. Đến trước giờ hẹn 15 phút\n4. Tuân thủ hướng dẫn của nhân viên y tế",
  address: "10 Đường Giải Phóng, Quận Hai Bà Trưng, Hà Nội, Việt Nam",
}

export default function HospitalInformation() {
  const [isEditing, setIsEditing] = useState(false)
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: mockHospitalData,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the data to your API
    console.log(values)
    toast.success("Đã lưu thông tin bệnh viện thành công!")
    setIsEditing(false)
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Thông Tin Bệnh Viện</h2>
          <p className="text-muted-foreground mt-1">Quản lý thông tin chi tiết của bệnh viện</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)} 
          variant={isEditing ? "destructive" : "default"}
          size="lg"
          className="gap-2 text-base font-medium"
        >
          {isEditing 
            ? "Hủy" 
            : <><Edit className="h-5 w-5" /> Chỉnh sửa</>
          }
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="w-full overflow-x-hidden">
            <Tabs defaultValue="basic" className="w-full">
              <div className="overflow-hidden rounded-lg border border-gray-300 mb-4">
                <TabsList className="w-full flex h-14 items-center justify-center rounded-none border-b p-0">
                  <TabsTrigger 
                    value="basic" 
                    className="flex-1 h-full py-3 text-base font-medium rounded-none border-r-0 data-[state=active]:bg-primary/10"
                  >
                    <Info className="mr-2 h-5 w-5" />
                    Thông tin cơ bản
                  </TabsTrigger>
                  <div className="w-[1px] h-8 bg-gray-300"></div>
                  <TabsTrigger 
                    value="details" 
                    className="flex-1 h-full py-3 text-base font-medium rounded-none data-[state=active]:bg-primary/10"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Thông tin chi tiết
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="basic" className="space-y-4 mt-0">
                <Card className="shadow-md border-2 border-input overflow-hidden">
                  <CardHeader className="pb-3 bg-muted/30">
                    <CardTitle className="text-xl">Thông tin cơ bản</CardTitle>
                    <CardDescription>Thông tin chính về bệnh viện của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <FormField
                      control={form.control}
                      name="hospital_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Tên bệnh viện</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Hospital className="h-5 w-5 text-primary" />
                              <Input 
                                placeholder="Nhập tên bệnh viện" 
                                {...field} 
                                disabled={!isEditing}
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
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Địa chỉ</FormLabel>
                          <FormControl>
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-5 w-5 mt-2 text-primary" />
                              <Textarea 
                                placeholder="Nhập địa chỉ bệnh viện" 
                                {...field} 
                                disabled={!isEditing}
                                className="bg-background border-2 text-foreground min-h-[100px] text-base" 
                                rows={3}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="working_hour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Giờ làm việc</FormLabel>
                          <FormControl>
                            <div className="flex items-start space-x-2">
                              <Clock className="h-5 w-5 mt-2 text-primary" />
                              <Textarea 
                                placeholder="Nhập giờ làm việc" 
                                {...field} 
                                disabled={!isEditing}
                                className="bg-background border-2 text-foreground min-h-[120px] text-base" 
                                rows={4}
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-sm ml-7">Ghi rõ giờ làm việc cho từng ngày trong tuần</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4 mt-0">
                <Card className="shadow-md border-2 border-input overflow-hidden">
                  <CardHeader className="pb-3 bg-muted/30">
                    <CardTitle className="text-xl">Thông tin chi tiết</CardTitle>
                    <CardDescription>Thông tin giới thiệu và hướng dẫn cho bệnh nhân</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <FormField
                      control={form.control}
                      name="hospital_info"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Thông tin giới thiệu</FormLabel>
                          <FormControl>
                            <div className="flex items-start space-x-2">
                              <Building2 className="h-5 w-5 mt-2 text-primary" />
                              <Textarea 
                                placeholder="Nhập thông tin giới thiệu bệnh viện" 
                                {...field} 
                                disabled={!isEditing}
                                className="bg-background border-2 text-foreground min-h-[160px] text-base" 
                                rows={6}
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-sm ml-7">Mô tả chi tiết về bệnh viện, chuyên khoa và dịch vụ nổi bật</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="patient_guide"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Hướng dẫn bệnh nhân</FormLabel>
                          <FormControl>
                            <div className="flex items-start space-x-2">
                              <FileText className="h-5 w-5 mt-2 text-primary" />
                              <Textarea 
                                placeholder="Nhập hướng dẫn dành cho bệnh nhân" 
                                {...field} 
                                disabled={!isEditing}
                                className="bg-background border-2 text-foreground min-h-[160px] text-base" 
                                rows={6}
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-sm ml-7">Hướng dẫn chi tiết cho bệnh nhân khi đến khám</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {isEditing && (
            <Button 
              type="submit" 
              size="lg"
              className="mt-6 text-base font-medium py-6 px-8"
            >
              <Save className="mr-2 h-5 w-5" /> Lưu thông tin
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}
