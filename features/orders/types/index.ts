export type OrderStatus =
  | "pending"
  | "failed"
  | "paid"
  | "shipped"
  | "delivered";

export type DeliveryType = "tbilisi" | "region";

export interface OrderUser {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

export interface OrderItem {
  productId: string | ProductSummary;
  name: LocalizedText;
  image: string;
  finaCode?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export type LocalizedText = { ka: string; en: string };

export interface ProductSummary {
  _id: string;
  name?: LocalizedText | string;
  code?: string;
  image?: string;
  images?: string[];
  slug?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  quantity?: number;
  finaId?: number;
  finaCode?: string;
  specs?: unknown[];
}

export interface Order {
  _id: string;
  uuid: string;
  name: string;
  surname: string;
  email?: string;
  personalId: string;
  phone: string;
  address: string;
  deliveryType: DeliveryType;
  deliveryPrice: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  userId?: OrderUser | string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersListResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  pages?: number;
}

export interface OrderDetailsResponse {
  order: Order;
  ordersCountForUser: number;
}
