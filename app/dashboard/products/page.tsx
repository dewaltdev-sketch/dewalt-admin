"use client";

import { useState, useMemo, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useDebounce } from "@/hooks/useDebaunce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductsTable } from "@/features/products/components/products-table";
import { ProductForm } from "@/features/products/components/product-form";
import { ProductFormErrorFallback } from "@/features/products/components/product-form-error-fallback";
import { Pagination } from "@/components/pagination";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from "@/features/products/types";
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useReorderProducts,
} from "@/features/products";
import {
  useGetBrands,
  useGetCategories,
  useGetChildCategories,
} from "@/features/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const limit = 40;

export default function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState<string>("all");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [childCategoryId, setChildCategoryId] = useState<string>("all");
  const [inStockFilter, setInStockFilter] = useState<string>("all"); // all | true | false
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<string>(""); // price-asc | price-desc | ""

  const debouncedSearch = useDebounce(search, 400);
  const debouncedMinPrice = useDebounce(minPrice, 400);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);
  const hasScopedReorderSelection =
    brandId !== "all" &&
    categoryId !== "all" &&
    childCategoryId !== "all" &&
    Boolean(brandId) &&
    Boolean(categoryId) &&
    Boolean(childCategoryId);

  const isProductReorderEnabled =
    hasScopedReorderSelection &&
    search.trim() === "" &&
    inStockFilter === "all" &&
    minPrice.trim() === "" &&
    maxPrice.trim() === "" &&
    sort === "";
  const effectivePage = isProductReorderEnabled ? 1 : page;
  const effectiveLimit = isProductReorderEnabled ? 1000 : limit;

  const { data: brands } = useGetBrands();
  const { data: categories } = useGetCategories();
  const { data: childCategories } = useGetChildCategories(
    brandId || undefined,
    categoryId || undefined
  );

  const { inStock, parsedMinPrice, parsedMaxPrice } = useMemo(() => {
    const nextInStock =
      inStockFilter === "all" ? undefined : inStockFilter === "true";

    const min =
      debouncedMinPrice.trim() === "" ? undefined : Number(debouncedMinPrice);
    const max =
      debouncedMaxPrice.trim() === "" ? undefined : Number(debouncedMaxPrice);

    const safeMin = Number.isFinite(min) ? min : undefined;
    const safeMax = Number.isFinite(max) ? max : undefined;

    if (safeMin !== undefined && safeMax !== undefined && safeMin > safeMax) {
      return {
        inStock: nextInStock,
        parsedMinPrice: safeMax,
        parsedMaxPrice: safeMin,
      };
    }

    return {
      inStock: nextInStock,
      parsedMinPrice: safeMin,
      parsedMaxPrice: safeMax,
    };
  }, [inStockFilter, debouncedMinPrice, debouncedMaxPrice]);

  const effectiveSearch = useMemo(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed.length === 0) return undefined;
    if (trimmed.length <= 2) return undefined;
    return trimmed;
  }, [debouncedSearch]);

  useEffect(() => {
    // Reset pagination only after debounced filters actually change (prevents heavy typing / extra requests)
    const t = setTimeout(() => {
      setPage((prev) => (prev === 1 ? prev : 1));
    }, 0);
    return () => clearTimeout(t);
  }, [effectiveSearch, parsedMinPrice, parsedMaxPrice]);

  const { data, isLoading, error } = useGetProducts({
    page: effectivePage,
    limit: effectiveLimit,
    brandId: brandId || undefined,
    categoryId: categoryId || undefined,
    childCategoryId: childCategoryId || undefined,
    search: effectiveSearch,
    inStock,
    minPrice: parsedMinPrice,
    maxPrice: parsedMaxPrice,
    sort: sort || undefined,
  });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const reorderProducts = useReorderProducts();

  const products = data?.data || [];

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ პროდუქტის წაშლა?")) {
      deleteProduct.mutate(id);
    }
  };

  const handleReorder = (productIds: string[]) => {
    if (!childCategoryId || childCategoryId === "all") return;

    reorderProducts.mutate({
      productIds,
      childCategoryId,
    });
  };

  const handleCreateProduct = async (data: CreateProductDto) => {
    await createProduct.mutateAsync(data);
    setIsDialogOpen(false);
  };

  const handleUpdateProduct = async (id: string, data: UpdateProductDto) => {
    await updateProduct.mutateAsync({ id, data });
    setIsDialogOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = () => {
    setPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleBrandChange = (value: string) => {
    setBrandId(value);
    setCategoryId(""); // Reset category when brand changes
    setChildCategoryId(""); // Reset child category when brand changes
    handleFilterChange();
  };

  const handleCategoryChange = (value: string | undefined) => {
    setCategoryId(value || "");
    setChildCategoryId(""); // Reset child category when category changes
    handleFilterChange();
  };

  const handleChildCategoryChange = (value: string) => {
    setChildCategoryId(value);
    handleFilterChange();
  };

  const handleInStockChange = (value: string) => {
    setInStockFilter(value);
    handleFilterChange();
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
  };

  const handleSortChange = (value: string) => {
    setSort(value === "default" ? "" : value);
    handleFilterChange();
  };

  const handleClearFilters = () => {
    setSearch("");
    setBrandId("");
    setCategoryId("");
    setChildCategoryId("");
    setInStockFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return !!(
      search ||
      brandId ||
      categoryId ||
      childCategoryId ||
      inStockFilter !== "all" ||
      minPrice.trim() !== "" ||
      maxPrice.trim() !== "" ||
      sort
    );
  }, [
    search,
    brandId,
    categoryId,
    childCategoryId,
    inStockFilter,
    minPrice,
    maxPrice,
    sort,
  ]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          პროდუქტების ჩატვირთვის შეცდომა:{" "}
          {error instanceof Error ? error.message : "უცნობი შეცდომა"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>პროდუქტები</CardTitle>
              <CardDescription>
                მართეთ პროდუქციის კატალოგი. შექმენით, დაარედაქტირეთ და წაშალეთ
                პროდუქტები.
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              პროდუქტის დამატება
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="search">ძიება</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="მოძებნეთ პროდუქტები..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <Label htmlFor="brand-filter">ბრენდი</Label>
                <Select
                  value={brandId || undefined}
                  onValueChange={handleBrandChange}
                >
                  <SelectTrigger id="brand-filter">
                    <SelectValue placeholder="ყველა ბრენდი" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ყველა ბრენდი</SelectItem>
                    {brands?.map((brand) => (
                      <SelectItem key={brand._id} value={brand._id}>
                        {brand.name.ka}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label htmlFor="category-filter">კატეგორია</Label>
                <Select
                  value={categoryId || undefined}
                  onValueChange={(val) =>
                    handleCategoryChange(val || undefined)
                  }
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="ყველა კატეგორია" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ყველა კატეგორია</SelectItem>
                    {categories
                      ?.filter((category) => {
                        if (brandId && brandId !== "all") {
                          const categoryBrandIds = Array.isArray(
                            category.brandIds
                          )
                            ? category.brandIds.map((b) =>
                                typeof b === "string" ? b : b._id
                              )
                            : [];
                          return categoryBrandIds.includes(brandId);
                        }
                        return true;
                      })
                      .map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name.ka}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Child Category Filter */}
              <div className="space-y-2">
                <Label htmlFor="childCategory">ქვე-კატეგორია</Label>
                <Select
                  value={childCategoryId || undefined}
                  onValueChange={handleChildCategoryChange}
                  disabled={!categoryId}
                >
                  <SelectTrigger id="childCategory">
                    <SelectValue placeholder="ყველა ქვე-კატეგორია" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ყველა ქვე-კატეგორია</SelectItem>
                    {childCategories?.map((child) => (
                      <SelectItem key={child._id} value={child._id}>
                        {child.name.ka}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* In Stock */}
              <div className="space-y-2">
                <Label htmlFor="inStock-filter">მარაგი</Label>
                <Select
                  value={inStockFilter}
                  onValueChange={handleInStockChange}
                >
                  <SelectTrigger id="inStock-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ყველა</SelectItem>
                    <SelectItem value="true">მარაგშია</SelectItem>
                    <SelectItem value="false">არ არის მარაგში</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Price */}
              <div className="space-y-2">
                <Label htmlFor="minPrice">მინ. ფასი</Label>
                <Input
                  id="minPrice"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => handleMinPriceChange(e.target.value)}
                />
              </div>

              {/* Max Price */}
              <div className="space-y-2">
                <Label htmlFor="maxPrice">მაქს. ფასი</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  inputMode="numeric"
                  placeholder="99999"
                  value={maxPrice}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                />
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <Label htmlFor="sort">სორტირება</Label>
                <Select
                  value={sort || "default"}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger id="sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">დეფოლტი</SelectItem>
                    <SelectItem value="price-asc">ფასი: ზრდადი</SelectItem>
                    <SelectItem value="price-desc">ფასი: კლებადი</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex items-end md:col-span-2 lg:col-span-2">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    ფილტრების გასუფთავება
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Products Table */}
          {hasScopedReorderSelection && !isProductReorderEnabled ? (
            <div className="mb-4 rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
              drag-and-drop რეორდერისთვის დატოვეთ მხოლოდ ბრენდი, კატეგორია და
              ქვე-კატეგორია. სხვა ფილტრები და სორტირება უნდა იყოს გამორთული.
            </div>
          ) : null}
          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            enableReorder={isProductReorderEnabled}
            onReorder={handleReorder}
            isReordering={reorderProducts.isPending}
          />

          {/* Pagination */}
          {!isProductReorderEnabled && data && data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                ნაჩვენებია {(page - 1) * limit + 1}-დან{" "}
                {Math.min(page * limit, data.total)}-მდე, სულ {data.total}{" "}
                პროდუქტი
              </div>
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {isDialogOpen && (
        <ErrorBoundary
          resetKeys={[isDialogOpen, editingProduct?._id ?? "new"]}
          fallbackRender={(props) => (
            <ProductFormErrorFallback {...props} onClose={handleDialogClose} />
          )}
        >
          <ProductForm
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            product={editingProduct}
            onCreate={handleCreateProduct}
            onUpdate={handleUpdateProduct}
            isCreating={createProduct.isPending}
            isUpdating={updateProduct.isPending}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
