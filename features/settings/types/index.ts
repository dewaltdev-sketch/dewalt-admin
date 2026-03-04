export interface Settings {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;

  contactPhone?: string;
  contactPhone2?: string;
  contactEmail?: string;
  contactFacebook?: string;
  contactAddress?: { ka: string; en: string };

  freeDeliveryEnabled: boolean;
  deliveryTbilisiPrice: number;
  deliveryTbilisiFreeOver: number;
  deliveryRegionPrice: number;
  deliveryRegionFreeOver: number;
}

export type UpdateSettingsDto = Partial<Settings>;

