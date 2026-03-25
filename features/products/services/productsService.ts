import { createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  ProductResponse,
  CreateProductDto,
  UpdateProductDto,
} from "../types";

const productsClient = createApiClient(API_ROUTES.PRODUCTS);

export interface ProductsListResponse {
  data: ProductResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const productsService = {
  getProducts: {
    get: (params?: {
      page?: number;
      limit?: number;
      brandId?: string;
      categoryId?: string;
      childCategoryId?: string;
      inStock?: boolean;
      minPrice?: number;
      maxPrice?: number;
      search?: string;
      sort?: string;
    }): Promise<ProductsListResponse> => {
      const queryParams: Record<string, string | number | boolean> = {};
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.brandId) queryParams.brandId = params.brandId;
      if (params?.categoryId) queryParams.categoryId = params.categoryId;
      if (params?.childCategoryId)
        queryParams.childCategoryId = params.childCategoryId;
      if (params?.inStock !== undefined) queryParams.inStock = params.inStock;
      if (params?.minPrice !== undefined) queryParams.minPrice = params.minPrice;
      if (params?.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice;
      if (params?.search) queryParams.search = params.search;
      if (params?.sort) queryParams.sort = params.sort;

      return productsClient.get<ProductsListResponse>(
        Object.keys(queryParams).length > 0 ? queryParams : undefined,
        "admin"
      );
    },
  },
  getProductById: {
    get: (id: string) => productsClient.get<ProductResponse>({}, id),
  },
  createProduct: {
    post: (data: CreateProductDto) =>
      productsClient.post<CreateProductDto, ProductResponse>(data),
  },
  updateProduct: {
    post: (id: string, data: UpdateProductDto) =>
      productsClient.post<UpdateProductDto, ProductResponse>(
        data,
        undefined,
        { url: `${API_ROUTES.PRODUCTS}/${id}` }
      ),
  },
  deleteProduct: {
    delete: (id: string) => productsClient.delete<void>(id),
  },
  updateSliderNumber: {
    patch: (id: string, sliderNumber: number | null) =>
      productsClient.patchById<{ sliderNumber: number | null }, ProductResponse>(
        `${id}/slider-number`,
        { sliderNumber }
      ),
  },
};

