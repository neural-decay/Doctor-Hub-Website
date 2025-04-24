export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH_TOKEN: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id: number) => `/categories/${id}`,
    TREE: "/categories/tree",
    CHILDREN: (id: number) => `/categories/${id}/children`,
    PATH: (id: number) => `categories/${id}/path`,

  },
  POSTS: {
    BASE: "/posts",
    BY_ID: (id: string) => `/posts/${id}`,
    TOGGLE_STATUS: (id: string) => `/posts/${id}/status`,
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
