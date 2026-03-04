import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "@/lib/querykeys";
import { settingsService } from "../services/settingsService";
import type { Settings } from "../types";

export const useGetSettings = () => {
  return useQuery<Settings>({
    queryKey: QUERY_KEYS.SETTINGS.ONE,
    queryFn: () => settingsService.getSettings.get(),
  });
};

