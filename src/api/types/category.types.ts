export interface Category {
  categoryId: number;
  categoryName: string;
  slug: string;
  urlImage?: string;
  lft: number;
  rgt: number;
  parentId: number | null;
  level: number;
  children?: Category[];
}

// Request DTOs
export interface CategoryCreateDto {
  categoryName: string;
  slug: string;
  imageUrl?: string;
  parentId: number | null;
}

export interface CategoryUpdateDto {
  categoryName?: string;
  slug?: string;
  imageUrl?: string;
}

// Response DTOs
export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  slug: string;
  urlImage: string;
  lft: number;
  rgt: number;
  parentId: number;
  level: number;
}