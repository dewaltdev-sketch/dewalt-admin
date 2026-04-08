const QUERY_KEYS = {
  BANNER_SLIDER: {
    ALL: ["bannerSlider"],
  },
  NEWS: {
    All: ["news"],
    list: (page?: number, limit?: number) =>
      page !== undefined && limit !== undefined
        ? ["news", page, limit]
        : ["news"],
    BY_ID: (id: string) => ["news", id],
  },
  ADS: {
    ALL: ["ads"],
    BY_ID: (id: string) => ["ads", id],
    BY_POSITION: (position: string) => ["ads", "position", position],
  },
  CATEGORIES: {
    BRANDS: {
      ALL: ["categories", "brands"],
      BY_ID: (id: string) => ["categories", "brands", id],
    },
    CATEGORIES: {
      ALL: ["categories", "categories"],
      BY_ID: (id: string) => ["categories", "categories", id],
      BY_BRAND: (brandId: string) => [
        "categories",
        "categories",
        "brand",
        brandId,
      ],
    },
    CHILD_CATEGORIES: {
      ALL: ["categories", "child-categories"],
      BY_ID: (id: string) => ["categories", "child-categories", id],
      BY_BRAND_CATEGORY: (brandId: string, categoryId: string) => [
        "categories",
        "child-categories",
        "brand",
        brandId,
        "category",
        categoryId,
      ],
    },
  },
  PRODUCTS: {
    ALL: ["products"],
    BY_ID: (id: string) => ["products", id],
    BY_SLUG: (slug: string) => ["products", "slug", slug],
    LIST: (
      page?: number,
      limit?: number,
      filters?: {
        brandId?: string;
        categoryId?: string;
        childCategoryId?: string;
        search?: string;
        inStock?: boolean;
        minPrice?: number;
        maxPrice?: number;
        sort?: string;
      }
    ) => {
      const key: (string | number)[] = ["products", "list"];
      if (page !== undefined) key.push("page", page);
      if (limit !== undefined) key.push("limit", limit);
      if (filters?.brandId) key.push("brand", filters.brandId);
      if (filters?.categoryId) key.push("category", filters.categoryId);
      if (filters?.childCategoryId)
        key.push("childCategory", filters.childCategoryId);
      if (filters?.search) key.push("search", filters.search);
      if (filters?.inStock !== undefined) key.push("inStock", String(filters.inStock));
      if (filters?.minPrice !== undefined) key.push("minPrice", filters.minPrice);
      if (filters?.maxPrice !== undefined) key.push("maxPrice", filters.maxPrice);
      if (filters?.sort) key.push("sort", filters.sort);
      return key;
    },
  },
  USERS: {
    ALL: ["users"],
    LIST: (page?: number, limit?: number, search?: string) => {
      const key: (string | number)[] = ["users", "list"];
      if (page !== undefined) key.push("page", page);
      if (limit !== undefined) key.push("limit", limit);
      if (search) key.push("search", search);
      return key;
    },
  },
  ORDERS: {
    ALL: ["orders"],
    LIST: (
      page?: number,
      limit?: number,
      filters?: { status?: string; uuid?: string; id?: string; email?: string }
    ) => {
      const key: (string | number)[] = ["orders", "list"];
      if (page !== undefined) key.push("page", page);
      if (limit !== undefined) key.push("limit", limit);
      if (filters?.status) key.push("status", filters.status);
      if (filters?.uuid) key.push("uuid", filters.uuid);
      if (filters?.id) key.push("id", filters.id);
      if (filters?.email) key.push("email", filters.email);
      return key;
    },
    BY_ID: (id: string) => ["orders", "byId", id],
  },
  SETTINGS: {
    ONE: ["settings"],
  },
  TERMS: {
    ONE: ["terms"],
  },
  BRAND_CONTENT: {
    ONE: ["brand-content"],
  },
};

export default QUERY_KEYS;
