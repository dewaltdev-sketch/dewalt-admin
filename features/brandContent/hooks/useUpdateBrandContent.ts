import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import QUERY_KEYS from "@/lib/querykeys";
import { brandContentService } from "../services/brandContentService";
import type { UpdateBrandContentDto } from "../types";

export const useUpdateBrandContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBrandContentDto) =>
      brandContentService.updateBrandContent.patch(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BRAND_CONTENT.ONE,
      });
      toast.success("ბრენდების ტექსტები წარმატებით განახლდა!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "ბრენდების ტექსტების განახლება ვერ მოხერხდა. სცადეთ თავიდან."
      );
    },
  });
};
