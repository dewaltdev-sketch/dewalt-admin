import { axiosInstance, createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import type { BrandContent, UpdateBrandContentDto } from "../types";

const brandContentClient = createApiClient<BrandContent>(API_ROUTES.BRAND_CONTENT);

export const brandContentService = {
  getBrandContent: {
    get: (): Promise<BrandContent> => brandContentClient.get<BrandContent>(),
  },
  updateBrandContent: {
    patch: async (data: UpdateBrandContentDto): Promise<BrandContent> => {
      const res = await axiosInstance.patch<BrandContent>(
        API_ROUTES.BRAND_CONTENT,
        data
      );
      return res.data;
    },
  },
};
