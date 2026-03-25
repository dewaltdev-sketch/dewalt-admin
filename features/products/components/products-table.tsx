"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "../types";
import Image from "next/image";
import TableRowSkeleton from "./ProductTableRowSkeleton";
import { SliderSelect } from "./SliderSelect";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  isLoading = false,
}: ProductsTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>სურათი</TableHead>
              <TableHead>დასახელება (EN / KA)</TableHead>
              <TableHead>FINA კოდი</TableHead>
              <TableHead>ფასი</TableHead>
              <TableHead>ბრენდი</TableHead>
              <TableHead>კატეგორია</TableHead>
              <TableHead>სუბ კატეგორია</TableHead>
              <TableHead>მარაგი</TableHead>
              <TableHead>სლაიდერში</TableHead>
              <TableHead className="text-right">მოქმედებები</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRowSkeleton numberOfRows={10} />
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  პროდუქტები ვერ მოიძებნა.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const brandName =
                  typeof product.brandId === "string"
                    ? "-"
                    : product?.brandId?.name.ka;
                const categoryName =
                  typeof product.categoryId === "string"
                    ? "-"
                    : product?.categoryId?.name.ka;

                return (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="relative w-24 h-16 border rounded-md overflow-hidden bg-muted">
                        <Image
                          src={product.image}
                          alt={
                            product.name?.ka || product.name?.en || "პროდუქტი"
                          }
                          fill
                          className="object-fit"
                          sizes="96px"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {product.name.en}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.name.ka}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono">
                        {product.finaCode}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {product.price} GEL
                        {product.originalPrice ? (
                          <span className="text-xs text-muted-foreground line-through ml-2">
                            {product.originalPrice} GEL
                          </span>
                        ) : null}
                      </div>
                      {product.discount ? (
                        <div className="text-xs text-destructive">
                          -{product.discount}%
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{brandName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{categoryName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {product.childCategoryId?.name.ka}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.quantity > 0 ? "default" : "outline"}
                      >
                        {product.quantity > 0
                          ? `მარაგშია (${product.quantity})`
                          : "არ არის მარაგში"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <SliderSelect
                        productId={product._id}
                        currentValue={product.sliderNumber}
                      />
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(product._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
