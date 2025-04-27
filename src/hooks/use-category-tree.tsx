import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryCreateDto, CategoryUpdateDto } from '../api/types/category.types';
import { categoryService } from '../api/services/category.service';
import { useToast } from './use-toast';

export function useCategoryTree() {
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategoryTree = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const tree = await categoryService.getTree();
      setCategoryTree(tree);
      
      // Expand all categories from root
      const rootIds = tree.map(c => c.categoryId);
      setExpandedCategories(new Set(rootIds));
      
    } catch (err: any) {
      console.error('Error fetching category tree:', err);
      setError(err?.message || 'Failed to fetch categories');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load category structure",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Expand and collapse categories
  const toggleExpandCategory = useCallback((categoryId: number) => {
    setExpandedCategories(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      return newExpanded;
    });
  }, []);
  
  const addCategory = useCallback(async (category: CategoryCreateDto) => {
    try {
      await categoryService.create(category);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      fetchCategoryTree(); // Tải lại cấu trúc cây
    } catch (err: any) {
      console.error('Error creating category:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to create category",
      });
      throw err;
    }
  }, [fetchCategoryTree, toast]);
  
  const updateCategory = useCallback(async (id: number, category: CategoryUpdateDto) => {
    try {
      await categoryService.update(id, category);
      toast({
        title: "Success", 
        description: "Category updated successfully",
      });
      fetchCategoryTree(); // Reload tree
    } catch (err: any) {
      console.error('Error updating category:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to update category",
      });
      throw err;
    }
  }, [fetchCategoryTree, toast]);
  
  const deleteCategory = useCallback(async (id: number) => {
    try {
      await categoryService.delete(id);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      fetchCategoryTree(); // reload tree
    } catch (err: any) {
      console.error('Error deleting category:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to delete category",
      });
      throw err;
    }
  }, [fetchCategoryTree, toast]);
  
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