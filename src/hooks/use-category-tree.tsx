import { useState, useEffect, useCallback } from "react";
import {
  Category,
  CategoryCreateDto,
  CategoryUpdateDto,
} from "../api/types/category.types";
import { categoryService } from "../api/services/category.service";
export function useCategoryTree() {
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Category tree
  const fetchCategoryTree = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const tree = await categoryService.getTree();
      setCategoryTree(tree);

      // Expand all categories from root
      const rootIds = tree.map((c) => c.categoryId);
      setExpandedCategories(new Set(rootIds));
    } catch (err: any) {
      console.error("Error fetching category tree:", err);
      setError(err?.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Expand and collapse categories
  const toggleExpandCategory = useCallback((categoryId: number) => {
    setExpandedCategories((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      return newExpanded;
    });
  }, []);

  const addCategory = useCallback(
    async (category: CategoryCreateDto, image?: File) => {
      try {
        await categoryService.create(category, image);
        fetchCategoryTree(); // Reload tree
      } catch (err: any) {
        console.error("Error creating category:", err);
        throw err;
      }
    },
    [fetchCategoryTree]
  );

  const updateCategory = useCallback(
    async (id: number, category: CategoryUpdateDto, image?: File) => {
      try {
        await categoryService.update(id, category, image);
        fetchCategoryTree(); // Reload tree
      } catch (err: any) {
        console.error("Error updating category:", err);
        throw err;
      }
    },
    [fetchCategoryTree]
  );

  const deleteCategory = useCallback(
    async (id: number) => {
      try {
        await categoryService.delete(id);
        fetchCategoryTree(); // reload tree
      } catch (err: any) {
        console.error("Error deleting category:", err);
        throw err;
      }
    },
    [fetchCategoryTree]
  );

  // Reload data
  useEffect(() => {
    fetchCategoryTree();
  }, [fetchCategoryTree]);

  return {
    categoryTree,
    isLoading,
    error,
    expandedCategories,
    toggleExpandCategory,
    fetchCategoryTree,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
