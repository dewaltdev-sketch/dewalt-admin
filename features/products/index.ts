// Types
export * from "./types";

// Services
export { productsService } from "./services/productsService";

// Components
export { ProductsTable } from "./components/products-table";
export { ProductForm } from "./components/product-form";

// Hooks
export { useGetProducts } from "./hooks/useGetProducts";
export { useGetProductById } from "./hooks/useGetProductById";
export { useCreateProduct } from "./hooks/useCreateProduct";
export { useUpdateProduct } from "./hooks/useUpdateProduct";
export { useDeleteProduct } from "./hooks/useDeleteProduct";
export { useReorderProducts } from "./hooks/useReorderProducts";
