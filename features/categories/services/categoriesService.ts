import { createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  BrandResponse,
  CategoryResponse,
  ChildCategoryResponse,
  CreateBrandDto,
  UpdateBrandDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateChildCategoryDto,
  UpdateChildCategoryDto,
  SetChildCategoryGroupDto,
  ChildCategoryGroupResponse,
  ReorderCategoriesDto,
} from "../types";

const categoriesClient = createApiClient(API_ROUTES.CATEGORIES);

export const categoriesService = {
  // Brands
  getBrands: {
    get: () => categoriesClient.get<BrandResponse[]>({}, "brands/admin"),
  },
  getBrandById: {
    get: (id: string) =>
      categoriesClient.get<BrandResponse>({}, `brands/${id}`),
  },
  createBrand: {
    post: (data: CreateBrandDto) =>
      categoriesClient.post<CreateBrandDto, BrandResponse>(data, undefined, {
        url: `${API_ROUTES.CATEGORIES}/brands`,
      }),
  },
  updateBrand: {
    patch: (id: string, data: UpdateBrandDto) =>
      categoriesClient.patchById<UpdateBrandDto, BrandResponse>(
        `brands/${id}`,
        data
      ),
  },
  deleteBrand: {
    delete: (id: string) => categoriesClient.delete<void>(`brands/${id}`),
  },

  // Categories
  getCategories: {
    get: (brandId?: string) => {
      const params = brandId ? { brandId } : undefined;
      return categoriesClient.get<CategoryResponse[]>(params, "categories");
    },
  },
  getCategoryById: {
    get: (id: string) =>
      categoriesClient.get<CategoryResponse>({}, `categories/${id}`),
  },
  createCategory: {
    post: (data: CreateCategoryDto) =>
      categoriesClient.post<CreateCategoryDto, CategoryResponse>(
        data,
        undefined,
        {
          url: `${API_ROUTES.CATEGORIES}/categories`,
        }
      ),
  },
  updateCategory: {
    patch: (id: string, data: UpdateCategoryDto) =>
      categoriesClient.patchById<UpdateCategoryDto, CategoryResponse>(
        `categories/${id}`,
        data
      ),
  },
  deleteCategory: {
    delete: (id: string) => categoriesClient.delete<void>(`categories/${id}`),
  },
  reorderCategories: {
    patch: (data: ReorderCategoriesDto) =>
      categoriesClient.patchById<ReorderCategoriesDto, void>(
        "categories/reorder",
        data
      ),
  },

  // Child Categories
  getChildCategories: {
    get: (brandId?: string, categoryId?: string) => {
      const params: Record<string, string> = {};
      if (brandId) params.brandId = brandId;
      if (categoryId) params.categoryId = categoryId;
      return categoriesClient.get<ChildCategoryResponse[]>(
        Object.keys(params).length > 0 ? params : undefined,
        "child-categories"
      );
    },
  },
  getChildCategoryById: {
    get: (id: string) =>
      categoriesClient.get<ChildCategoryResponse>({}, `child-categories/${id}`),
  },
  createChildCategory: {
    post: (data: CreateChildCategoryDto) =>
      categoriesClient.post<CreateChildCategoryDto, ChildCategoryResponse>(
        data,
        undefined,
        {
          url: `${API_ROUTES.CATEGORIES}/child-categories`,
        }
      ),
  },
  updateChildCategory: {
    patch: (id: string, data: UpdateChildCategoryDto) =>
      categoriesClient.patchById<UpdateChildCategoryDto, ChildCategoryResponse>(
        `child-categories/${id}`,
        data
      ),
  },
  setChildCategoryGroup: {
    post: (data: SetChildCategoryGroupDto) =>
      categoriesClient.post<SetChildCategoryGroupDto, ChildCategoryGroupResponse>(
        data,
        undefined,
        {
          url: `${API_ROUTES.CATEGORIES}/child-categories/group`,
        }
      ),
  },
  deleteChildCategory: {
    delete: (id: string) =>
      categoriesClient.delete<void>(`child-categories/${id}`),
  },
};
