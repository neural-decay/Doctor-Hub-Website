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
    const response = await apiClient.get<ApiResponse<Category[]>>(
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

  create: async (
    category: CategoryCreateDto,
    image?: File
  ): Promise<CategoryResponse> => {
    // if no image uploaded, send request as usual
    if (!image) {
      const response = await apiClient.post<ApiResponse<CategoryResponse>>(
        ENDPOINTS.CATEGORIES.BASE,
        category
      );
      return response.data.result;
    }

    if (!image.type.startsWith("image/")) {
      throw new Error("Just image file is allowed");
    }

    // Use form data to upload files
    const formData = new FormData();

    // Add JSON of category into formdata
    formData.append(
      "categoryData",
      new Blob([JSON.stringify(category)], {
        type: "application/json",
      })
    );

    // Add image
    formData.append("image", image);
    const response = await apiClient.post<ApiResponse<CategoryResponse>>(
      ENDPOINTS.CATEGORIES.BASE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.result;
  },

  update: async (
    id: number,
    category: CategoryUpdateDto,
    image?: File
  ): Promise<CategoryResponse> => {
    // if no image uploaded, send request as usual
    if (!image) {
      const response = await apiClient.put<ApiResponse<CategoryResponse>>(
        `${ENDPOINTS.CATEGORIES.BASE}/${id}`,
        category
      );
      return response.data.result;
    }

    if (!image.type.startsWith("image/")) {
      throw new Error("Just image file is allowed");
    }

    // Use form data to upload files
    const formData = new FormData();

    // Add JSON of category into formdata
    formData.append(
      "categoryData",
      new Blob([JSON.stringify(category)], {
        type: "application/json",
      })
    );

    // Add image
    formData.append("image", image);
    const response = await apiClient.put<ApiResponse<CategoryResponse>>(
      `${ENDPOINTS.CATEGORIES.BASE}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
