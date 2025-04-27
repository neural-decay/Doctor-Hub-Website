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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  FolderPlus,
  ListTree,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { useCategoryTree } from "@/hooks/use-category-tree";
import { Category, CategoryCreateDto } from "@/api/types/category.types";
import { ImageUploader } from "@/components/image-uploader";

export default function CategoryManager() {
  // Use custom hook to manage category data
  const {
    categoryTree,
    isLoading,
    expandedCategories,
    toggleExpandCategory,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryTree();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    slug: "",
    parentId: null as number | null,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Since the root (level 0) is guaranteed to exist by the backend,
  // we need to get the actual visible categories (level 1 and above)
  const visibleCategories = categoryTree.flatMap((cat) => cat.children || []);

  // Expand all categories
  const expandAllCategories = () => {
    const allIds = new Set<number>();

    const collectAllIds = (cats: Category[]) => {
      for (const cat of cats) {
        if (cat.children && cat.children.length > 0) {
          allIds.add(cat.categoryId);
          collectAllIds(cat.children);
        }
      }
    };

    collectAllIds(visibleCategories);

    allIds.forEach((id) => {
      if (!expandedCategories.has(id)) {
        toggleExpandCategory(id);
      }
    });
  };

  // Collapse all categories
  const collapseAllCategories = () => {
    expandedCategories.forEach((id) => {
      toggleExpandCategory(id);
    });
  };

  // Get flattened list of all categories (excluding the hidden root)
  const getAllCategories = (categoriesArr: Category[]): Category[] => {
    const result: Category[] = [];

    const flatten = (cats: Category[], level = 0) => {
      for (const cat of cats) {
        if (level > 0) {
          // Skip hidden root
          result.push(cat);
        }
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children, level + 1);
        }
      }
    };

    flatten(categoriesArr);
    return result;
  };

  const flatCategories = getAllCategories(categoryTree);

  // Handle create/edit category
  const handleSaveCategory = async () => {
    try {
      setIsUploading(true);
      if (editingCategory) {
        // Update existing category
        await updateCategory(
          editingCategory.categoryId,
          {
            categoryName: newCategory.categoryName,
            slug: newCategory.slug,
          },
          selectedImage || undefined // Convert null to undefined
        );

        toast({
          title: "Success",
          description: "Update category successfully",
        });
      } else {
        // Create new category
        const categoryData: CategoryCreateDto = {
          categoryName: newCategory.categoryName,
          slug: newCategory.slug || generateSlug(newCategory.categoryName),
          parentId: newCategory.parentId || categoryTree[0]?.categoryId || 1,
        };

        await addCategory(categoryData, selectedImage || undefined); // Convert null to undefined

        toast({
          title: "Success",
          description: "New category created succesfully",
        });
      }

      resetFormAndCloseDialog();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error?.message || "Cannot save category",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId: number) => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa danh mục này? Tất cả danh mục con cũng sẽ bị xóa."
      )
    ) {
      try {
        await deleteCategory(categoryId);
        toast({
          title: "Success",
          description: "Delete category sucessfully",
        });
      } catch (error: any) {
        console.error("Error deleting category:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: error?.message || "Cannot delete category",
        });
      }
    }
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setParentCategory(null);
    setNewCategory({
      categoryName: category.categoryName,
      slug: category.slug,
      parentId: category.parentId,
    });
    setSelectedImage(null); // Reset selected image when editing
    setIsDialogOpen(true);
  };

  // Handle create subcategory
  const handleCreateCategory = (parent: Category | null = null) => {
    setEditingCategory(null);
    setParentCategory(parent);
    setNewCategory({
      categoryName: "",
      slug: "",
      parentId: parent ? parent.categoryId : null,
    });
    setSelectedImage(null); // Reset selected image when creating
    setIsDialogOpen(true);
  };

  // Handle create root category (level 1, child of hidden root)
  const handleCreateRootCategory = () => {
    setEditingCategory(null);
    setParentCategory(null);
    setNewCategory({
      categoryName: "",
      slug: "",
      parentId: categoryTree[0]?.categoryId || 1, // Use the hidden root ID
    });
    setSelectedImage(null); // Reset selected image when creating root
    setIsDialogOpen(true);
  };

  // Generate slug from name automatically
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[đĐ]/g, "d") // Replace Vietnamese characters
      .replace(/[^a-z0-9\s]/g, "") // Keep only alphanumeric and spaces
      .replace(/\s+/g, "-"); // Replace spaces with hyphens
  };

  // Auto-generate slug when name is entered
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewCategory({
      ...newCategory,
      categoryName: name,
      slug: generateSlug(name),
    });
  };

  // Reset form and close dialog
  const resetFormAndCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setParentCategory(null);
    setNewCategory({
      categoryName: "",
      slug: "",
      parentId: null,
    });
    setSelectedImage(null);
  };

  // Render category tree with visual hierarchy
  const renderCategories = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <div key={category.categoryId} className="category-item relative">
        <div
          className="flex items-center justify-between py-3 px-4 border-b hover:bg-slate-50 transition-colors"
          style={{ paddingLeft: `${level * 24 + 16}px` }}
        >
          {/* Connection lines for hierarchy visualization */}
          {level > 0 && (
            <div className="category-tree-line">
              <div
                className="absolute border-l-2 border-slate-200"
                style={{
                  left: `${16 + (level - 1) * 24 + 8}px`,
                  top: 0,
                  height: "50%",
                }}
              />
              <div
                className="absolute border-t-2 border-slate-200"
                style={{
                  left: `${16 + (level - 1) * 24 + 8}px`,
                  width: "16px",
                  top: "50%",
                }}
              />
            </div>
          )}

          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Expand/collapse button or leaf node indicator */}
            <div className="flex-shrink-0">
              {category.children && category.children.length > 0 ? (
                <button
                  className="p-1 rounded-full hover:bg-slate-200"
                  onClick={() => toggleExpandCategory(category.categoryId)}
                  aria-label={
                    expandedCategories.has(category.categoryId)
                      ? "Collapse"
                      : "Expand"
                  }
                >
                  {expandedCategories.has(category.categoryId) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
              )}
            </div>

            {/* Category image thumbnail (if exists) */}
            {category.imageUrl && (
              <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 mr-1">
                <img
                  src={category.imageUrl}
                  alt={category.categoryName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Category name with slug */}
            <div className="truncate">
              <span className="font-medium">{category.categoryName}</span>{" "}
              <span className="text-sm text-muted-foreground">
                ({category.slug})
              </span>
            </div>

            {/* Child count badge */}
            {category.children && category.children.length > 0 && (
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                {category.children.length}
              </span>
            )}
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2 flex-shrink-0 mr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tuỳ chọn</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                  <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCreateCategory(category)}
                >
                  <FolderPlus className="mr-2 h-4 w-4" /> Thêm danh mục con
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteCategory(category.categoryId)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Xoá danh mục
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Render subcategories recursively */}
        {category.children && expandedCategories.has(category.categoryId) && (
          <div className="category-children relative">
            {/* Vertical connection line to children */}
            {category.children.length > 0 && (
              <div
                className="absolute border-l-2 border-slate-200"
                style={{
                  left: `${16 + level * 24 + 8}px`,
                  top: "0",
                  height: "100%",
                }}
              />
            )}
            {renderCategories(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h2>
        <p className="text-muted-foreground">
          Tạo và quản lý các danh mục của website
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-colors">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Tổng số danh mục
            </CardTitle>
            <ListTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{flatCategories.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-colors">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Thống kê</CardTitle>
            <FolderPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {visibleCategories.length} root / {flatCategories.length} total
            </div>
            <p className="text-xs text-muted-foreground">
              Danh mục gốc / Tổng số danh mục
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button onClick={handleCreateRootCategory}>
          <Plus className="mr-2 h-4 w-4" /> Thêm danh mục gốc
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={expandAllCategories}
            className="text-xs"
          >
            <ChevronDown className="h-3.5 w-3.5 mr-1" /> Expand all
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={collapseAllCategories}
            className="text-xs"
          >
            <ChevronRight className="h-3.5 w-3.5 mr-1" /> Collapse all
          </Button>
        </div>
      </div>

      {/* Category list */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-slate-50 py-3 px-4 border-b flex items-center font-medium sticky top-0 z-10">
          <div className="flex-1">Tên danh mục</div>
          <div className="w-[80px] text-center">Tuỳ chọn</div>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : visibleCategories.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>Chưa có danh mục nào. Hãy thêm danh mục gốc.</p>
            </div>
          ) : (
            <div className="category-tree">
              {renderCategories(visibleCategories)}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) resetFormAndCloseDialog();
          else setIsDialogOpen(true);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? "Chỉnh sửa danh mục"
                : parentCategory
                ? `Thêm danh mục con cho "${parentCategory.categoryName}"`
                : "Thêm danh mục gốc"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Chỉnh sửa thông tin danh mục."
                : "Điền các thông tin để tạo danh mục mới"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên danh mục</Label>
              <Input
                id="name"
                value={newCategory.categoryName}
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
                placeholder="ten-danh-muc"
              />
              <p className="text-xs text-muted-foreground">
                Slug sẽ được sử dụng làm URL danh mục
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Hình ảnh danh mục</Label>
              <ImageUploader
                existingImageUrl={editingCategory?.imageUrl}
                onChange={(file) => setSelectedImage(file)}
                isUploading={isUploading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => resetFormAndCloseDialog()}>
              Huỷ
            </Button>
            <Button onClick={handleSaveCategory} disabled={isUploading}>
              {isUploading ? (
                <span className="flex items-center gap-1">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                  {editingCategory ? "Đang cập nhật..." : "Đang tạo..."}
                </span>
              ) : editingCategory ? (
                "Cập nhật"
              ) : (
                "Tạo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
