import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import { ReorderCategoriesDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/apiClient";

export const useReorderCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReorderCategoriesDto) =>
      categoriesService.reorderCategories.patch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CATEGORIES.ALL,
      });
      toast.success("კატეგორიების თანმიმდევრობა წარმატებით შეიცვალა!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(
        error.message ||
          "კატეგორიების თანმიმდევრობის შეცვლა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};
