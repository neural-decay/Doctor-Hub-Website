import apiClient from "../axios";
import { ENDPOINTS } from "../constants";
import {
  Category,
  CategoryCreateDto,
  CategoryUpdateDto,
  CategoryResponse,
} from "../types/category.types";
import { ApiResponse } from "../types/common.types";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      ENDPOINTS.CATEGORIES.BASE
    );
    return response.data.result;
  },

  getTree: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>> (
      ENDPOINTS.CATEGORIES.TREE
    );
    return response.data.result;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      `${ENDPOINTS.CATEGORIES.BASE}/${id}`
    );
    return response.data.result;
  },

  getChildren: async (id: number): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      `${ENDPOINTS.CATEGORIES.BASE}/${id}/children`
    );
    return response.data.result;
  },

  getPath: async (id: number): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      `${ENDPOINTS.CATEGORIES.BASE}/${id}/path`
    );
    return response.data.result;
  },

  create: async (category: CategoryCreateDto): Promise<CategoryResponse> => {
    const response = await apiClient.post<ApiResponse<CategoryResponse>>(
      ENDPOINTS.CATEGORIES.BASE,
      category
    );
    return response.data.result;
  },

  update: async (
    id: number,
    category: CategoryUpdateDto
  ): Promise<CategoryResponse> => {
    const response = await apiClient.put<ApiResponse<CategoryResponse>>(
      `${ENDPOINTS.CATEGORIES.BASE}/${id}`,
      category
    );
    return response.data.result;
  },

  delete: async (id: number): Promise<string> => {
    const response = await apiClient.delete<ApiResponse<string>>(
      `${ENDPOINTS.CATEGORIES.BASE}/${id}`
    );
    return response.data.result;
  },
};
