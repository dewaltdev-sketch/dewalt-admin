import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "@/lib/querykeys";
import { brandContentService } from "../services/brandContentService";
import type { BrandContent } from "../types";

export const useGetBrandContent = () =>
  useQuery<BrandContent>({
    queryKey: QUERY_KEYS.BRAND_CONTENT.ONE,
    queryFn: () => brandContentService.getBrandContent.get(),
  });
