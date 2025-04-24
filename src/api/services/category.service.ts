import apiClient from "../axios";
import { ENDPOINTS } from "../constants";
import { Category, CategoryCreateDto, CategoryUpdateDto, CategoryResponse } from "../types/category.types";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>(ENDPOINTS.CATEGORIES.BASE);
    return response.data;
  },
  
  getTree: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>(ENDPOINTS.CATEGORIES.TREE);
    return response.data;
  },
  
  create: async (category: CategoryCreateDto): Promise<CategoryResponse> => {
    const response = await apiClient.post<CategoryResponse>(ENDPOINTS.CATEGORIES.BASE, category);
    return response.data;
  },
  
  update: async (id: number, category: CategoryUpdateDto): Promise<CategoryResponse> => {
    const response = await apiClient.put<CategoryResponse>(`${ENDPOINTS.CATEGORIES.BASE}/${id}`, category);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.CATEGORIES.BASE}/${id}`);
  }
}