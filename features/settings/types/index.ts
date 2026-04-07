export interface Settings {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;

  contactPhone?: string;
  contactPhone2?: string;
  contactEmail?: string;
  contactFacebook?: string;
  contactInstagram?: string;
  contactAddress?: { ka: string; en: string };
  aboutTitle?: { ka: string; en: string };
  aboutSubtitle?: { ka: string; en: string };
  aboutContent?: { ka: string; en: string };

  freeDeliveryEnabled: boolean;
  deliveryTbilisiPrice: number;
  deliveryTbilisiFreeOver: number;
  deliveryRegionPrice: number;
  deliveryRegionFreeOver: number;
}

export type UpdateSettingsDto = Partial<Settings>;
