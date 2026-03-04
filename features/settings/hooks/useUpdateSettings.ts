import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import QUERY_KEYS from "@/lib/querykeys";
import { settingsService } from "../services/settingsService";
import type { UpdateSettingsDto } from "../types";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsDto) =>
      settingsService.updateSettings.patch(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SETTINGS.ONE });
      toast.success("პარამეტრები წარმატებით განახლდა!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "პარამეტრების განახლება ვერ მოხერხდა. სცადეთ თავიდან."
      );
    },
  });
};

