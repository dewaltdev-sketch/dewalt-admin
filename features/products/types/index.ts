import type { LocalizedText } from "@/features/categories/types";

export interface ProductSpec {
  label: LocalizedText;
  value: LocalizedText;
}

export interface Product {
  _id: string;
  name: LocalizedText;
  finaId?: number;
  finaCode?: string;
  description: LocalizedText;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  rating: number;
  reviewCount: number;
  brandId: { _id: string; name: LocalizedText; slug: string };
  categoryId: { _id: string; name: LocalizedText; slug: string };
  childCategoryId?: { _id: string; name: LocalizedText; slug: string };
  sliderNumber?: number | null;
  specs: ProductSpec[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: LocalizedText;
  finaId?: number;
  finaCode?: string;
  description: LocalizedText;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity?: number;
  rating?: number;
  reviewCount?: number;
  brandId: string;
  categoryId: string;
  childCategoryId?: string;
  specs?: ProductSpec[];
}

export interface UpdateProductDto {
  name?: LocalizedText;
  finaId?: number;
  finaCode?: string;
  description?: LocalizedText;
  image?: string;
  images?: string[];
  price?: number;
  originalPrice?: number;
  discount?: number;
  quantity?: number;
  rating?: number;
  reviewCount?: number;
  brandId?: string;
  categoryId?: string;
  childCategoryId?: string;
  specs?: ProductSpec[];
}

export type ProductResponse = Product;
