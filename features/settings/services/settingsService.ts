import { axiosInstance, createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import type { Settings, UpdateSettingsDto } from "../types";

const settingsClient = createApiClient<Settings>(API_ROUTES.SETTINGS);

export const settingsService = {
  getSettings: {
    get: (): Promise<Settings> => settingsClient.get<Settings>(),
  },
  updateSettings: {
    patch: async (data: UpdateSettingsDto): Promise<Settings> => {
      const res = await axiosInstance.patch<Settings>(API_ROUTES.SETTINGS, data);
      return res.data;
    },
  },
};

