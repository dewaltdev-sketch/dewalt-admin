import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services/productsService";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import type { ApiErrorResponse } from "@/lib/apiClient";

export const useUpdateSliderNumber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      sliderNumber,
    }: {
      id: string;
      sliderNumber: number | null;
    }) => productsService.updateSliderNumber.patch(id, sliderNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS.ALL,
      });
      toast.success("სლაიდერი წარმატებით განახლდა!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(
        error.message ||
          "სლაიდერის განახლება ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};
