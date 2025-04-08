"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Archive,
  Edit,
  FileEdit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

// Import Editor động để tránh lỗi SSR
const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-md p-4 w-full h-64 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        <div className="mt-2 h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  ),
});

// Mock data
const posts = [
  {
    id: "1",
    title: "Phương pháp điều trị tiên tiến cho bệnh tim mạch",
    content:
      "<p>Nội dung bài viết về phương pháp điều trị tiên tiến...</p><img src='/images/post-1.jpg' alt='Điều trị tim mạch'/>",
    status: "published",
    date: "2023-04-12",
    category: "Tim mạch",
    featuredImage: "/images/post-1.jpg",
  },
  // ... các bài viết khác
];

// Danh mục mẫu
const categories = [
  { id: "1", name: "Tim mạch" },
  // ... các danh mục khác
];

// Mẫu thư viện ảnh đã tải lên trước đây
const mediaLibrary = [
  { id: "1", url: "/images/post-1.jpg", alt: "Điều trị tim mạch" },
  { id: "2", url: "/images/post-2.jpg", alt: "Chăm sóc sau phẫu thuật" },
  { id: "3", url: "/images/post-3.jpg", alt: "Dinh dưỡng" },
  { id: "4", url: "/images/post-4.jpg", alt: "Dấu hiệu đột quỵ" },
];

export default function ManagerPosts() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const editorRef = useRef<any>(null);

  // Lọc bài viết dựa trên bộ lọc và từ khóa tìm kiếm
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || post.status === filter;
    const matchesCategory =
      categoryFilter === "all" || post.category === categoryFilter;

    return matchesSearch && matchesFilter && matchesCategory;
  });

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setSelectedCategory(post.category);
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setTitle("");
    setContent("");
    setSelectedCategory("");
    setIsDialogOpen(true);
  };

  const handlePublishToggle = (post: any) => {
    // Trong ứng dụng thực tế, đây sẽ là API call để thay đổi trạng thái bài viết
    console.log(
      `Toggle publish status for post ${post.id} from ${post.status}`
    );
  };

  const handleDelete = (postId: string) => {
    // Trong ứng dụng thực tế, đây sẽ là API call để xóa bài viết
    console.log(`Delete post ${postId}`);
  };

  const handleSaveContent = (status = "published") => {
    const postData = {
      title,
      content,
      category: selectedCategory,
      status,
      // Trong ứng dụng thực tế, bạn sẽ cần thêm nhiều trường khác
    };

    console.log("Saving post:", postData);
    setIsDialogOpen(false);

    // Trong thực tế, đây sẽ là lời gọi API để lưu bài viết
  };

  const insertImageToEditor = (url: string) => {
    if (editorRef.current) {
      editorRef.current.insertContent(
        `<img src="${url}" alt="Inserted image" />`
      );
    }
  };

  // Đếm số lượng bài viết theo trạng thái
  const publishedCount = posts.filter(
    (post) => post.status === "published"
  ).length;
  const archivedCount = posts.filter(
    (post) => post.status === "archived"
  ).length;

  return (
    <div className="space-y-4">
      {/* Header và nút tạo mới */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản Lý Bài Viết
          </h2>
          <p className="text-muted-foreground">
            Tạo và quản lý nội dung của bạn
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> Tạo Bài Viết Mới
        </Button>
      </div>

      {/* Tabs tổng quan */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className={cn(
            "hover:shadow-md transition-colors",
            "border-l-4 border-l-green-500"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Số Bài Viết
            </CardTitle>
            <FileEdit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "hover:shadow-md transition-colors",
            "border-l-4 border-l-blue-500"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã Đăng</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "hover:shadow-md transition-colors",
            "border-l-4 border-l-amber-500"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã Lưu Trữ</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{archivedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả Bài Viết</SelectItem>
              <SelectItem value="published">Đã Đăng</SelectItem>
              <SelectItem value="archived">Đã Lưu Trữ</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả Danh Mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài viết..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%] text-center">Tiêu đề</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">Danh mục</TableHead>
              <TableHead className="text-center">Ngày tạo</TableHead>
              <TableHead className="w-[5%] text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Badge
                        variant={
                          post.status === "published" ? "default" : "outline"
                        }
                        className={
                          post.status === "published"
                            ? "bg-green-500 hover:bg-green-600"
                            : "text-amber-500 border-amber-500 hover:bg-amber-50"
                        }
                      >
                        {post.status === "published" ? "Đã Đăng" : "Đã Lưu Trữ"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{post.category}</TableCell>
                  <TableCell className="text-center">{post.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tác Vụ</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(post)}>
                          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePublishToggle(post)}
                        >
                          {post.status === "published" ? (
                            <>
                              <Archive className="mr-2 h-4 w-4" /> Lưu trữ
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" /> Đăng lại
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(post.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  Không tìm thấy bài viết phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog tạo/chỉnh sửa bài viết */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Chỉnh Sửa Bài Viết" : "Tạo Bài Viết Mới"}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? "Chỉnh sửa thông tin và nội dung bài viết của bạn."
                : "Điền thông tin để tạo bài viết mới."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Danh mục</SelectLabel>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Nội dung bài viết</Label>
              <Editor
                initialValue={content}
                onEditorChange={(content) => setContent(content)}
                onInit={(_evt, editor) => (editorRef.current = editor)}
              />
            </div>

            {/* Phần thư viện ảnh */}
            <div className="grid gap-2 mt-2">
              <Label>Thư viện ảnh</Label>
              <Tabs defaultValue="upload">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Tải ảnh mới</TabsTrigger>
                  <TabsTrigger value="library">Thư viện ảnh</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="p-4 border rounded-md">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Kéo ảnh vào đây hoặc click để chọn
                      </span>
                    </label>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Tải lên ảnh để sử dụng trong bài viết của bạn
                  </div>
                </TabsContent>
                <TabsContent value="library" className="p-4 border rounded-md">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mediaLibrary.map((image) => (
                      <div
                        key={image.id}
                        className="aspect-square border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary relative group"
                        onClick={() => insertImageToEditor(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="secondary">
                            Chèn
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              <p className="text-sm text-muted-foreground">
                Tip: Bạn có thể chèn ảnh trực tiếp vào bài viết bằng cách chọn
                từ thư viện ảnh
              </p>
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="text-amber-500 border-amber-500 hover:bg-amber-50"
                onClick={() => handleSaveContent("archived")}
              >
                <Archive className="mr-2 h-4 w-4" />
                Lưu trữ
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => handleSaveContent("published")}>
                {editingPost ? "Cập nhật" : "Đăng bài"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
