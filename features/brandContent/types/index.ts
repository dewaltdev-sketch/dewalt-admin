export type LocalizedText = {
  ka: string;
  en: string;
};

export type BrandTextBlock = {
  cardDescription?: LocalizedText;
  aboutContent?: LocalizedText;
};

export interface BrandContent {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  dewalt?: BrandTextBlock;
  stanley?: BrandTextBlock;
  blackDecker?: BrandTextBlock;
}

export type UpdateBrandContentDto = Partial<BrandContent>;
