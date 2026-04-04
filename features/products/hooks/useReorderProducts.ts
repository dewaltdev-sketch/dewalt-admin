import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services/productsService";
import { ReorderProductsDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import type { ApiErrorResponse } from "@/lib/apiClient";

export const useReorderProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderProductsDto) =>
      productsService.reorderProducts.patch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS.ALL,
      });
      toast.success("პროდუქტების თანმიმდევრობა წარმატებით შეიცვალა!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(
        error.message ||
          "პროდუქტების თანმიმდევრობის შეცვლა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};
