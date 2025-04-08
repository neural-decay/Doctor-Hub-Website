import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  BarChart,
  Archive,
  PenSquare,
  Calendar,
  TrendingUp,
  Activity,
  Award,
} from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";

interface DailyStats {
  date: string;
  published: number;
}

export default function ManagerDashboard() {
  // Dữ liệu mẫu cho 30 ngày gần nhất
  const [chartData, setChartData] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Trong ứng dụng thực tế, đây sẽ là lời gọi API để lấy dữ liệu
    const generateData = () => {
      setIsLoading(true);
      const data: DailyStats[] = [];
      const today = new Date();

      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);

        data.push({
          date: date.toLocaleDateString("vi-VN", {
            month: "short",
            day: "numeric",
          }),
          published: Math.floor(Math.random() * 3), // 0-2 bài viết được đăng mỗi ngày
        });
      }

      // Giả lập độ trễ tải dữ liệu
      setTimeout(() => {
        setChartData(data);
        setIsLoading(false);
      }, 800);
    };

    generateData();
  }, []);

  // Tính tổng số bài viết đã đăng
  const totalPublished = chartData.reduce((sum, day) => sum + day.published, 0);

  // Tính số bài viết trung bình mỗi ngày
  const avgPublishedPerDay = totalPublished / (chartData.length || 1);

  // Tìm ngày có nhiều bài đăng nhất
  const bestDay =
    chartData.length > 0
      ? chartData.reduce(
          (max, day) => (day.published > max.published ? day : max),
          chartData[0]
        )
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Tổng quan về hoạt động nội dung của bạn
        </p>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden border-b-4 border-b-blue-500 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent">
            <CardTitle className="text-sm font-medium">
              Bài Viết Của Tôi
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <PenSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +3 bài mới trong tuần này
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-b-4 border-b-indigo-500 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-indigo-50 to-transparent dark:from-indigo-950/30 dark:to-transparent">
            <CardTitle className="text-sm font-medium">Đã Đăng</CardTitle>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
              <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground mt-1">
              75% tổng số bài viết
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-b-4 border-b-amber-500 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/30 dark:to-transparent">
            <CardTitle className="text-sm font-medium">Đã Lưu Trữ</CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
              <Archive className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground mt-1">
              25% tổng số bài viết
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ 30 ngày */}
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="mr-2 h-5 w-5 text-indigo-500" />
            Hoạt Động Nội Dung (30 Ngày Gần Đây)
          </CardTitle>
          <CardDescription>
            Tổng quan các bài viết đã đăng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[400px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div className="mt-2 h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    stroke="#888888"
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#888888"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      border: "none",
                    }}
                    cursor={{ fill: "rgba(79, 70, 229, 0.05)" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar
                    dataKey="published"
                    name="Bài Đã Đăng"
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#818cf8"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                  </defs>
                </RechartsBarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tóm tắt tháng */}
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
            Tóm Tắt Tháng
          </CardTitle>
          <CardDescription>
            Hiệu suất nội dung của bạn trong tháng này
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                <span className="text-sm">Tổng Bài Viết Đã Đăng</span>
              </div>
              <span className="font-medium bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 py-1 px-2 rounded-md">
                {totalPublished}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-sm">Trung Bình Bài Đăng Hàng Ngày</span>
              </div>
              <span className="font-medium bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 py-1 px-2 rounded-md">
                {avgPublishedPerDay.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-amber-500" />
                <span className="text-sm">Ngày Có Nhiều Bài Đăng Nhất</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-medium bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-300 py-1 px-2 rounded-md">
                  {bestDay ? bestDay.date : "N/A"}
                  {bestDay && (
                    <span className="ml-1">({bestDay.published} bài)</span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm">Ngày Có Hoạt Động Gần Nhất</span>
              </div>
              <span className="font-medium bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 py-1 px-2 rounded-md">
                {chartData.length > 0
                  ? chartData[chartData.length - 1].date
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
