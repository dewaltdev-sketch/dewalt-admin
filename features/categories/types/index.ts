// Localized text type matching backend structure
export interface LocalizedText {
  ka: string;
  en: string;
}

// Brand type matching backend structure
export interface Brand {
  _id: string;
  name: LocalizedText;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Category type matching backend structure
export interface Category {
  _id: string;
  name: LocalizedText;
  slug: string;
  brandIds: Brand[];
  brandId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Child Category type matching backend structure
export interface ChildCategory {
  _id: string;
  name: LocalizedText;
  slug: string;
  brandIds?: Brand[];
  categoryId?: string | Category;
  createdAt: string;
  updatedAt: string;
}

export interface ChildCategoryGroup {
  brandId: string;
  categoryId: string;
  childCategoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

// DTOs for creating and updating
export interface CreateBrandDto {
  name: LocalizedText;
  slug: string;
}

export interface UpdateBrandDto {
  name?: LocalizedText;
  slug?: string;
}

export interface CreateCategoryDto {
  name: LocalizedText;
  slug: string;
  brandIds?: string[];
}

export interface UpdateCategoryDto {
  name?: LocalizedText;
  slug?: string;
  brandIds?: string[];
}

export interface CreateChildCategoryDto {
  name: LocalizedText;
  slug: string;
  brandIds?: string[];
  categoryId?: string;
}

export interface UpdateChildCategoryDto {
  name?: LocalizedText;
  slug?: string;
  brandIds?: string[];
  categoryId?: string;
}

export interface SetChildCategoryGroupDto {
  brandId: string;
  categoryId: string;
  childCategoryIds: string[];
}

export interface ReorderCategoriesDto {
  categoryIds: string[];
}

// Response types
export type BrandResponse = Brand;
export type CategoryResponse = Category;
export type ChildCategoryResponse = ChildCategory;
export type ChildCategoryGroupResponse = ChildCategoryGroup;
