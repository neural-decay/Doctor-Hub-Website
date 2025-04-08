"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronRight,
  Edit,
  FolderPlus,
  ListTree,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Cấu trúc danh mục theo nested model
interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
  level: number;
  isActive: boolean;
}

// Dữ liệu mẫu
const initialCategories: Category[] = [
  {
    id: "1",
    name: "Tim mạch",
    slug: "tim-mach",
    parentId: null,
    level: 0,
    isActive: true,
    children: [
      {
        id: "1-1",
        name: "Bệnh mạch vành",
        slug: "benh-mach-vang",
        parentId: "1",
        level: 1,
        isActive: true,
      },
      {
        id: "1-2",
        name: "Rối loạn nhịp tim",
        slug: "roi-loan-nhip-tim",
        parentId: "1",
        level: 1,
        isActive: true,
      },
    ],
  },
  {
    id: "2",
    name: "Thần kinh",
    slug: "than-kinh",
    parentId: null,
    level: 0,
    isActive: true,
    children: [
      {
        id: "2-1",
        name: "Đau đầu migraine",
        slug: "dau-dau-migraine",
        parentId: "2",
        level: 1,
        isActive: false,
      },
    ],
  },
  {
    id: "3",
    name: "Dinh dưỡng",
    slug: "dinh-duong",
    parentId: null,
    level: 0,
    isActive: true,
  },
];

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    parentId: "",
    isActive: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["1", "2"])
  );

  // Lấy tất cả danh mục ở dạng phẳng (không phân cấp)
  const getAllCategories = (categoriesArr: Category[]): Category[] => {
    const result: Category[] = [];

    const flatten = (cats: Category[]) => {
      for (const cat of cats) {
        result.push(cat);
        if (cat.children) {
          flatten(cat.children);
        }
      }
    };

    flatten(categoriesArr);
    return result;
  };

  const flatCategories = getAllCategories(categories);

  // Lọc danh mục theo từ khóa tìm kiếm
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý tạo/chỉnh sửa danh mục
  const handleSaveCategory = () => {
    if (editingCategory) {
      // Chỉnh sửa danh mục
      const updatedCategories = updateCategoryInTree(
        categories,
        editingCategory.id,
        {
          ...editingCategory,
          name: newCategory.name || editingCategory.name,
          slug: newCategory.slug || editingCategory.slug,
          parentId: newCategory.parentId || editingCategory.parentId,
          isActive: newCategory.isActive,
        }
      );
      setCategories(updatedCategories);
    } else {
      // Tạo danh mục mới
      const newCat: Category = {
        id: Date.now().toString(),
        name: newCategory.name,
        slug: newCategory.slug || generateSlug(newCategory.name),
        parentId: newCategory.parentId || null,
        level: newCategory.parentId ? 1 : 0,
        isActive: newCategory.isActive,
      };

      if (newCategory.parentId) {
        // Thêm vào danh mục con
        const updatedCategories = addChildCategory(
          categories,
          newCategory.parentId,
          newCat
        );
        setCategories(updatedCategories);
      } else {
        // Thêm vào danh mục gốc
        setCategories([...categories, newCat]);
      }
    }

    // Reset form và đóng dialog
    setIsDialogOpen(false);
    setEditingCategory(null);
    setNewCategory({
      name: "",
      slug: "",
      parentId: "",
      isActive: true,
    });
  };

  // Xử lý xóa danh mục
  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = deleteCategoryFromTree(categories, categoryId);
    setCategories(updatedCategories);
  };

  // Xử lý chỉnh sửa danh mục
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId || "",
      isActive: category.isActive,
    });
    setIsDialogOpen(true);
  };

  // Xử lý tạo danh mục mới
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setNewCategory({
      name: "",
      slug: "",
      parentId: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  // Hàm tự động tạo slug từ tên
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  };

  // Tự động tạo slug khi người dùng nhập tên
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewCategory({
      ...newCategory,
      name,
      slug: generateSlug(name),
    });
  };

  // Thêm danh mục con vào cây danh mục
  const addChildCategory = (
    categories: Category[],
    parentId: string,
    newChild: Category
  ): Category[] => {
    return categories.map((category) => {
      if (category.id === parentId) {
        return {
          ...category,
          children: [
            ...(category.children || []),
            { ...newChild, level: category.level + 1 },
          ],
        };
      }

      if (category.children) {
        return {
          ...category,
          children: addChildCategory(category.children, parentId, newChild),
        };
      }

      return category;
    });
  };

  // Cập nhật danh mục trong cây
  const updateCategoryInTree = (
    categories: Category[],
    categoryId: string,
    updatedCategory: Category
  ): Category[] => {
    return categories.map((category) => {
      if (category.id === categoryId) {
        // Đảm bảo giữ nguyên thuộc tính children nếu có
        return {
          ...updatedCategory,
          children: category.children, // Giữ nguyên mảng children của category cũ
        };
      }

      if (category.children) {
        return {
          ...category,
          children: updateCategoryInTree(
            category.children,
            categoryId,
            updatedCategory
          ),
        };
      }

      return category;
    });
  };

  // Xóa danh mục khỏi cây
  const deleteCategoryFromTree = (
    categories: Category[],
    categoryId: string
  ): Category[] => {
    return categories
      .filter((category) => category.id !== categoryId)
      .map((category) => {
        if (category.children) {
          return {
            ...category,
            children: deleteCategoryFromTree(category.children, categoryId),
          };
        }
        return category;
      });
  };

  // Mở rộng/thu gọn danh mục
  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Hiển thị cây danh mục
  const renderCategories = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id}>
        <div
          className={cn(
            "flex items-center justify-between py-2 px-4 border-b hover:bg-slate-50 transition-colors",
            level > 0 && "pl-10"
          )}
        >
          <div className="flex items-center gap-2 flex-1">
            {category.children && category.children.length > 0 && (
              <button
                className="p-1 rounded-full hover:bg-slate-200"
                onClick={() => toggleExpand(category.id)}
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedCategories.has(category.id) && "rotate-90"
                  )}
                />
              </button>
            )}
            <span
              className={
                !category.isActive ? "text-muted-foreground line-through" : ""
              }
            >
              {category.name}
            </span>
            {!category.isActive && (
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                Ẩn
              </span>
            )}
          </div>

          <div className="text-sm text-muted-foreground">{category.slug}</div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                  <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Render children recursively */}
        {category.children && expandedCategories.has(category.id) && (
          <div>{renderCategories(category.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      {/* Header và nút tạo mới */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản Lý Danh Mục
          </h2>
          <p className="text-muted-foreground">
            Tạo và quản lý danh mục cho website
          </p>
        </div>
        <Button onClick={handleCreateCategory}>
          <Plus className="mr-2 h-4 w-4" /> Tạo Danh Mục Mới
        </Button>
      </div>

      {/* Cards tổng quan */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Số Danh Mục
            </CardTitle>
            <ListTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flatCategories.length}</div>
            <p className="text-xs text-muted-foreground">
              {flatCategories.filter((c) => !c.parentId).length} danh mục gốc,{" "}
              {flatCategories.filter((c) => c.parentId).length} danh mục con
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trạng Thái</CardTitle>
            <FolderPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {flatCategories.filter((c) => c.isActive).length} /{" "}
              {flatCategories.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Số danh mục đang hoạt động / Tổng số
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tìm kiếm */}
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm danh mục..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Danh sách danh mục */}
      <div className="border rounded-md">
        <div className="bg-slate-50 py-2 px-4 border-b flex items-center">
          <div className="flex-1 font-medium">Tên danh mục</div>
          <div className="text-sm font-medium">Slug</div>
          <div className="w-20"></div>
        </div>
        <div className="divide-y">{renderCategories(filteredCategories)}</div>
      </div>

      {/* Dialog tạo/chỉnh sửa danh mục */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Chỉnh Sửa Danh Mục" : "Tạo Danh Mục Mới"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Chỉnh sửa thông tin danh mục."
                : "Điền thông tin để tạo danh mục mới."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên danh mục</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={handleNameChange}
                placeholder="Nhập tên danh mục"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
                placeholder="nhap-ten-danh-muc"
              />
              <p className="text-xs text-muted-foreground">
                Slug sẽ được sử dụng trong URL của danh mục
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parent">Danh mục cha</Label>
              <Select
                value={newCategory.parentId}
                onValueChange={(value) =>
                  setNewCategory({ ...newCategory, parentId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục cha (nếu có)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Không có (Danh mục gốc)</SelectItem>
                  {flatCategories
                    .filter(
                      (c) =>
                        c.level === 0 &&
                        (!editingCategory || c.id !== editingCategory.id)
                    )
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={newCategory.isActive}
                onCheckedChange={(checked) =>
                  setNewCategory({
                    ...newCategory,
                    isActive: checked as boolean,
                  })
                }
              />
              <label
                htmlFor="active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Kích hoạt danh mục
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? "Cập nhật" : "Tạo danh mục"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
